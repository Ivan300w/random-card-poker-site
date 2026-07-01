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
    const role = String(data.get("role") || "").trim();
    const email = String(data.get("email") || "").trim();
    const country = String(data.get("country") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !company || !email || !interest) {
      if (formStatus) {
        formStatus.textContent = "Please complete the required fields to prepare the private demo request.";
      }
      return;
    }

    const subject = encodeURIComponent(`Private demo request - Random Card Poker - ${company}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Company: ${company}`,
        `Role: ${role || "Not specified"}`,
        `Email: ${email}`,
        `Country: ${country || "Not specified"}`,
        `Area of interest: ${interest}`,
        "",
        "Message:",
        message || "I would like to request a private review conversation for Random Card Poker."
      ].join("\n")
    );

    if (formStatus) {
      formStatus.textContent = "Opening your email client with the private demo request prepared.";
    }

    window.location.href = `mailto:gm@randomcardpoker.com?subject=${subject}&body=${body}`;
  });
}
