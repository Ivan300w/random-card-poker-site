const requestForm = document.querySelector("#request-form");
const formStatus = document.querySelector("#form-status");
const menuToggle = document.querySelector(".menu-toggle");
const primaryMenu = document.querySelector("#primary-menu");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeMenu = () => {
  if (!menuToggle || !primaryMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir men\u00fa de navegaci\u00f3n");
  primaryMenu.classList.remove("is-open");
};

if (menuToggle && primaryMenu) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Cerrar men\u00fa de navegaci\u00f3n" : "Abrir men\u00fa de navegaci\u00f3n");
    primaryMenu.classList.toggle("is-open", willOpen);
  });

  primaryMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) closeMenu();
  });
}

const revealTargets = Array.from(
  document.querySelectorAll(
    ".section-heading, .operator-layout, .spec-grid, .illustrative-hand, .boton-demo, .solution-grid article, .operator-fit article, .flow-grid article, .value-grid article, .metric-panel div, .format-cards article, .path-steps article, .package-list article, .faq-grid details, .contact-layout, .legal-section, .legal-card"
  )
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(requestForm);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const website = String(data.get("website") || "").trim();
    const role = String(data.get("role") || "").trim();
    const email = String(data.get("email") || "").trim();
    const jurisdiction = String(data.get("jurisdiction") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const timeline = String(data.get("timeline") || "").trim();
    const message = String(data.get("message") || "").trim();
    const qualified = data.get("qualified") === "on";

    if (!name || !company || !email || !jurisdiction || !interest || !qualified) {
      if (formStatus) {
        formStatus.textContent = "Complete los campos obligatorios y confirme que se trata de una consulta comercial calificada.";
      }
      return;
    }

    const subject = encodeURIComponent(`Solicitud de revisi\u00f3n privada - Random Card Poker - ${company}`);
    const body = encodeURIComponent(
      [
        `Nombre: ${name}`,
        `Empresa: ${company}`,
        `Sitio web de la empresa: ${website || "No especificado"}`,
        `Cargo: ${role || "No especificado"}`,
        `Correo corporativo: ${email}`,
        `Jurisdicci\u00f3n / mercado objetivo: ${jurisdiction}`,
        `Tipo de inter\u00e9s: ${interest}`,
        `Calendario estimado: ${timeline || "No especificado"}`,
        `Consulta comercial calificada confirmada: ${qualified ? "S\u00ed" : "No"}`,
        "",
        "Mensaje:",
        message || "Deseo solicitar una revisi\u00f3n privada de Random Card Poker."
      ].join("\n")
    );

    if (formStatus) {
      formStatus.textContent = "Abriendo su aplicaci\u00f3n de correo con la solicitud de revisi\u00f3n privada preparada.";
    }

    window.location.href = `mailto:gm@randomcardpoker.com?subject=${subject}&body=${body}`;
  });
}
