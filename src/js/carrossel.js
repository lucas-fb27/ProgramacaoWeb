let carrosselElement;
let itensDoCarrossel;
let btnAnterior;
let btnProximo;
let indiceAtualDoCarrossel = 0;
let intervaloDoCarrossel;

function mostrarItemDoCarrossel(novoIndice) {
  if (!itensDoCarrossel || itensDoCarrossel.length === 0) return;

  itensDoCarrossel[indiceAtualDoCarrossel].classList.remove("active");
  indiceAtualDoCarrossel = novoIndice;

  if (indiceAtualDoCarrossel >= itensDoCarrossel.length) {
    indiceAtualDoCarrossel = 0;
  } else if (indiceAtualDoCarrossel < 0) {
    indiceAtualDoCarrossel = itensDoCarrossel.length - 1;
  }

  itensDoCarrossel[indiceAtualDoCarrossel].classList.add("active");
}

function iniciarIntervaloDoCarrossel() {
  clearInterval(intervaloDoCarrossel);
  intervaloDoCarrossel = setInterval(() => {
    mostrarItemDoCarrossel(indiceAtualDoCarrossel + 1);
  }, 3500);
}

function reiniciarIntervaloDoCarrossel() {
  clearInterval(intervaloDoCarrossel);
  iniciarIntervaloDoCarrossel();
}

function inicializarPagina() {
  carrosselElement = document.querySelector(".carrossel");
  itensDoCarrossel = document.querySelectorAll(".carrosselItem");
  btnAnterior = document.querySelector(".btnPrev");
  btnProximo = document.querySelector(".btnNext");

  if (
    !carrosselElement ||
    itensDoCarrossel.length === 0 ||
    !btnAnterior ||
    !btnProximo
  ) {
    return;
  }

  itensDoCarrossel.forEach((item, index) => {
    if (index === indiceAtualDoCarrossel) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  btnAnterior.addEventListener("click", () => {
    mostrarItemDoCarrossel(indiceAtualDoCarrossel - 1);
    reiniciarIntervaloDoCarrossel();
  });

  btnProximo.addEventListener("click", () => {
    mostrarItemDoCarrossel(indiceAtualDoCarrossel + 1);
    reiniciarIntervaloDoCarrossel();
  });

  iniciarIntervaloDoCarrossel();
}
document.addEventListener("DOMContentLoaded", inicializarPagina);