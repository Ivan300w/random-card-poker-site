const segments = Array.from(document.querySelectorAll(".segment"));
const volumeInput = document.querySelector("#monthly-volume");
const volumeOutput = document.querySelector("#volume-output");
const brandToggle = document.querySelector("#brand-toggle");
const apiToggle = document.querySelector("#api-toggle");
const recommendationTitle = document.querySelector("#recommendation-title");
const recommendationCopy = document.querySelector("#recommendation-copy");
const licenseForm = document.querySelector("#license-form");
const formStatus = document.querySelector("#form-status");

const recommendations = {
  revenue: {
    title: "Revenue Share Launch",
    copy: "Una entrada ligera para validar mercado, medir conversión y crecer con participación sobre resultados."
  },
  whiteLabel: {
    title: "White Label Pro",
    copy: "Buen equilibrio para operadores digitales con marca propia y volumen medio."
  },
  live: {
    title: "Licencia Live Venue",
    copy: "Pensada para salas físicas o activaciones presenciales con operación controlada y soporte de lanzamiento."
  },
  enterprise: {
    title: "Enterprise API",
    copy: "La mejor opción para plataformas con wallet, lobby, CRM o infraestructura técnica propia."
  }
};

let selectedChannel = "digital";

function getRecommendation() {
  const volume = Number(volumeInput.value);
  const wantsBrand = brandToggle.checked;
  const wantsApi = apiToggle.checked;

  if (wantsApi || volume >= 48) {
    return recommendations.enterprise;
  }

  if (selectedChannel === "live") {
    return recommendations.live;
  }

  if (wantsBrand || selectedChannel === "hybrid" || volume >= 16) {
    return recommendations.whiteLabel;
  }

  return recommendations.revenue;
}

function updateEstimator() {
  const recommendation = getRecommendation();
  volumeOutput.value = volumeInput.value;
  volumeOutput.textContent = volumeInput.value;
  recommendationTitle.textContent = recommendation.title;
  recommendationCopy.textContent = recommendation.copy;
}

segments.forEach((segment) => {
  segment.addEventListener("click", () => {
    selectedChannel = segment.dataset.channel;
    segments.forEach((button) => button.classList.toggle("is-active", button === segment));
    updateEstimator();
  });
});

[volumeInput, brandToggle, apiToggle].forEach((control) => {
  control.addEventListener("input", updateEstimator);
  control.addEventListener("change", updateEstimator);
});

licenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(licenseForm);
  const name = String(data.get("name") || "").trim();
  const company = String(data.get("company") || "").trim();
  const email = String(data.get("email") || "").trim();
  const operation = String(data.get("operation") || "").trim();
  const message = String(data.get("message") || "").trim();
  const recommendation = recommendationTitle.textContent.trim();

  if (!name || !company || !email || !operation) {
    formStatus.textContent = "Completa los campos requeridos para preparar la solicitud.";
    return;
  }

  const subject = encodeURIComponent(`Solicitud de licencia - ${company}`);
  const body = encodeURIComponent(
    [
      `Nombre: ${name}`,
      `Empresa: ${company}`,
      `Correo: ${email}`,
      `Tipo de operación: ${operation}`,
      `Recomendación estimada: ${recommendation}`,
      "",
      "Mensaje:",
      message || "Sin mensaje adicional."
    ].join("\n")
  );

  formStatus.textContent = "Abriendo tu correo con la solicitud preparada.";
  window.location.href = `mailto:gm@randomcardpoker.com?subject=${subject}&body=${body}`;
});

updateEstimator();
