function eValidoCPF(cpf) {
  let sum = 0;
  let resto;
  if (/^(\d)\1+$/.test(cpf)) return false;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
  resto = (sum * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
  resto = (sum * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

function eValidoData(dateStr) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [dia, mes, ano] = dateStr.split("/").map(Number);
  if (
    mes < 1 ||
    mes > 12 ||
    dia < 1 ||
    dia > 31 ||
    ano < 1900 ||
    ano > new Date().getFullYear() + 1
  )
    return false;
  if ([4, 6, 9, 11].includes(mes) && dia > 30) return false;
  if (mes === 2) {
    const eAnoBissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
    if (dia > (eAnoBissexto ? 29 : 28)) return false;
  }
  const dataObj = new Date(ano, mes - 1, dia);
  return (
    dataObj.getFullYear() === ano &&
    dataObj.getMonth() === mes - 1 &&
    dataObj.getDate() === dia
  );
}

function temPeloMenos18(dateStr) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [dia, mes, ano] = dateStr.split("/").map(Number);
  const dataDeNascimento = new Date(ano, mes - 1, dia);
  const dataAtual = new Date();
  let idade = dataAtual.getFullYear() - dataDeNascimento.getFullYear();
  const m = dataAtual.getMonth() - dataDeNascimento.getMonth();
  if (m < 0 || (m === 0 && dataAtual.getDate() < dataDeNascimento.getDate()))
    idade--;
  return idade >= 18;
}

function mostraErro(campoId, message) {
  const campo = document.getElementById(campoId);
  if (!campo) return;
  const proximoElemento = campo.nextSibling;
  if (proximoElemento && proximoElemento.className === "error-message") {
    proximoElemento.remove();
  }
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";
  errorDiv.textContent = message;
  campo.parentNode.insertBefore(errorDiv, campo.nextSibling);
}

function limpaErros() {
  const mensagensDeErro = document.querySelectorAll(".error-message");
  mensagensDeErro.forEach((error) => error.remove());
}

function obterDadosCadastroForm() {
  return {
    nome: document.getElementById("nome").value.trim(),
    cpf: document.getElementById("cpf").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    email: document.getElementById("email").value.trim(),
    senha: document.getElementById("senha").value.trim(),
    confirmarSenha: document.getElementById("confirmarSenha").value.trim(),
    cep: document.getElementById("CEP").value.trim(),
    numero: document.getElementById("numero").value.trim(),
    rua: document.getElementById("rua").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    estado: document.getElementById("estado").value.trim(),
    complemento: document.getElementById("complemento").value.trim(),
    dataNascimento: document.getElementById("data-nascimento").value.trim(),
  };
}

function validarNome(nome) {
  if (nome.length <= 3) {
    mostraErro("nome", "O nome deve ter mais de 3 letras");
    return false;
  }
  return true;
}

function validarCPF(cpf, dados) {
  const cpfLimpo = cpf.replace(/[^\d]/g, "");
  if (cpfLimpo.length !== 11 || !eValidoCPF(cpfLimpo)) {
    mostraErro("cpf", "CPF inválido.");
    return false;
  }
  dados.cpfLimpo = cpfLimpo;
  return true;
}

function validarTelefone(telefone, dados) {
  const phoneLimpo = telefone.replace(/[^\d]/g, "");
  if (!/^(\d{2}9?\d{8})$/.test(phoneLimpo)) {
    mostraErro("telefone", "Telefone inválido. Formato: (XX) XXXXX-XXXX");
    return false;
  }
  dados.phoneLimpo = phoneLimpo;
  return true;
}

function validarEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostraErro("email", "Email inválido");
    return false;
  }
  return true;
}

function validarDataNascimento(dataNascimento) {
  if (!dataNascimento) {
    mostraErro("data-nascimento", "Data de nascimento é obrigatória.");
    return false;
  }
  if (!eValidoData(dataNascimento)) {
    mostraErro("data-nascimento", "Data inválida. Formato: DD/MM/AAAA");
    return false;
  }
  if (!temPeloMenos18(dataNascimento)) {
    mostraErro("data-nascimento", "Você deve ter pelo menos 18 anos.");
    return false;
  }
  return true;
}

function validarSenha(senha, confirmarSenha) {
  if (senha.length < 8) {
    mostraErro("senha", "A senha deve ter pelo menos 8 caracteres");
    return false;
  }
  if (!/[A-Z]/.test(senha)) {
    mostraErro("senha", "A senha deve conter pelo menos uma letra maiúscula");
    return false;
  }
  if (!/\d/.test(senha)) {
    mostraErro("senha", "A senha deve conter pelo menos um número");
    return false;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    mostraErro(
      "senha",
      "A senha deve conter um caractere especial (ex: !@#$%)"
    );
    return false;
  }
  if (senha !== confirmarSenha) {
    mostraErro("confirmarSenha", "As senhas não coincidem");
    return false;
  }
  return true;
}

function validarCEP(cep, dados) {
  const cepLimpo = cep.replace(/[^\d]/g, "");
  if (cepLimpo.length !== 8) {
    mostraErro("CEP", "CEP inválido. Deve ter 8 dígitos");
    return false;
  }
  dados.cepLimpo = cepLimpo;
  return true;
}

function validarEndereco(rua, numero, bairro, cidade, estado, complemento) {
  let valido = true;
  if (rua.length < 3) {
    mostraErro("rua", "A rua deve ter pelo menos 3 caracteres");
    valido = false;
  }
  if (!/^\d+$/.test(numero) || parseInt(numero) <= 0) {
    mostraErro("numero", "O número deve ser um valor positivo");
    valido = false;
  }
  if (bairro.length < 3) {
    mostraErro("bairro", "O bairro deve ter pelo menos 3 caracteres");
    valido = false;
  }
  if (cidade.length < 3) {
    mostraErro("cidade", "A cidade deve ter pelo menos 3 caracteres");
    valido = false;
  }
  if (!/^[A-Z]{2}$/.test(estado.toUpperCase())) {
    mostraErro("estado", "O estado deve conter 2 letras (ex: SP)");
    valido = false;
  }
  if (complemento.length > 0 && complemento.length < 3) {
    mostraErro("complemento", "Complemento deve ter pelo menos 3 caracteres");
    valido = false;
  }
  return valido;
}

function validarDuplicidade(dados) {
  let corretores = JSON.parse(localStorage.getItem("corretores")) || [];
  const emailLower = dados.email.toLowerCase();
  let valido = true;
  if (corretores.some((corretor) => corretor.cpf === dados.cpfLimpo)) {
    mostraErro("cpf", "Este CPF já está cadastrado.");
    valido = false;
  }
  if (corretores.some((corretor) => corretor.email === emailLower)) {
    mostraErro("email", "Este e-mail já está cadastrado.");
    valido = false;
  }
  return valido;
}

function validarDadosCadastro(dados) {
  let eValido = true;
  const {
    nome,
    cpf,
    telefone,
    email,
    senha,
    confirmarSenha,
    cep,
    numero,
    rua,
    bairro,
    cidade,
    estado,
    complemento,
    dataNascimento,
  } = dados;

  eValido = validarNome(nome) && eValido;
  eValido = validarCPF(cpf, dados) && eValido;
  eValido = validarTelefone(telefone, dados) && eValido;
  eValido = validarEmail(email) && eValido;
  eValido = validarDataNascimento(dataNascimento) && eValido;
  eValido = validarSenha(senha, confirmarSenha) && eValido;
  eValido = validarCEP(cep, dados) && eValido;
  eValido =
    validarEndereco(rua, numero, bairro, cidade, estado, complemento) &&
    eValido;

  if (eValido) {
    eValido = validarDuplicidade(dados) && eValido;
  }

  return eValido;
}

function salvarCorretorLocalStorage(dadosValidados) {
  const dadosCorretor = {
    nome: dadosValidados.nome,
    cpf: dadosValidados.cpfLimpo,
    telefone: dadosValidados.phoneLimpo,
    email: dadosValidados.email.toLowerCase(),
    senha: dadosValidados.senha,
    dataNascimento: dadosValidados.dataNascimento,
    endereco: {
      cep: dadosValidados.cepLimpo,
      numero: dadosValidados.numero,
      rua: dadosValidados.rua,
      bairro: dadosValidados.bairro,
      cidade: dadosValidados.cidade,
      estado: dadosValidados.estado.toUpperCase(),
      complemento: dadosValidados.complemento,
    },
  };
  let corretores = JSON.parse(localStorage.getItem("corretores")) || [];
  corretores.push(dadosCorretor);
  localStorage.setItem("corretores", JSON.stringify(corretores));
}

function formatarInputCPF(event) {
  let valor = event.target.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  event.target.value = valor;
}

function formatarInputTelefone(event) {
  let valor = event.target.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  event.target.value = valor;
}

function formatarInputCEP(event) {
  let valor = event.target.value.replace(/\D/g, "");
  if (valor.length > 8) valor = valor.slice(0, 8);
  valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
  event.target.value = valor;
}

function formatarInputDataNascimento(event) {
  let valor = event.target.value.replace(/\D/g, "");
  if (valor.length > 8) valor = valor.slice(0, 8);
  valor = valor.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2");
  event.target.value = valor;
}

function manipularSubmitCadastro(event) {
  event.preventDefault();
  limpaErros();
  const dadosForm = obterDadosCadastroForm();
  const eFormValido = validarDadosCadastro(dadosForm);
  if (eFormValido) {
    salvarCorretorLocalStorage(dadosForm);
    alert("Cadastro realizado com sucesso!");
    const formParaResetar = document.getElementById("formsPreenchimento");
    if (formParaResetar) formParaResetar.reset();
    window.location.href = "/src/pages/corretor.html";
  }
}

function inicializarPagina() {
  const formCadastro = document.getElementById("formsPreenchimento");
  if (formCadastro) {
    formCadastro.addEventListener("submit", manipularSubmitCadastro);
  }

  const campoCpf = document.getElementById("cpf");
  if (campoCpf) campoCpf.addEventListener("input", formatarInputCPF);

  const campoTelefone = document.getElementById("telefone");
  if (campoTelefone)
    campoTelefone.addEventListener("input", formatarInputTelefone);

  const campoCEP = document.getElementById("CEP");
  if (campoCEP) campoCEP.addEventListener("input", formatarInputCEP);

  const campoDataNascimento = document.getElementById("data-nascimento");
  if (campoDataNascimento)
    campoDataNascimento.addEventListener("input", formatarInputDataNascimento);
}
document.addEventListener("DOMContentLoaded", inicializarPagina);
