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

function mostraError(campoId, message) {
  const campo = document.getElementById(campoId);
  const parentNode = campoId === "loginForm" ? campo : campo.parentNode;
  if (!parentNode) return;
  const existeErro = parentNode.querySelector(
    `.error-message[data-field="${campoId}"]`
  );
  if (existeErro) {
    existeErro.remove();
  }
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.setAttribute("data-field", campoId);
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";
  errorDiv.textContent = message;
  errorDiv.style.textAlign = campoId === "loginForm" ? "center" : "left";
  if (campoId === "loginForm" && campo.firstChild) {
    campo.insertBefore(errorDiv, campo.firstChild);
  } else {
    parentNode.insertBefore(errorDiv, campo.nextSibling);
  }
}

function limpaErros() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => error.remove());
}

function mostrarModal() {
  const modalEsqueceuSenha = document.getElementById("modalEsqueceuSenha");
  const estadoEmail = document.getElementById("estadoEmailRedefinicao");
  const estadoConfirmacao = document.getElementById("estadoConfirmacaoEnvio");
  const inputEmailRedefinicao = document.getElementById("emailRedefinicao");
  const divErroEmailRedefinicao = document.getElementById(
    "erroEmailRedefinicao"
  );
  if (modalEsqueceuSenha) modalEsqueceuSenha.classList.add("visivel");
  if (estadoEmail) estadoEmail.style.display = "block";
  if (estadoConfirmacao) estadoConfirmacao.style.display = "none";
  if (inputEmailRedefinicao) inputEmailRedefinicao.value = "";
  if (divErroEmailRedefinicao) {
    divErroEmailRedefinicao.style.display = "none";
    divErroEmailRedefinicao.textContent = "";
  }
}

function esconderModal() {
  const modalEsqueceuSenha = document.getElementById("modalEsqueceuSenha");
  if (modalEsqueceuSenha) modalEsqueceuSenha.classList.remove("visivel");
}

function manipularSubmitLogin(event) {
  event.preventDefault();
  const cpf = document.getElementById("cpf").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  limpaErros();
  let eValido = true;
  const cpfLimpo = cpf.replace(/[^\d]/g, "");
  if (cpfLimpo.length !== 11 || !eValidoCPF(cpfLimpo)) {
    mostraError("cpf", "CPF inválido. Deve conter exatamente 11 dígitos");
    eValido = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostraError("email", "Email inválido");
    eValido = false;
  }
  if (senha.length < 8) {
    mostraError("senha", "A senha deve ter pelo menos 8 caracteres");
    eValido = false;
  }
  if (eValido) {
    const corretores = JSON.parse(localStorage.getItem("corretores")) || [];
    const corretor = corretores.find(
      (c) =>
        c.cpf === cpfLimpo &&
        c.email.toLowerCase() === email.toLowerCase() &&
        c.senha === senha
    );
    if (corretor) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInEmail", email.toLowerCase());
      setTimeout(() => {
        window.location.href = "src/pages/dashboard.html";
      }, 600);
    } else {
      mostraError("loginForm", "CPF, email ou senha incorretos");
    }
  }
}

function formatarInputCPFLogin(event) {
  let valor = event.target.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  event.target.value = valor;
}

function manipularCliqueEsqueceuSenha(event) {
  event.preventDefault();
  mostrarModal();
}

function manipularCliqueForaModal(event) {
  if (event.target === document.getElementById("modalEsqueceuSenha")) {
    esconderModal();
  }
}

function manipularEnvioLinkRedefinicao() {
  const inputEmailRedefinicao = document.getElementById("emailRedefinicao");
  const divErroEmailRedefinicao = document.getElementById(
    "erroEmailRedefinicao"
  );
  const estadoEmail = document.getElementById("estadoEmailRedefinicao");
  const estadoConfirmacao = document.getElementById("estadoConfirmacaoEnvio");
  const emailParaRedefinir = inputEmailRedefinicao.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailParaRedefinir)) {
    divErroEmailRedefinicao.textContent = "Por favor, insira um e-mail válido.";
    divErroEmailRedefinicao.style.display = "block";
    inputEmailRedefinicao.focus();
    return;
  }
  divErroEmailRedefinicao.style.display = "none";
  if (estadoEmail) estadoEmail.style.display = "none";
  if (estadoConfirmacao) estadoConfirmacao.style.display = "block";
}

function manipularCliqueCorrigirEmail(event) {
  event.preventDefault();
  const estadoEmail = document.getElementById("estadoEmailRedefinicao");
  const estadoConfirmacao = document.getElementById("estadoConfirmacaoEnvio");
  const inputEmailRedefinicao = document.getElementById("emailRedefinicao");
  if (estadoConfirmacao) estadoConfirmacao.style.display = "none";
  if (estadoEmail) estadoEmail.style.display = "block";
  if (inputEmailRedefinicao) inputEmailRedefinicao.focus();
}

function inicializarPagina() {
  const loginForm = document.querySelector(".loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", manipularSubmitLogin);
  }
  const campoCPF = document.getElementById("cpf");
  if (campoCPF) {
    campoCPF.addEventListener("input", formatarInputCPFLogin);
  }
  const linkEsqueceuSenhaOriginal = document.querySelector(".formLinkEsqueceu");
  if (linkEsqueceuSenhaOriginal) {
    linkEsqueceuSenhaOriginal.addEventListener(
      "click",
      manipularCliqueEsqueceuSenha
    );
  }
  const modalEsqueceuSenha = document.getElementById("modalEsqueceuSenha");
  if (modalEsqueceuSenha) {
    const btnFecharModal =
      modalEsqueceuSenha.querySelector(".modal-fechar-btn");
    if (btnFecharModal) {
      btnFecharModal.addEventListener("click", esconderModal);
    }
    modalEsqueceuSenha.addEventListener("click", manipularCliqueForaModal);
  }
  const btnEnviarLink = document.getElementById("btnEnviarLink");
  if (btnEnviarLink) {
    btnEnviarLink.addEventListener("click", manipularEnvioLinkRedefinicao);
  }
  const linkCorrigirEmail = document.getElementById("linkCorrigirEmail");
  if (linkCorrigirEmail) {
    linkCorrigirEmail.addEventListener("click", manipularCliqueCorrigirEmail);
  }
}
document.addEventListener("DOMContentLoaded", inicializarPagina);