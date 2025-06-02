function ativarAccordions() {
  const todasAsPerguntas = document.querySelectorAll(".accordionPergunta");

  if (todasAsPerguntas.length === 0) {
    return;
  }

  todasAsPerguntas.forEach((perguntaElemento) => {
    perguntaElemento.addEventListener("click", () => {
      const itemClicado = perguntaElemento.parentElement;
      const estavaAtivoAntesDoClique = itemClicado.classList.contains("active");
      itemClicado.classList.toggle("active");

      const itemEstaAtivoAgora = itemClicado.classList.contains("active");

      if (
        !estavaAtivoAntesDoClique &&
        itemClicado.classList.contains("active")
      ) {
        todasAsPerguntas.forEach((outraPerguntaElemento) => {
          const outroItem = outraPerguntaElemento.parentElement;
          if (
            outroItem !== itemClicado &&
            outroItem.classList.contains("active")
          ) {
            outroItem.classList.remove("active");
          }
        });
      }
      if (itemEstaAtivoAgora) {
        todasAsPerguntas.forEach((outraPerguntaElemento) => {
          const outroItem = outraPerguntaElemento.parentElement;
          if (outroItem !== itemClicado) {
            outroItem.classList.remove("active");
          }
        });
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", ativarAccordions);