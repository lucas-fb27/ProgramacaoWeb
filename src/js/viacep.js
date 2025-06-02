function buscarEndereco() {
  const cep = document.getElementById("CEP").value.replace(/\D/g, "");

  if (cep.length !== 8) {
    alert("CEP inválido");
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((res) => res.json())
    .then((data) => {
      if (data.erro) {
        alert("CEP não encontrado");
      } else {
        document.getElementById("rua").value = data.logradouro;
        document.getElementById("bairro").value = data.bairro;
        document.getElementById("cidade").value = data.localidade;
        document.getElementById("estado").value = data.uf;
      }
    })
    .catch(() => alert("Erro ao buscar o CEP"));
}