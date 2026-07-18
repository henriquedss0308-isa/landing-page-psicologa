/**
 * Dra. Ana Martins — Premium Landing Page
 * Interactions: progress, nav, reveal, counters, FAQ, form, sticky CTA
 */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reducedMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = reducedMotionMq.matches;

  if (typeof reducedMotionMq.addEventListener === "function") {
    reducedMotionMq.addEventListener("change", (e) => {
      prefersReducedMotion = e.matches;
    });
  } else if (typeof reducedMotionMq.addListener === "function") {
    reducedMotionMq.addListener((e) => {
      prefersReducedMotion = e.matches;
    });
  }

  /* ---------- Utilities ---------- */
  function throttle(fn, wait) {
    let last = 0;
    let timer = null;
    return function (...args) {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        last = now;
        fn.apply(this, args);
      } else if (!timer) {
        timer = setTimeout(() => {
          last = Date.now();
          timer = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function getFocusable(container) {
    return $$(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => {
      if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") {
        return false;
      }
      const style = window.getComputedStyle(el);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  }

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Scroll progress ---------- */
  const progressBar = $("#scroll-progress");

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct =
      docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = pct + "%";
    progressBar.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  /* ---------- Header ---------- */
  const header = $("#header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  /* ---------- Back to top ---------- */
  const backTop = $("#back-top");

  function updateBackTop() {
    if (!backTop) return;
    const show = window.scrollY > 600;
    backTop.classList.toggle("is-visible", show);
    backTop.hidden = !show;
    backTop.setAttribute("aria-hidden", String(!show));
  }

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------- Mobile sticky CTA ---------- */
  const mobileCta = $("#mobile-cta");
  const contactSection = $("#contato");
  const heroSection = $("#inicio");

  function updateMobileCta() {
    if (!mobileCta) return;

    if (window.innerWidth >= 768) {
      mobileCta.classList.remove("is-visible");
      mobileCta.hidden = true;
      mobileCta.setAttribute("aria-hidden", "true");
      document.body.classList.remove("has-mobile-cta");
      return;
    }

    const pastHero = heroSection
      ? window.scrollY > heroSection.offsetHeight * 0.55
      : window.scrollY > 400;

    let inContact = false;
    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      inContact = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
    }

    const show = pastHero && !inContact;
    mobileCta.hidden = !show;
    mobileCta.classList.toggle("is-visible", show);
    mobileCta.setAttribute("aria-hidden", String(!show));
    document.body.classList.toggle("has-mobile-cta", show);
  }

  /* ---------- Scroll handler (batched) ---------- */
  const onScroll = throttle(() => {
    updateProgress();
    updateHeader();
    updateBackTop();
    updateMobileCta();
    updateActiveNav();
  }, 16);

  updateProgress();
  updateHeader();
  updateBackTop();
  updateMobileCta();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    throttle(() => {
      updateMobileCta();
      if (window.innerWidth > 960) setNavOpen(false);
    }, 100),
    { passive: true }
  );

  /* ---------- Mobile navigation ---------- */
  const navToggle = $("#nav-toggle");
  const nav = $("#nav");
  const navLinks = $$(".nav__link");
  let lastFocusedBeforeNav = null;
  let navFocusTrapHandler = null;

  function setNavOpen(open, options = {}) {
    if (!nav || !navToggle) return;
    const { restoreFocus = true } = options;

    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute(
      "aria-label",
      open ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
    document.body.classList.toggle("nav-open", open);

    if (window.innerWidth <= 960) {
      nav.setAttribute("aria-hidden", String(!open));
    } else {
      nav.removeAttribute("aria-hidden");
    }

    if (open && window.innerWidth <= 960) {
      lastFocusedBeforeNav = document.activeElement;
      const focusables = getFocusable(nav);
      if (focusables.length) {
        window.requestAnimationFrame(() => focusables[0].focus());
      }

      if (navFocusTrapHandler) {
        document.removeEventListener("keydown", navFocusTrapHandler);
      }
      navFocusTrapHandler = (e) => {
        if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
        const items = getFocusable(nav);
        // Include toggle in trap cycle when it is outside nav in DOM
        const cycle = [navToggle, ...items].filter(Boolean);
        if (cycle.length < 2) return;
        const first = cycle[0];
        const last = cycle[cycle.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", navFocusTrapHandler);
    } else {
      if (navFocusTrapHandler) {
        document.removeEventListener("keydown", navFocusTrapHandler);
        navFocusTrapHandler = null;
      }
      if (
        restoreFocus &&
        lastFocusedBeforeNav &&
        typeof lastFocusedBeforeNav.focus === "function"
      ) {
        lastFocusedBeforeNav.focus();
      }
      lastFocusedBeforeNav = null;
    }
  }

  if (navToggle && nav) {
    // Desktop: nav is always visible; mobile: closed until opened
    if (window.innerWidth <= 960) {
      nav.setAttribute("aria-hidden", "true");
    }

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () =>
        setNavOpen(false, { restoreFocus: false })
      );
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setNavOpen(false, { restoreFocus: false });
        navToggle.focus();
      }
    });
  }

  /* ---------- Active nav link ---------- */
  const sections = $$("main section[id]");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;
    let currentId = "";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      // CTA button keeps its own style — only aria-current for state
      const isCta = link.hasAttribute("data-nav-cta");
      const isActive = href === `#${currentId}`;

      if (!isCta) {
        link.classList.toggle("is-active", isActive);
      } else {
        link.classList.remove("is-active");
      }

      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  updateActiveNav();

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const groups = new Map();
      revealEls.forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
      });

      groups.forEach((children) => {
        children.forEach((child, i) => {
          if (i > 0 && i <= 6) child.setAttribute("data-delay", String(i));
        });
      });

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
      );

      revealEls.forEach((el) => observer.observe(el));
    }
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-count") || "0");
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();

    if (prefersReducedMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const value = target * easeOutCubic(t);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }

    requestAnimationFrame(frame);
  }

  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObs.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- FAQ accordion (animated + a11y) ---------- */
  const faqItems = $$(".faq__item");

  function setFaqOpen(item, open) {
    const button = $(".faq__question", item);
    const panel = $(".faq__panel", item);
    if (!button || !panel) return;

    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));

    if ("inert" in HTMLElement.prototype) {
      panel.inert = !open;
    }
  }

  faqItems.forEach((item) => {
    const button = $(".faq__question", item);
    const panel = $(".faq__panel", item);
    if (!button || !panel) return;

    // Closed by default
    setFaqOpen(item, false);

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((other) => {
        if (other !== item) setFaqOpen(other, false);
      });

      setFaqOpen(item, !isOpen);
    });
  });

  /* ---------- Phone mask ---------- */
  const phoneInput = $("#telefone");

  function formatPhone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      const target = e.target;
      const cursor = target.selectionStart;
      const prevLen = target.value.length;
      target.value = formatPhone(target.value);
      if (document.activeElement === target) {
        const diff = target.value.length - prevLen;
        const next = Math.max(0, (cursor || 0) + diff);
        try {
          target.setSelectionRange(next, next);
        } catch (_) {
          /* ignore */
        }
      }
    });
  }

  /* ---------- Contact form ---------- */
  const form = $("#contact-form");
  const successMsg = $("#form-success");
  const submitBtn = $("#submit-btn");

  const validators = {
    nome: (value) => {
      if (!value.trim()) return "Informe seu nome completo.";
      if (value.trim().length < 3)
        return "Nome deve ter pelo menos 3 caracteres.";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "Informe seu e-mail.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Informe um e-mail válido.";
      return "";
    },
    telefone: (value) => {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "Informe seu WhatsApp.";
      if (digits.length < 10) return "Telefone incompleto.";
      if (digits.length === 11 && digits[2] !== "9")
        return "Informe um celular válido com DDD.";
      return "";
    },
    mensagem: (value) => {
      if (!value.trim()) return "Conte um pouco sobre o que você precisa.";
      if (value.trim().length < 10)
        return "Mensagem muito curta (mín. 10 caracteres).";
      return "";
    },
    privacidade: (_value, el) => {
      if (!el.checked)
        return "Confirme que entende se tratar de uma demonstração.";
      return "";
    },
  };

  function showError(fieldName, message) {
    const input = $(`#${fieldName}`);
    const errorEl = $(`#erro-${fieldName}`);
    if (input) {
      input.classList.toggle("is-invalid", Boolean(message));
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");

      // Checkbox group visual state
      if (input.type === "checkbox") {
        const group = input.closest(".form-group--checkbox");
        if (group) group.classList.toggle("is-invalid", Boolean(message));
      }
    }
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(fieldName) {
    const el = $(`#${fieldName}`);
    if (!el || !validators[fieldName]) return true;
    const value = el.type === "checkbox" ? el.checked : el.value;
    const message = validators[fieldName](value, el);
    showError(fieldName, message);
    return !message;
  }

  if (form) {
    // Portfolio safety: never navigate or post to a real endpoint
    form.setAttribute("action", "#contato");
    form.setAttribute("method", "post");

    ["nome", "email", "telefone", "mensagem"].forEach((name) => {
      const el = $(`#${name}`);
      if (!el) return;
      el.addEventListener("blur", () => validateField(name));
      el.addEventListener("input", () => {
        if (el.classList.contains("is-invalid")) validateField(name);
      });
    });

    const privacy = $("#privacidade");
    if (privacy) {
      privacy.addEventListener("change", () => validateField("privacidade"));
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const fields = ["nome", "email", "telefone", "mensagem", "privacidade"];
      let firstInvalid = null;
      let allValid = true;

      fields.forEach((name) => {
        const ok = validateField(name);
        if (!ok) {
          allValid = false;
          if (!firstInvalid) firstInvalid = $(`#${name}`);
        }
      });

      if (!allValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("is-loading");
        submitBtn.setAttribute("aria-busy", "true");
      }

      // Demo only: no fetch, no FormData upload, no third-party endpoint
      window.setTimeout(() => {
        form.reset();
        fields.forEach((name) => showError(name, ""));

        if (successMsg) {
          successMsg.hidden = false;
          successMsg.setAttribute("tabindex", "-1");
          successMsg.focus();
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-loading");
          submitBtn.removeAttribute("aria-busy");
        }

        window.setTimeout(() => {
          if (successMsg) {
            successMsg.hidden = true;
            successMsg.removeAttribute("tabindex");
          }
        }, 7000);
      }, 900);
    });
  }

  /* ---------- Smooth anchors (reduced motion fallback) ---------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;

      if (prefersReducedMotion) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    });
  });

  /* ---------- Subtle hero parallax (desktop only, throttled) ---------- */
  const heroVisual = $(".hero__visual");
  if (
    heroVisual &&
    !prefersReducedMotion &&
    window.matchMedia("(min-width: 980px) and (pointer: fine)").matches
  ) {
    const frame = $(".hero__frame", heroVisual);
    if (frame) {
      const onMove = throttle((e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        frame.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
      }, 32);

      heroVisual.addEventListener("mousemove", onMove);

      heroVisual.addEventListener("mouseleave", () => {
        frame.style.transform = "";
        frame.style.transition =
          "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        window.setTimeout(() => {
          frame.style.transition = "";
        }, 600);
      });
    }
  }
})();
