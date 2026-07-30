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
  const submitButton = requestForm.querySelector('button[type="submit"]');
  const defaultButtonText = submitButton?.textContent || "Enviar solicitud comercial";
  const fallbackEmail = "gm@randomcardpoker.com";

  const setFormStatus = (message, state = "") => {
    if (!formStatus) return;
    formStatus.classList.remove("is-success", "is-error");
    if (state) formStatus.classList.add(`is-${state}`);
    formStatus.textContent = message;
  };

  const setSubmitting = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "Enviando solicitud..." : defaultButtonText;
  };

  const pageParams = new URLSearchParams(window.location.search);
  if (pageParams.get("enviado") === "1") {
    setFormStatus("Solicitud enviada correctamente. Gracias; revisaremos la información y responderemos al correo indicado.", "success");
  }

  requestForm.addEventListener("submit", async (event) => {
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
    const honeypot = String(data.get("_honey") || "").trim();

    if (honeypot) {
      requestForm.reset();
      setFormStatus("Solicitud recibida.", "success");
      return;
    }

    if (!name || !company || !email || !jurisdiction || !interest || !qualified) {
      setFormStatus("Complete los campos obligatorios y confirme que se trata de una consulta comercial calificada.", "error");
      requestForm.reportValidity();
      return;
    }

    const payload = {
      nombre: name,
      empresa: company,
      sitio_web: website || "No especificado",
      cargo: role || "No especificado",
      email,
      jurisdiccion_mercado: jurisdiction,
      tipo_de_interes: interest,
      calendario_estimado: timeline || "No especificado",
      consulta_comercial_calificada: "Sí",
      mensaje: message || "Deseo solicitar una revisión privada de Random Card Poker.",
      _replyto: email,
      _subject: `Solicitud comercial - Random Card Poker - ${company}`,
      _template: "table"
    };

    setSubmitting(true);
    setFormStatus("Enviando su solicitud comercial...");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${fallbackEmail}`, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: new URLSearchParams(payload)
      });

      if (!response.ok) {
        throw new Error(`FormSubmit respondió con estado ${response.status}`);
      }

      const result = await response.json();
      const submissionSucceeded = result.success === true || result.success === "true";
      if (!submissionSucceeded) {
        throw new Error("FormSubmit no confirmó el envío");
      }

      requestForm.reset();
      setFormStatus("Solicitud enviada correctamente. Gracias; revisaremos la información y responderemos al correo indicado.", "success");
    } catch (error) {
      console.error("No fue posible enviar la solicitud comercial.", error);
      setFormStatus(`No fue posible completar el envío. Escriba directamente a ${fallbackEmail}.`, "error");
    } finally {
      setSubmitting(false);
    }
  });
}
