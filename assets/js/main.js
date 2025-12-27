// ===============================
//  Main JavaScript – Portfolio
//  - Theme toggle with localStorage
//  - Mobile navigation
//  - Scroll spy + reveal animations
//  - Skills meter animation
//  - Contact form validation
// ===============================

(function () {
  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const revealEls = document.querySelectorAll(".reveal-up");
  const skillMeters = document.querySelectorAll(".skills-meter");
  const contactForm = document.getElementById("contact-form");
  const footerYear = document.getElementById("footer-year");
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("image-lightbox-img");

  // -------------------------
  // Helper: Set footer year
  // -------------------------
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // -------------------------
  // Theme handling
  // -------------------------
  const THEME_KEY = "krystel-portfolio-theme";

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
  }

  function loadThemeFromStorage() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
      return;
    }
    // Default theme: dark
    applyTheme("dark");
  }

  function toggleTheme() {
    const current = body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // localStorage might be unavailable; fail silently
    }
  }

  loadThemeFromStorage();

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // -------------------------
  // Mobile navigation toggle
  // -------------------------
  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    if (navToggle) navToggle.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("open");
    if (navToggle) navToggle.classList.add("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (!mobileNav) return;
      const isOpen = mobileNav.classList.contains("open");
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  // Close mobile nav if window is resized to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) {
      closeMobileNav();
    }
  });

  // -------------------------
  // Scroll spy (active navigation link)
  // -------------------------
  const observerOptions = {
    root: null,
    threshold: 0.35,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (!id) return;

      const correspondingLinks = document.querySelectorAll(
        `.nav-link[href="#${id}"]`,
      );
      const correspondingMobileLinks = document.querySelectorAll(
        `.mobile-nav-link[href="#${id}"]`,
      );

      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
        mobileNavLinks.forEach((link) => link.classList.remove("is-active"));
        correspondingLinks.forEach((link) => link.classList.add("is-active"));
        correspondingMobileLinks.forEach((link) =>
          link.classList.add("is-active"),
        );
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // -------------------------
  // Scroll reveal animations
  // -------------------------
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // -------------------------
  // Skills meter animation
  // -------------------------
  const skillsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetLevel = bar.getAttribute("data-skill-level") || "0";
          bar.style.setProperty("--skill-level", `${targetLevel}%`);
          bar.classList.add("is-visible");
          obs.unobserve(bar);
        }
      });
    },
    {
      threshold: 0.3,
    },
  );

  skillMeters.forEach((meter) => skillsObserver.observe(meter));

  // -------------------------
  // Fullscreen project image viewer
  // -------------------------
  function openLightboxFromThumbnail(thumbnail) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = thumbnail.src;
    lightboxImg.alt = thumbnail.alt || "Project image preview";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", handleLightboxKeydown);
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.removeEventListener("keydown", handleLightboxKeydown);
  }

  function handleLightboxKeydown(event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  }

  const projectWrappers = document.querySelectorAll(".project-thumbnail-wrapper[data-fullscreen-image]");

  projectWrappers.forEach((wrapper) => {
    wrapper.style.cursor = "zoom-in";
    wrapper.addEventListener("click", () => {
      const img = wrapper.querySelector(".project-thumbnail");
      if (!img) return;
      openLightboxFromThumbnail(img);
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      const target = event.target;
      const shouldClose =
        target instanceof HTMLElement && target.hasAttribute("data-lightbox-close");
      if (shouldClose) {
        closeLightbox();
      }
    });
  }

  // -------------------------
  // Contact form validation
  // -------------------------
  function setFieldError(fieldEl, message) {
    const fieldWrapper = fieldEl.closest(".form-field");
    const errorEl = document.querySelector(
      `.form-error[data-error-for="${fieldEl.id}"]`,
    );
    if (!fieldWrapper || !errorEl) return;
    if (message) {
      fieldWrapper.classList.add("error");
      errorEl.textContent = message;
    } else {
      fieldWrapper.classList.remove("error");
      errorEl.textContent = "";
    }
  }

  function validateEmail(value) {
    // Basic email pattern for front-end validation only
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  function validateContactForm() {
    if (!contactForm) return false;
    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const messageInput = contactForm.querySelector("#message");
    const successEl = document.getElementById("form-success");

    let isValid = true;

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, "Please enter your name.");
      isValid = false;
    } else {
      setFieldError(nameInput, "");
    }

    if (!emailInput.value.trim()) {
      setFieldError(emailInput, "Please enter your email address.");
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldError(emailInput, "");
    }

    if (!messageInput.value.trim()) {
      setFieldError(messageInput, "Please write a short message.");
      isValid = false;
    } else if (messageInput.value.trim().length < 8) {
      setFieldError(messageInput, "Message should be at least 8 characters.");
      isValid = false;
    } else {
      setFieldError(messageInput, "");
    }

    if (successEl) {
      successEl.textContent = isValid
        ? "Thank you! Your message has been validated on this demo form."
        : "";
    }

    return isValid;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isValid = validateContactForm();
      if (!isValid) return;

      // For this portfolio demo, we only show success feedback
      contactForm.reset();
    });

    // Real-time error clearing on input
    ["input", "blur"].forEach((evtName) => {
      contactForm.addEventListener(evtName, (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
          return;
        }

        if (!target.id) return;

        if (target.id === "name" && target.value.trim()) {
          setFieldError(target, "");
        }

        if (target.id === "email") {
          if (!target.value.trim()) {
            setFieldError(target, "");
          } else if (validateEmail(target.value.trim())) {
            setFieldError(target, "");
          }
        }

        if (target.id === "message") {
          if (!target.value.trim()) {
            setFieldError(target, "");
          } else if (target.value.trim().length >= 8) {
            setFieldError(target, "");
          }
        }
      });
    });
  }
})();
