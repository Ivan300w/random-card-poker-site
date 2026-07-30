const requestForm = document.querySelector("#request-form");
const formStatus = document.querySelector("#form-status");
const menuToggle = document.querySelector(".menu-toggle");
const primaryMenu = document.querySelector("#primary-menu");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeMenu = () => {
  if (!menuToggle || !primaryMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  primaryMenu.classList.remove("is-open");
};

if (menuToggle && primaryMenu) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Close navigation menu" : "Open navigation menu");
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
    ".section-heading, .operator-layout, .spec-grid, .illustrative-hand, .boton-demo, .solution-grid article, .operator-fit article, .flow-grid article, .value-grid article, .metric-panel div, .format-cards article, .path-steps article, .package-list article, .faq-grid article, .contact-layout, .legal-section, .legal-card"
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
        formStatus.textContent = "Please complete the required fields and confirm this is a qualified commercial inquiry.";
      }
      return;
    }

    const subject = encodeURIComponent(`Private operator review request - Random Card Poker - ${company}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Company: ${company}`,
        `Company website: ${website || "Not specified"}`,
        `Role: ${role || "Not specified"}`,
        `Business email: ${email}`,
        `Jurisdiction / target market: ${jurisdiction}`,
        `Interest type: ${interest}`,
        `Estimated timeline: ${timeline || "Not specified"}`,
        `Qualified commercial inquiry confirmed: ${qualified ? "Yes" : "No"}`,
        "",
        "Message:",
        message || "I would like to request private operator review for Random Card Poker."
      ].join("\n")
    );

    if (formStatus) {
      formStatus.textContent = "Opening your email client with the private operator review request prepared.";
    }

    window.location.href = `mailto:gm@randomcardpoker.com?subject=${subject}&body=${body}`;
  });
}
