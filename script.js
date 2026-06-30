const formatTabs = Array.from(document.querySelectorAll(".format-tab"));
const formatLabel = document.querySelector("#format-label");
const formatTitle = document.querySelector("#format-title");
const formatCopy = document.querySelector("#format-copy");
const formatList = document.querySelector("#format-list");
const licenseForm = document.querySelector("#license-form");
const formStatus = document.querySelector("#form-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatContent = {
  live: {
    label: "Formato recomendado",
    title: "Live dealer / casino online en vivo",
    copy: "Dealer real, cámara, interfaz digital y reportes de operación para evaluar la experiencia con público remoto.",
    bullets: [
      "Demo guiada con flujo de dealer y selección del Botón D.",
      "Material para revisar cámara, UI, ritmo y reportes.",
      "Alcance técnico definido bajo NDA o LOI."
    ]
  },
  floor: {
    label: "Sala presencial",
    title: "Mesa física de casino",
    copy: "Layout de paño, Botón D rotativo, procedimientos de dealer y límites configurables para operación en piso.",
    bullets: [
      "Paño, posiciones, zonas de apuesta y procedimiento de pago.",
      "Entrenamiento de dealer apoyado en manual oficial.",
      "Piloto sujeto a regulador, laboratorio y condiciones comerciales."
    ]
  },
  digital: {
    label: "Integración sujeta a alcance",
    title: "Casino online / RNG",
    copy: "Versión automática evaluable con lógica de pagos, demo de escritorio y documentación técnica para revisión.",
    bullets: [
      "Lógica de pagos implementada para revisión técnica.",
      "RNG, UI, wallet y reporting se definen por integración.",
      "Certificación final depende de plataforma y jurisdicción."
    ]
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
    formatList.innerHTML = content.bullets.map((item) => `<li>${item}</li>`).join("");
  });
});

const revealTargets = Array.from(
  document.querySelectorAll(
    ".section-heading, .operator-layout, .spec-grid, .solution-grid article, .operator-fit article, .flow-grid article, .value-grid article, .metric-panel div, .pay-layout, .format-switcher, .path-steps article, .package-list article, .approval-block, .contact-layout"
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

const metricValues = Array.from(document.querySelectorAll(".metric-panel strong"));

const animateMetric = (element) => {
  const raw = element.textContent.trim();
  const value = Number.parseFloat(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(value)) return;

  const suffix = raw.replace(/[\d.]/g, "");
  const start = performance.now();
  const duration = 900;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${(value * eased).toFixed(2)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateMetric(entry.target);
        metricObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.55 }
  );

  metricValues.forEach((metric) => metricObserver.observe(metric));
}

if (licenseForm) {
  licenseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(licenseForm);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const operation = String(data.get("operation") || "").trim();
    const market = String(data.get("market") || "").trim();
    const profile = String(data.get("profile") || "").trim();
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
        `Mercado o jurisdicción: ${market || "No especificado"}`,
        `Perfil de empresa: ${profile || "No especificado"}`,
        "",
        "Mensaje:",
        message || "Solicito información para evaluación comercial y demo privada."
      ].join("\n")
    );

    formStatus.textContent = "Abriendo tu correo con la solicitud preparada.";
    window.location.href = `mailto:gm@randomcardpoker.com?subject=${subject}&body=${body}`;
  });
}
