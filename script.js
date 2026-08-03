/* ==========================================================================
   PTL PERFORMANCE — SCRIPT
   Vanilla JavaScript only. No frameworks, no build step.
   Handles: sticky nav state, mobile menu, scroll reveal animations,
   FAQ accordion, gallery lightbox, floating CTA, contact form, footer year.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. HEADER — solid background after scrolling past the hero
  ------------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  const scrollThreshold = 60;

  function updateHeaderState() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  /* ------------------------------------------------------------------
     2. MOBILE HAMBURGER MENU
  ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeMobileNav() : openMobileNav();
  });

  // Close mobile nav whenever a link inside it is clicked
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* ------------------------------------------------------------------
     3. SCROLL REVEAL — fade/slide elements into view as they enter
        the viewport. Uses IntersectionObserver for performance.
  ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     4. FAQ ACCORDION
  ------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other open items (single-open accordion behaviour)
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------
     5. GALLERY LIGHTBOX
  ------------------------------------------------------------------ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastFocusedElement = null;

  function openLightbox(src, alt) {
    lastFocusedElement = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.hidden = false;
    // Allow the browser to register the hidden -> visible change before transitioning
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImage.src = '';
    }, 250);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const imgAlt = item.querySelector('img').alt;
      openLightbox(fullSrc, imgAlt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  /* ------------------------------------------------------------------
     6. FLOATING MOBILE CTA — appear after scrolling past the hero
  ------------------------------------------------------------------ */
  const floatingCta = document.getElementById('floating-cta');

  function updateFloatingCta() {
    if (window.scrollY > window.innerHeight * 0.6) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateFloatingCta, { passive: true });
  updateFloatingCta();

  /* ------------------------------------------------------------------
     7. CONTACT FORM — client side confirmation
        (No backend is wired up; this simply confirms submission
        intent and resets the form. Replace with a real endpoint
        or form service such as Formspree when going live.)
  ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formConfirmation = document.getElementById('form-confirmation');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      formConfirmation.hidden = false;
      contactForm.reset();
      formConfirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ------------------------------------------------------------------
     8. FOOTER — current year
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
