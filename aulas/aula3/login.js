function validarLogin() {
  let email = document.getElementById("txtEmail").value;
  let cpf = document.getElementById("txtCpf").value;
  let senha = document.getElementById("txtSenha").value;

  if (email === "") {
    alert("Usuário precisa ser preenchido!");
    return;
  }

  if (cpf === "") {
    alert("CPF precisa ser preenchido!");
    return;
  }

  if (senha === "") {
    alert("Senha precisa ser preenchida!");
    return;
  }

  const adminUsuario = "admin";
  const adminCpf = "000.000.000-00";
  const adminSenha = "admin123";

  if (usuario === adminUsuario && cpf === adminCpf && senha === adminSenha) {
    alert("Login de administrador bem-sucedido!");
  } else {
    alert("Login realizado com sucesso!");
  }
}
