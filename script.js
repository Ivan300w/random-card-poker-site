const requestForm = document.querySelector("#request-form");
const formStatus = document.querySelector("#form-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    if (!name || !company || !website || !email || !jurisdiction || !interest || !timeline || !qualified) {
      if (formStatus) {
        formStatus.textContent = "Please complete the required fields and confirm this is a qualified commercial inquiry.";
      }
      return;
    }

    const subject = encodeURIComponent(`Commercial introduction request - Random Card Poker - ${company}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Company: ${company}`,
        `Company website: ${website}`,
        `Role: ${role || "Not specified"}`,
        `Business email: ${email}`,
        `Jurisdiction / target market: ${jurisdiction}`,
        `Interest type: ${interest}`,
        `Estimated timeline: ${timeline}`,
        `Qualified commercial inquiry confirmed: ${qualified ? "Yes" : "No"}`,
        "",
        "Message:",
        message || "I would like to request a 20-minute commercial introduction for Random Card Poker."
      ].join("\n")
    );

    if (formStatus) {
      formStatus.textContent = "Opening your email client with the commercial introduction request prepared.";
    }

    window.location.href = `mailto:gm@randomcardpoker.com?subject=${subject}&body=${body}`;
  });
}
