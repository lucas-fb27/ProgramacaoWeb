let corretorAtual;
let listaDeLeadsContainer;

function getPlanoDescricao(planoKey) {
  switch (planoKey) {
    case "servico1":
      return "Plano de Saúde Individual/Familiar";
    case "servico2":
      return "Plano de Saúde Empresarial (PME)";
    case "servico3":
      return "Plano de Saúde Coletivo por Adesão";
  }
}

function getNomeCorretorReivindicou(lead) {
  if (!lead.claimedBy) return "";
  const corretores = JSON.parse(localStorage.getItem("corretores")) || [];
  const corretorInfo = corretores.find(
    (c) => c.email.toLowerCase() === lead.claimedBy.toLowerCase()
  );
  return corretorInfo ? corretorInfo.nome : lead.claimedBy;
}

function buildCardHTML(
  lead,
  textBlurClass,
  planoDescricao,
  statusDescricao,
  statusClass,
  enderecoCompleto
) {
  return `
    <div class="card-header">
      <h4><span class="${textBlurClass}">${
    lead.nome || "Nome não informado"
  }</span></h4>
    </div>
    <div class="card-body">
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value"><span class="${textBlurClass}">${
    lead.email || "Não informado"
  }</span></span>
      </div>
      <div class="info-row">
        <span class="info-label">Telefone:</span>
        <span class="info-value"><span class="${textBlurClass}">${
    lead.telefone || "Não informado"
  }</span></span>
      </div>
      <div class="info-row">
        <span class="info-label">Endereço:</span>
        <span class="info-value"><span class="${textBlurClass}">${enderecoCompleto}</span></span>
      </div>
      <div class="info-row">
        <span class="info-label">Tipo de Plano:</span>
        <span class="info-value"><span class="${textBlurClass}">${planoDescricao}</span></span>
      </div>
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value ${statusClass}">${statusDescricao}</span>
      </div>
    </div>
  `;
}

function buildCardFooter(lead, isClaimedByCurrentUser, leadCard) {
  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");

  if (!lead.claimedBy) {
    const resgateButton = document.createElement("button");
    resgateButton.textContent = "Resgatar";
    resgateButton.classList.add("resgate-button");
    resgateButton.addEventListener("click", () => {
      if (!corretorAtual) {
        alert(
          "Erro: Corretor atual não identificado. Não é possível resgatar."
        );
        return;
      }
      const leadsFromStorage = JSON.parse(localStorage.getItem("leads")) || [];
      const leadIdentifier = lead.id || lead.email;
      const leadIndexInStorage = leadsFromStorage.findIndex(
        (l) => (l.id || l.email) === leadIdentifier
      );

      if (leadIndexInStorage !== -1) {
        leadsFromStorage[leadIndexInStorage].claimedBy = corretorAtual;
        leadsFromStorage[leadIndexInStorage].claimedAt =
          new Date().toISOString();
        localStorage.setItem("leads", JSON.stringify(leadsFromStorage));
        renderizaLeads();
      } else {
        console.error(
          "Lead não encontrado no localStorage para atualização.",
          lead
        );
        alert("Erro ao tentar resgatar o lead. Tente recarregar a página.");
      }
    });
    cardFooter.appendChild(resgateButton);
  } else if (isClaimedByCurrentUser) {
    const pMensagem = document.createElement("p");
    pMensagem.classList.add("status-reivindicado-pelo-usuario");
    pMensagem.textContent = "Você resgatou este lead.";
    cardFooter.appendChild(pMensagem);
  }

  if (cardFooter.hasChildNodes()) {
    leadCard.appendChild(cardFooter);
  }
}

function createLeadCard(lead) {
  const leadCard = document.createElement("div");
  leadCard.classList.add("lead-card");

  const reivindicadoPorOutroUsuario = lead.claimedBy && lead.claimedBy !== corretorAtual;
  const reivindicadoPeloUsuarioAtual =
    lead.claimedBy && lead.claimedBy === corretorAtual;
  const textBlurClass = reivindicadoPorOutroUsuario ? "blurred-info-text" : "";

  if (reivindicadoPorOutroUsuario) {
    leadCard.classList.add("card-reivindicado-por-outro");
  }

  const nomeCorretorReivindicou = getNomeCorretorReivindicou(lead);

  const planoDescricao = getPlanoDescricao(lead.plano);
  const statusDescricao = lead.claimedBy
    ? `Resgatado por ${nomeCorretorReivindicou}`
    : "Disponível";
  const statusClass = lead.claimedBy ? "status-resgatado" : "status-disponivel";

  const enderecoCompleto =
    `${lead.rua || ""}${lead.numero ? ", " + lead.numero : ""}${
      lead.bairro ? ", " + lead.bairro : ""
    }${lead.cidade ? " - " + lead.cidade : ""}${
      lead.estado ? "/" + lead.estado : ""
    }${lead.cep ? ". CEP: " + lead.cep : ""}`.trim() || "Não informado";

  leadCard.innerHTML = buildCardHTML(
    lead,
    textBlurClass,
    planoDescricao,
    statusDescricao,
    statusClass,
    enderecoCompleto
  );

  buildCardFooter(lead, reivindicadoPeloUsuarioAtual, leadCard);

  return leadCard;
}

function renderizaLeads() {
  if (!listaDeLeadsContainer) {
    console.error(
      "Elemento 'listaDeLeadsContainer' não foi inicializado ou não encontrado."
    );
    return;
  }

  listaDeLeadsContainer.innerHTML = "";
  const leads = JSON.parse(localStorage.getItem("leads")) || [];

  if (leads.length === 0) {
    listaDeLeadsContainer.innerHTML =
      "<p class='no-leads-message'>Nenhum lead disponível no momento.</p>";
    return;
  }

  leads.forEach((lead) => {
    const leadCard = createLeadCard(lead);
    listaDeLeadsContainer.appendChild(leadCard);
  });
}

function inicializarPagina() {
  corretorAtual = localStorage.getItem("loggedInEmail");
  listaDeLeadsContainer = document.getElementById("listaDeLeadsContainer");

  if (!listaDeLeadsContainer) {
    console.error(
      "Elemento 'listaDeLeadsContainer' não encontrado durante a inicialização."
    );
    return;
  }

  renderizaLeads();
}
document.addEventListener("DOMContentLoaded", inicializarPagina);