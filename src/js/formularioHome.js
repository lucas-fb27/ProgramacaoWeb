function limparErros() {
  const mensagensDeErro = document.querySelectorAll(".error-message");
  mensagensDeErro.forEach((error) => error.remove());
}

function mostrarErro(campoId, message) {
  const campoElemento =
    campoId === "select"
      ? document.querySelector("select[name='plano']")
      : document.getElementById(campoId);

  if (campoElemento) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "12px";
    errorDiv.style.marginTop = "5px";
    errorDiv.textContent = message;
    campoElemento.parentNode.insertBefore(errorDiv, campoElemento.nextSibling);
  } else {
    console.warn(`Elemento para mostrar erro não encontrado: ${campoId}`);
  }
}

function obterDadosDoFormulario() {
  const dados = {};
  dados.nome = document.getElementById("nome").value.trim();
  dados.email = document.getElementById("email").value.trim();
  dados.telefone = document.getElementById("telefone").value.trim();
  dados.cep = document.getElementById("CEP").value.trim();
  dados.numero = document.getElementById("numero").value.trim();
  dados.rua = document.getElementById("rua").value.trim();
  dados.bairro = document.getElementById("bairro").value.trim();
  dados.cidade = document.getElementById("cidade").value.trim();
  dados.estado = document.getElementById("estado").value.trim();
  dados.plano = document.querySelector("select[name='plano']").value;
  return dados;
}

function validarDados(dados) {
  let eValido = true;

  if (!/^[A-Za-z\s]{4,}$/.test(dados.nome)) {
    mostrarErro(
      "nome",
      "O nome deve ter mais de 3 letras e conter apenas letras e espaços"
    );
    eValido = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    mostrarErro("email", "Email inválido");
    eValido = false;
  }

  const phoneLimpo = dados.telefone.replace(/[^\d]/g, "");
  if (!/^(\d{2}9?\d{8})$/.test(phoneLimpo)) {
    mostrarErro(
      "telefone",
      "Telefone inválido. Use o formato (XX) XXXX-XXXX ou (XX) 9XXXX-XXXX"
    );
    eValido = false;
  }
  dados.telefoneLimpo = phoneLimpo;

  const cepLimpo = dados.cep.replace(/[^\d]/g, "");
  if (cepLimpo.length !== 8) {
    mostrarErro("CEP", "CEP inválido. Deve conter exatamente 8 dígitos");
    eValido = false;
  }
  dados.cepLimpo = cepLimpo;

  if (!/^\d+$/.test(dados.numero) || parseInt(dados.numero) <= 0) {
    mostrarErro("numero", "O número deve ser um valor positivo");
    eValido = false;
  }

  if (dados.rua.length < 3) {
    mostrarErro("rua", "A rua deve ter pelo menos 3 caracteres");
    eValido = false;
  }

  if (dados.bairro.length < 3) {
    mostrarErro("bairro", "O bairro deve ter pelo menos 3 caracteres");
    eValido = false;
  }

  if (dados.cidade.length < 3) {
    mostrarErro("cidade", "A cidade deve ter pelo menos 3 caracteres");
    eValido = false;
  }

  if (!/^[A-Z]{2}$/.test(dados.estado.toUpperCase())) {
    mostrarErro("estado", "O estado deve conter exatamente 2 letras (ex: SP)");
    eValido = false;
  }

  if (!dados.plano) {
    mostrarErro("select", "Selecione um tipo de plano");
    eValido = false;
  }

  return eValido;
}

function salvarLead(dadosFormulario) {
  const lead = {
    id: Date.now(),
    nome: dadosFormulario.nome,
    email: dadosFormulario.email,
    telefone: dadosFormulario.telefoneLimpo,
    cep: dadosFormulario.cepLimpo,
    numero: dadosFormulario.numero,
    rua: dadosFormulario.rua,
    bairro: dadosFormulario.bairro,
    cidade: dadosFormulario.cidade,
    estado: dadosFormulario.estado.toUpperCase(),
    plano: dadosFormulario.plano,
    claimedBy: null,
    claimedAt: null,
  };

  let leads = JSON.parse(localStorage.getItem("leads")) || [];
  leads.push(lead);
  localStorage.setItem("leads", JSON.stringify(leads));
}

function manipuladorSubmitFormulario(event) {
  event.preventDefault();

  limparErros();
  const dadosFormulario = obterDadosDoFormulario();
  const eValido = validarDados(dadosFormulario);

  if (eValido) {
    salvarLead(dadosFormulario);
    alert("Formulário enviado com sucesso!");
    document.getElementById("formsPreenchimento").reset();
  }
}

function formatarCEP(event) {
  let valor = event.target.value.replace(/\D/g, "");
  if (valor.length > 8) valor = valor.slice(0, 8);
  valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
  event.target.value = valor;
}

function formatarTelefone(event) {
  let valor = event.target.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);

  if (valor.length <= 2) {
    event.target.value = valor;
  } else if (valor.length <= 6) {
    event.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else if (valor.length <= 10) {
    event.target.value = `(${valor.slice(0, 2)}) ${valor.slice(
      2,
      6
    )}-${valor.slice(6)}`;
  } else {
    event.target.value = `(${valor.slice(0, 2)}) ${valor.slice(
      2,
      7
    )}-${valor.slice(7)}`;
  }
}

function inicializarPagina() {
  const form = document.getElementById("formsPreenchimento");
  if (form) {
    form.addEventListener("submit", manipuladorSubmitFormulario);
  } else {
    console.warn("Formulário com ID 'formsPreenchimento' não encontrado.");
  }

  const campoCEP = document.getElementById("CEP");
  if (campoCEP) {
    campoCEP.addEventListener("input", formatarCEP);
  } else {
    console.warn("Campo com ID 'CEP' não encontrado.");
  }

  const campoTelefone = document.getElementById("telefone");
  if (campoTelefone) {
    campoTelefone.addEventListener("input", formatarTelefone);
  } else {
    console.warn("Campo com ID 'telefone' não encontrado.");
  }
}
document.addEventListener("DOMContentLoaded", inicializarPagina);