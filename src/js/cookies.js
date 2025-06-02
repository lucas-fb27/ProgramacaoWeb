function gerenciarVisibilidadeInicialBanner(bannerElement) {
  if (localStorage.getItem("cookieAceito") === "true") {
    bannerElement.classList.add("hidden");
  } else {
    bannerElement.classList.remove("hidden");
  }
}

function manipularAceiteCookies(bannerElement) {
  try {
    localStorage.setItem("cookieAceito", "true");
    bannerElement.classList.add("hidden");
  } catch (error) {
    console.error("Erro ao salvar 'cookieAceito' no localStorage:", error);
  }
}

function inicializarPagina() {
  const cookieBanner = document.getElementById("cookieConsentimento");
  const aceiteBtn = document.getElementById("aceitaCookies");

  if (!cookieBanner || !aceiteBtn) {
    console.warn(
      "Elementos do banner de cookies não encontrados. Funcionalidade não será ativada."
    );
    return;
  }

  gerenciarVisibilidadeInicialBanner(cookieBanner);

  aceiteBtn.addEventListener("click", function () {
    manipularAceiteCookies(cookieBanner);
  });
}
document.addEventListener("DOMContentLoaded", inicializarPagina);