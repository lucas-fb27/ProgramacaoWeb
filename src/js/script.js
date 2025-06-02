function inicializarPagina() {
  inicializarFadeIn();
  atualizaNavbar();
  const logoutBtn = document.querySelector("a.logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", identificadorLogout);
  }
}

function inicializarFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".fade-in").forEach((element) => {
    observer.observe(element);
  });
}
function atualizaNavbar() {
  const estaLogado = localStorage.getItem("isLoggedIn") === "true";
  const navLinks = document.querySelector(".navlinks");

  if (!navLinks) {
    console.error("Elemento .navlinks não encontrado no DOM.");
    return;
  }

  const cadastroLinkQuery = 'a[href="/src/pages/cadastro.html"]';
  const corretorLinkQuery =
    'a.loginBtn[href="/src/pages/corretor.html"]';
  const dashboardLinkQuery =
    'a.dashboardBtn[href="/src/pages/dashboard.html"]';
  const logoutLinkQuery = "a.logoutBtn";

  const cadastroLi = navLinks.querySelector(cadastroLinkQuery)?.closest("li");
  const corretorLi = navLinks.querySelector(corretorLinkQuery)?.closest("li");
  const dashboardLi = navLinks.querySelector(dashboardLinkQuery)?.closest("li");
  const logoutLi = navLinks.querySelector(logoutLinkQuery)?.closest("li");

  if (estaLogado) {
    atualizaNavbarLogado(
      navLinks,
      cadastroLi,
      corretorLi,
      dashboardLi,
      logoutLi
    );
  } else {
    atualizaNavbarDeslogado(
      navLinks,
      cadastroLi,
      corretorLi,
      dashboardLi,
      logoutLi
    );
  }
}

function atualizaNavbarLogado(
  navLinks,
  cadastroLi,
  corretorLi,
  dashboardLi,
  logoutLi
) {
  if (cadastroLi) cadastroLi.remove();
  if (corretorLi) corretorLi.remove();

  if (!dashboardLi) {
    const newDashboardLi = document.createElement("li");
    const newDashboardLink = document.createElement("a");
    newDashboardLink.href = "/src/pages/dashboard.html";
    newDashboardLink.textContent = "Dashboard";
    newDashboardLink.className = "dashboardBtn";
    newDashboardLi.appendChild(newDashboardLink);
    navLinks.appendChild(newDashboardLi);
  }

  if (!logoutLi) {
    const newLogoutLi = document.createElement("li");
    const newLogoutLink = document.createElement("a");
    newLogoutLink.href = "#";
    newLogoutLink.textContent = "Sair";
    newLogoutLink.className = "logoutBtn";
    newLogoutLink.addEventListener("click", identificadorLogout);
    newLogoutLi.appendChild(newLogoutLink);
    navLinks.appendChild(newLogoutLi);
  }
}

function atualizaNavbarDeslogado(
  navLinks,
  cadastroLi,
  corretorLi,
  dashboardLi,
  logoutLi
) {
  if (dashboardLi) dashboardLi.remove();
  if (logoutLi) logoutLi.remove();

  if (!cadastroLi) {
    const newCadastroLi = document.createElement("li");
    const newCadastroLink = document.createElement("a");
    newCadastroLink.href = "/src/pages/cadastro.html";
    newCadastroLink.textContent = "Cadastre-se";
    newCadastroLi.appendChild(newCadastroLink);
    navLinks.appendChild(newCadastroLi);
  }
  if (!corretorLi) {
    const newCorretorLi = document.createElement("li");
    const newCorretorLink = document.createElement("a");
    newCorretorLink.href = "/src/pages/corretor.html";
    newCorretorLink.textContent = "Área do Corretor";
    newCorretorLink.className = "loginBtn";
    newCorretorLi.appendChild(newCorretorLink);
    navLinks.appendChild(newCorretorLi);
  }
}

function identificadorLogout(event) {
  event.preventDefault();
  console.log("identificadorLogout chamado");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInEmail");

  window.location.href = "/src/index.html";
}
document.addEventListener("DOMContentLoaded", inicializarPagina);