const formatTabs = Array.from(document.querySelectorAll(".format-tab"));
const formatLabel = document.querySelector("#format-label");
const formatTitle = document.querySelector("#format-title");
const formatCopy = document.querySelector("#format-copy");
const licenseForm = document.querySelector("#license-form");
const formStatus = document.querySelector("#form-status");

const formatContent = {
  live: {
    label: "Formato recomendado",
    title: "Live dealer / casino online en vivo",
    copy: "Dealer real, cámara, interfaz digital y reportes de operación para evaluar la experiencia con público remoto."
  },
  floor: {
    label: "Sala presencial",
    title: "Mesa física de casino",
    copy: "Layout de paño, Botón D rotativo, procedimientos de dealer y límites configurables para operación en piso."
  },
  digital: {
    label: "Integración sujeta a alcance",
    title: "Casino online / RNG",
    copy: "Versión automática evaluable con lógica de pagos, demo de escritorio y documentación técnica para revisión."
  }
};

formatTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const content = formatContent[tab.dataset.format];
    if (!content) return;

    formatTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    formatLabel.textContent = content.label;
    formatTitle.textContent = content.title;
    formatCopy.textContent = content.copy;
  });
});

licenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(licenseForm);
  const name = String(data.get("name") || "").trim();
  const company = String(data.get("company") || "").trim();
  const email = String(data.get("email") || "").trim();
  const operation = String(data.get("operation") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !company || !email || !operation) {
    formStatus.textContent = "Completa los campos requeridos para preparar la solicitud.";
    return;
  }

  const subject = encodeURIComponent(`Evaluación Random Card Poker - ${company}`);
  const body = encodeURIComponent(
    [
      `Nombre: ${name}`,
      `Empresa: ${company}`,
      `Correo: ${email}`,
      `Formato de interés: ${operation}`,
      "",
      "Mensaje:",
      message || "Solicito información para evaluación comercial y demo privada."
    ].join("\n")
  );

  formStatus.textContent = "Abriendo tu correo con la solicitud preparada.";
  window.location.href = `mailto:gm@randomcardpoker.com?subject=${subject}&body=${body}`;
});
