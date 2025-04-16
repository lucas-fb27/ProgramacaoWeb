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

function initMap() {
  const empresaLocalizacao = [-23.55052, -46.633308]; 

  const map = L.map("map").setView(empresaLocalizacao, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(empresaLocalizacao)
    .addTo(map)
    .bindPopup("VitaSeg - Corretora de Seguros")
    .openPopup();
}

window.onload = initMap;