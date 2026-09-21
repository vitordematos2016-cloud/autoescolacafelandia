// Toda nova carga da página começa obrigatoriamente no início.
const root = document.documentElement;
const previousScrollBehavior = root.style.scrollBehavior;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);

const resetScrollPosition = () => {
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.scrollTop = 0;
  document.body.scrollTop = 0;
};

const finishPageReset = () => {
  resetScrollPosition();
  requestAnimationFrame(() => {
    resetScrollPosition();
    root.style.scrollBehavior = previousScrollBehavior;
  });
};

resetScrollPosition();
window.addEventListener('DOMContentLoaded', finishPageReset, { once: true });
window.addEventListener('load', finishPageReset, { once: true });
window.addEventListener('pageshow', finishPageReset, { once: true });
window.addEventListener('beforeunload', resetScrollPosition);

// --- GSAP Cinematographic Effects ---
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Animations
  gsap.from(".hero h1", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
  gsap.from(".hero p", { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.4 });
  gsap.from(".hero .hero-actions", { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.6 });
  gsap.from(".hero-visual .scene", { scale: 0.9, opacity: 0, duration: 1.5, ease: "power2.out", delay: 0.5 });

  // Fade-up for sections
  gsap.utils.toArray(".section:not(.services-section):not(.reviews-section):not(.location-section):not(.faq-section)").forEach(section => {
    const sectionContent = section.querySelector(':scope > .container') || section;
    gsap.from(sectionContent, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  const locationSection = document.querySelector('.location-section');
  if (locationSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const locationTimeline = gsap.timeline({
      scrollTrigger: { trigger: locationSection, start: 'top 78%', once: true },
      defaults: { duration: .72, ease: 'power2.out', clearProps: 'transform,opacity' }
    });
    locationTimeline
      .from('.location-heading', { y: 24, opacity: 0 })
      .from('.location-contact-card', { x: -24, opacity: 0 }, '-=.42')
      .from('.location-map', { opacity: 0 }, '-=.52')
      .from('.location-microcard', { y: 18, opacity: 0, stagger: .1 }, '-=.3');
  }
  
  // Stagger cards
  gsap.from(".card, .difference-item", {
    scrollTrigger: {
      trigger: ".cards, .differences-list",
      start: "top 85%"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out"
  });

  const faqSection = document.querySelector('.faq-section');
  const faqCta = document.querySelector('.cta-band');
  if (faqSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const faqTimeline = gsap.timeline({
      scrollTrigger: { trigger: faqSection, start: 'top 80%', once: true },
      defaults: { duration: .62, ease: 'power2.out', clearProps: 'transform,opacity' }
    });
    faqTimeline
      .from('.faq-intro', { y: 22, opacity: 0 })
      .from('.faq-item', { y: 18, opacity: 0, stagger: .08 }, '-=.38');
  }
  if (faqCta && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from('.cta-box', {
      scrollTrigger: { trigger: faqCta, start: 'top 88%', once: true },
      y: 22,
      opacity: 0,
      duration: .68,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    });
  }

  // 3D Billboard / Tilt Effect
  const scene = document.querySelector(".scene");
  if (scene) {
    scene.addEventListener("mousemove", (e) => {
      const rect = scene.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12; // Eixo X
      const rotateY = ((x - centerX) / centerX) * 12;  // Eixo Y
      
      gsap.to(scene, {
        duration: 0.4,
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: "power1.out",
        overwrite: "auto"
      });
      
      // Efeito de profundidade (parallax) nos ícones flutuantes e na logo
      gsap.to(".logo-wrap", {
        duration: 0.4,
        x: (x - centerX) * 0.05,
        y: (y - centerY) * 0.05,
        ease: "power1.out"
      });
    });

    scene.addEventListener("mouseleave", () => {
      gsap.to(scene, {
        duration: 0.8,
        rotateX: 0,
        rotateY: 0,
        ease: "power2.out",
        overwrite: "auto"
      });
      gsap.to(".logo-wrap", {
        duration: 0.8,
        x: 0,
        y: 0,
        ease: "power2.out"
      });
    });
  }
});

// --- Original Logic ---
const header = document.querySelector('#header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileShortcuts = document.querySelector('.mobile-shortcuts');
const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');

const setMobileMenuState = isOpen => {
  if (!mobileMenuToggle || !mobileShortcuts || !mobileMenuBackdrop) return;
  mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
  mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Fechar atalhos' : 'Abrir atalhos');
  mobileShortcuts.setAttribute('aria-hidden', String(!isOpen));
  mobileShortcuts.classList.toggle('is-open', isOpen);
  mobileMenuBackdrop.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('mobile-menu-open', isOpen);
};

mobileMenuToggle?.addEventListener('click', () => {
  const willOpen = mobileMenuToggle.getAttribute('aria-expanded') !== 'true';
  setMobileMenuState(willOpen);
  if (willOpen) requestAnimationFrame(() => mobileShortcuts?.querySelector('a')?.focus());
});

mobileMenuBackdrop?.addEventListener('click', () => setMobileMenuState(false));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || mobileMenuToggle?.getAttribute('aria-expanded') !== 'true') return;
  setMobileMenuState(false);
  mobileMenuToggle.focus();
});

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 16));
const faqButtons = [...document.querySelectorAll('.faq-q')];
const setFaqItemState = (button, isOpen) => {
  const item = button.closest('.faq-item');
  const answer = item?.querySelector('.faq-a');
  const toggle = button.querySelector('.faq-toggle');
  item?.classList.toggle('open', isOpen);
  button.setAttribute('aria-expanded', String(isOpen));
  answer?.setAttribute('aria-hidden', String(!isOpen));
  if (toggle) toggle.textContent = isOpen ? '−' : '+';
};

faqButtons.forEach(button => {
  setFaqItemState(button, button.closest('.faq-item')?.classList.contains('open'));
  button.addEventListener('click', () => {
    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    faqButtons.forEach(otherButton => setFaqItemState(otherButton, otherButton === button && willOpen));
  });
});

const reviewsTrack = document.querySelector('.reviews-track');
const reviewsPrev = document.querySelector('.reviews-prev');
const reviewsNext = document.querySelector('.reviews-next');
const reviewCards = reviewsTrack ? [...reviewsTrack.querySelectorAll('.review-card')] : [];
const reviewIndicators = document.querySelector('.reviews-indicators');
const reviewModal = document.querySelector('.review-modal');
const reduceReviewMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let reviewIndex = 0;
let reviewScrollFrame = null;
let reviewLastTrigger = null;
let reviewPointerStartX = 0;
let reviewPointerStartScroll = 0;
let reviewPointerMoved = false;
let reviewDragging = false;
let reviewLoopWidth = 0;
let reviewLoopFrame = null;
let reviewLoopLastTime = 0;
let reviewAutoPauseUntil = 0;

const reviewCardStep = () => {
  const firstCard = reviewCards[0];
  const gap = reviewsTrack ? parseFloat(getComputedStyle(reviewsTrack).gap) || 0 : 0;
  return firstCard ? firstCard.getBoundingClientRect().width + gap : 0;
};

const updateReviewIndicators = () => {
  if (!reviewIndicators) return;
  reviewIndicators.replaceChildren(...reviewCards.map((_, index) => {
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.className = `review-indicator${index === reviewIndex ? ' is-active' : ''}`;
    indicator.setAttribute('aria-label', `Ir para a avaliação ${index + 1}`);
    indicator.setAttribute('aria-current', index === reviewIndex ? 'true' : 'false');
    indicator.addEventListener('click', () => goToReview(index));
    return indicator;
  }));
};

const updateReviewControls = () => {
  if (!reviewsTrack || !reviewsPrev || !reviewsNext) return;
  const hasMultipleReviews = reviewCards.length > 1;
  reviewsPrev.disabled = !hasMultipleReviews;
  reviewsNext.disabled = !hasMultipleReviews;
  updateReviewIndicators();
};

const markActiveReview = index => {
  if (!reviewCards.length) return;
  const normalizedIndex = (index % reviewCards.length + reviewCards.length) % reviewCards.length;
  reviewIndex = normalizedIndex;
  [...(reviewIndicators?.children || [])].forEach((indicator, index) => {
    const isActive = index === reviewIndex;
    indicator.classList.toggle('is-active', isActive);
    indicator.setAttribute('aria-current', String(isActive));
  });
};

const syncReviewFromScroll = () => {
  const step = reviewCardStep();
  if (!reviewsTrack || !step || !reviewCards.length) return;
  const position = reviewLoopWidth ? reviewsTrack.scrollLeft % reviewLoopWidth : reviewsTrack.scrollLeft;
  markActiveReview(Math.round(position / step));
};

const pauseReviewAutoLoop = (duration = 1300) => {
  reviewAutoPauseUntil = performance.now() + duration;
};

const measureReviewLoop = () => {
  if (!reviewsTrack || reviewCards.length < 2) return;
  const firstCard = reviewsTrack.children[0];
  const firstClone = reviewsTrack.children[reviewCards.length];
  if (!firstCard || !firstClone) return;
  reviewLoopWidth = firstClone.offsetLeft - firstCard.offsetLeft;
  if (reviewLoopWidth && reviewsTrack.scrollLeft >= reviewLoopWidth) {
    reviewsTrack.scrollLeft %= reviewLoopWidth;
  }
};

const moveReviews = direction => {
  if (!reviewsTrack || reviewCards.length < 2) return;
  pauseReviewAutoLoop();
  if (direction > 0 && reviewIndex === reviewCards.length - 1 && reviewLoopWidth) {
    markActiveReview(0);
    reviewsTrack.scrollTo({ left: reviewLoopWidth, behavior: reduceReviewMotion ? 'auto' : 'smooth' });
    window.setTimeout(() => { reviewsTrack.scrollLeft = 0; }, reduceReviewMotion ? 0 : 760);
    return;
  }
  if (direction < 0 && reviewIndex === 0 && reviewLoopWidth) {
    reviewsTrack.scrollLeft += reviewLoopWidth;
  }
  const nextIndex = (reviewIndex + direction + reviewCards.length) % reviewCards.length;
  goToReview(nextIndex);
};

const goToReview = index => {
  if (!reviewsTrack || !reviewCards.length) return;
  pauseReviewAutoLoop();
  const step = reviewCardStep();
  const nextIndex = (index % reviewCards.length + reviewCards.length) % reviewCards.length;
  markActiveReview(nextIndex);
  reviewsTrack.scrollTo({ left: nextIndex * step, behavior: reduceReviewMotion ? 'auto' : 'smooth' });
};

const animateReviewLoop = time => {
  if (!reviewsTrack) return;
  const elapsed = Math.min(time - (reviewLoopLastTime || time), 40);
  const modalIsOpen = reviewModal && !reviewModal.hidden;
  const canMove = !reduceReviewMotion && !reviewDragging && !modalIsOpen && !document.hidden && time >= reviewAutoPauseUntil && reviewLoopWidth;

  if (canMove) {
    reviewsTrack.scrollLeft += elapsed * .035;
    if (reviewsTrack.scrollLeft >= reviewLoopWidth) reviewsTrack.scrollLeft -= reviewLoopWidth;
  }

  reviewLoopLastTime = time;
  reviewLoopFrame = window.requestAnimationFrame(animateReviewLoop);
};

const openReviewModal = card => {
  if (!reviewModal || !card) return;
  reviewLastTrigger = document.activeElement;
  const person = card.querySelector('.review-card-person');
  reviewModal.querySelector('.review-modal-source').textContent = card.querySelector('.review-source')?.textContent.trim() || '';
  reviewModal.querySelector('#review-modal-title').textContent = person?.querySelector('strong')?.textContent || 'Avaliação';
  reviewModal.querySelector('blockquote').textContent = card.querySelector('blockquote')?.textContent || '';
  reviewModal.querySelector('.review-modal-meta').textContent = person?.querySelector('small')?.textContent || '';
  reviewModal.querySelector('.review-modal-link').href = card.dataset.reviewUrl || '#';
  reviewModal.hidden = false;
  document.body.classList.add('has-review-modal');
  reviewModal.querySelector('.review-modal-close')?.focus();
};

const closeReviewModal = () => {
  if (!reviewModal || reviewModal.hidden) return;
  reviewModal.hidden = true;
  document.body.classList.remove('has-review-modal');
  reviewLastTrigger?.focus();
};

reviewModal?.querySelector('.review-modal-close')?.addEventListener('click', closeReviewModal);
reviewModal?.querySelector('.review-modal-backdrop')?.addEventListener('click', closeReviewModal);

if (reviewsTrack && reviewCards.length > 1) {
  reviewCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('review-card-clone');
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('tabindex', '-1');
    reviewsTrack.appendChild(clone);
  });
  reviewsTrack.classList.add('is-looping');

  reviewsTrack.addEventListener('click', event => {
    const card = event.target.closest('.review-card');
    if (card && !reviewPointerMoved) openReviewModal(card);
  });
  reviewsTrack.addEventListener('scroll', () => {
    window.cancelAnimationFrame(reviewScrollFrame);
    reviewScrollFrame = window.requestAnimationFrame(syncReviewFromScroll);
  }, { passive: true });
  reviewsTrack.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pauseReviewAutoLoop();
    reviewDragging = true;
    reviewPointerMoved = false;
    reviewPointerStartX = event.clientX;
    reviewPointerStartScroll = reviewsTrack.scrollLeft;
    reviewsTrack.classList.add('is-dragging');
    reviewsTrack.setPointerCapture?.(event.pointerId);
  });
  reviewsTrack.addEventListener('pointermove', event => {
    if (!reviewDragging) return;
    const distance = event.clientX - reviewPointerStartX;
    if (Math.abs(distance) > 6) reviewPointerMoved = true;
    if (!reviewPointerMoved) return;
    event.preventDefault();
    reviewsTrack.scrollLeft = reviewPointerStartScroll - distance;
  });
  const finishReviewDrag = event => {
    if (!reviewDragging) return;
    reviewDragging = false;
    reviewsTrack.classList.remove('is-dragging');
    if (event?.pointerId !== undefined) reviewsTrack.releasePointerCapture?.(event.pointerId);
    if (reviewPointerMoved) {
      if (reviewLoopWidth) reviewsTrack.scrollLeft %= reviewLoopWidth;
      goToReview(Math.round(reviewsTrack.scrollLeft / reviewCardStep()));
      window.setTimeout(() => { reviewPointerMoved = false; }, 0);
    }
  };
  reviewsTrack.addEventListener('pointerup', finishReviewDrag);
  reviewsTrack.addEventListener('pointercancel', finishReviewDrag);
  reviewCards.forEach(card => card.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openReviewModal(card);
  }));
  reviewsTrack.addEventListener('wheel', () => pauseReviewAutoLoop(), { passive: true });

  window.requestAnimationFrame(() => {
    measureReviewLoop();
    reviewLoopFrame = window.requestAnimationFrame(animateReviewLoop);
  });
}

reviewsPrev?.addEventListener('click', () => moveReviews(-1));
reviewsNext?.addEventListener('click', () => moveReviews(1));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeReviewModal();
  }
  if (reviewsTrack?.contains(document.activeElement) && event.key === 'ArrowLeft') {
    event.preventDefault();
    moveReviews(-1);
  }
  if (reviewsTrack?.contains(document.activeElement) && event.key === 'ArrowRight') {
    event.preventDefault();
    moveReviews(1);
  }
});
window.addEventListener('resize', () => {
  updateReviewControls();
  window.requestAnimationFrame(() => {
    measureReviewLoop();
    if (reviewsTrack) reviewsTrack.scrollLeft = reviewIndex * reviewCardStep();
  });
});
updateReviewControls();

document.querySelector('#year').textContent = new Date().getFullYear();

// --- Header navigation / scrollspy ---
const menuLinks = [...document.querySelectorAll('.menu a[href^="#"], .mobile-shortcuts a[href^="#"]')];
const getTrackedSections = () => {
  return [
    { triggerId: 'inicio', navId: 'inicio' },
    { triggerId: 'servicos', navId: 'servicos' },
    { triggerId: 'diferenciais', navId: 'diferenciais' },
    { triggerId: 'reputacao', navId: 'avaliacoes' },
    { triggerId: 'avaliacoes', navId: 'avaliacoes' },
    { triggerId: 'localizacao', navId: 'localizacao' },
    { triggerId: 'duvidas', navId: 'duvidas' },
    { triggerId: 'contato', navId: 'duvidas' }
  ]
    .map(section => ({ ...section, element: document.getElementById(section.triggerId) }))
    .filter(section => section.element);
};

let pinnedNavId = null;
let pinnedUntil = 0;
let activeSectionId = null;
let scrollSpyFrame = null;
let scrollSpyStarted = false;

const setActiveMenuItem = id => {
  menuLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

const replaceHash = id => {
  if (!id || window.location.hash === `#${id}`) return;
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
};

const isPinnedTargetVisible = id => {
  const target = document.getElementById(id);
  if (!target) return false;
  const headerHeight = header?.offsetHeight || 0;
  const navigationRegion = target.closest('section') || target;
  const rect = navigationRegion.getBoundingClientRect();
  const probe = headerHeight + window.innerHeight * .32;
  return rect.top <= probe && rect.bottom > probe;
};

const updateScrollSpy = () => {
  scrollSpyFrame = null;

  if (pinnedNavId) {
    const pinIsProtected = performance.now() < pinnedUntil;
    if (pinIsProtected || isPinnedTargetVisible(pinnedNavId)) {
      setActiveMenuItem(pinnedNavId);
      replaceHash(pinnedNavId);
      activeSectionId = pinnedNavId;
      return;
    }
    pinnedNavId = null;
  }

  const trackedSections = getTrackedSections();
  const headerHeight = header?.offsetHeight || 0;
  const probeY = window.scrollY + headerHeight + window.innerHeight * .32;
  let currentSection = trackedSections[0];

  trackedSections.forEach(section => {
    const sectionTop = section.element.getBoundingClientRect().top + window.scrollY;
    if (sectionTop <= probeY) currentSection = section;
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    currentSection = trackedSections[trackedSections.length - 1];
  }

  if (!currentSection || currentSection.navId === activeSectionId) return;
  activeSectionId = currentSection.navId;
  setActiveMenuItem(currentSection.navId);
  replaceHash(currentSection.navId);
};

const scheduleScrollSpy = () => {
  if (!scrollSpyStarted) return;
  if (scrollSpyFrame !== null) return;
  scrollSpyFrame = requestAnimationFrame(updateScrollSpy);
};

const navigateFromHeader = (event, id) => {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  pinnedNavId = id;
  pinnedUntil = performance.now() + 1400;
  activeSectionId = id;
  setActiveMenuItem(id);
  if (window.location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start'
  });
};

menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    navigateFromHeader(event, link.hash.slice(1));
    setMobileMenuState(false);
  });
});

document.querySelector('.brand')?.addEventListener('click', event => {
  navigateFromHeader(event, 'inicio');
  setMobileMenuState(false);
});

window.addEventListener('scroll', scheduleScrollSpy, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) setMobileMenuState(false);
  scheduleScrollSpy();
});
window.addEventListener('hashchange', () => {
  const id = window.location.hash.slice(1);
  if (menuLinks.some(link => link.hash === `#${id}`)) {
    pinnedNavId = id;
    pinnedUntil = performance.now() + 1200;
  }
  scheduleScrollSpy();
});

const startScrollSpy = () => {
  if (scrollSpyStarted) return;
  scrollSpyStarted = true;
  const initialId = window.location.hash.slice(1);
  const initialTarget = document.getElementById(initialId);
  if (menuLinks.some(link => link.hash === `#${initialId}`)) {
    pinnedNavId = initialId;
    pinnedUntil = performance.now() + 1200;
    setActiveMenuItem(initialId);
  }
  if (initialTarget) {
    requestAnimationFrame(() => {
      initialTarget.scrollIntoView({ block: 'start' });
      requestAnimationFrame(scheduleScrollSpy);
    });
  } else {
    scheduleScrollSpy();
  }
};

startScrollSpy();
