function initMap() {
  const empresaLocalizacao = [-23.669369, -46.700551];

  const map = L.map("map").setView(empresaLocalizacao, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(empresaLocalizacao)
    .addTo(map)
    .bindPopup(
      "VitaSeg - Corretora <br> Av. Eng. Eusébio Stevaux, 823 <br> 04696-000"
    )
    .openPopup();
}
window.onload = initMap;