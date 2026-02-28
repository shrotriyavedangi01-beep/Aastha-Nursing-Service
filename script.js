(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const WHATSAPP_NUMBER = "919310626469";

  // Footer year
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => document.body.classList.add("loaded"));
  } else {
    document.body.classList.add("loaded");
  }

  // WhatsApp floating button
  const waFab = $("#waFab");
  if (waFab) waFab.href = `https://wa.me/${WHATSAPP_NUMBER}`;

  // ===== Mobile nav =====
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  const setNavOpen = (open) => {
    navMenu?.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle?.setAttribute("aria-expanded", String(open));
    navToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  navToggle?.addEventListener("click", () => setNavOpen(!navMenu.classList.contains("open")));
  $$("#navMenu a").forEach(a => a.addEventListener("click", () => setNavOpen(false)));

  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    if (!navMenu.classList.contains("open")) return;
    const t = e.target;
    if (t instanceof Element) {
      if (!navMenu.contains(t) && !navToggle.contains(t)) setNavOpen(false);
    }
  });

  // ===== Active nav link by current page =====
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const links = $$(".nav__link");

  links.forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    const isActive =
      (path === "" || path === "index.html") ? (href === "index.html" || href === "./index.html" || href === "/") :
      href.endsWith(path);
    a.classList.toggle("active", isActive);
  });

  // ===== Home-only: rotating hero text (only if elements exist) =====
  const heroTitle = $("#heroTitle");
  const heroSub = $("#heroSub");
  const slides = [
    { title: "Complete ICU at Home", sub: "Personal ICU setup with expert staff for critical patient care." },
    { title: "Professional Nursing Care", sub: "Injections, IVs, vitals, and post-operative care at home." },
    { title: "Physiotherapy at Home", sub: "Experienced physiotherapists for recovery and pain management." }
  ];

  if (heroTitle && heroSub) {
    let idx = 0;
    heroTitle.style.transition = "opacity .22s ease";
    heroSub.style.transition = "opacity .22s ease";

    setInterval(() => {
      idx = (idx + 1) % slides.length;
      heroTitle.style.opacity = "0";
      heroSub.style.opacity = "0";
      setTimeout(() => {
        heroTitle.textContent = slides[idx].title;
        heroSub.textContent = slides[idx].sub;
        heroTitle.style.opacity = "1";
        heroSub.style.opacity = "1";
      }, 220);
    }, 4500);
  }

  // ===== Contact form -> opens WhatsApp (if form exists) =====
  const form = $("#contactForm");
  const setErr = (k, msg) => {
    const el = form?.querySelector(`[data-err="${k}"]`);
    if (el) el.textContent = msg || "";
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements.namedItem("name")?.value?.trim() || "";
    const phone = form.elements.namedItem("phone")?.value?.trim() || "";
    const service = form.elements.namedItem("service")?.value || "";
    const message = form.elements.namedItem("message")?.value?.trim() || "";

    let ok = true;
    if (name.length < 2) { ok = false; setErr("name", "Enter your name."); } else setErr("name","");
    if (!/^\d{10,}$/.test(phone.replace(/\D/g,""))) { ok = false; setErr("phone", "Enter a valid phone."); } else setErr("phone","");
    if (!service) { ok = false; setErr("service", "Select a service."); } else setErr("service","");
    if (message.length < 8) { ok = false; setErr("message", "Write a short message."); } else setErr("message","");

    if (!ok) return;

    const text = encodeURIComponent(
      `Hello Aastha Nursing Service,\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}\n\nAreas: Noida/Delhi/Ghaziabad/Faridabad/Gurgaon`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    form.reset();
  });
})();
