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
  gsap.utils.toArray(".section:not(.services-section):not(.reviews-section), .cta-band").forEach(section => {
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

  // Stagger FAQ
  gsap.from(".faq-item", {
    scrollTrigger: {
      trigger: ".faq-list",
      start: "top 86%",
      once: true
    },
    y: 58,
    scale: 0.94,
    opacity: 0,
    duration: 0.82,
    stagger: 0.11,
    ease: "bounce.out",
    clearProps: "transform,opacity"
  });

  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { y: -9, scale: 1.01, duration: .34, ease: 'back.out(2.5)', overwrite: 'auto' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { y: 0, scale: 1, duration: .28, ease: 'power2.out', overwrite: 'auto', clearProps: 'transform' });
      });
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
const approvedCategoryCards = [...document.querySelectorAll('.approved-category-card')];
const approvedSelectorButtons = [...document.querySelectorAll('[data-approved-select]')];
const approvedCardsGrid = document.querySelector('.approved-cards-grid');
const approvedLightbox = document.querySelector('.approved-lightbox');
const reduceReviewMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let reviewIndex = 0;
let reviewLoopWidth = 0;
let reviewStepSize = 0;
let reviewLoopFrame = null;
let reviewLastFrame = 0;
let reviewAutoPosition = 0;
let reviewScrollFrame = null;
let reviewLastTrigger = null;
let reviewHovered = false;
let reviewFocused = false;
let reviewTouching = false;
let reviewManualPauseUntil = 0;
let reviewUsingSubpixel = false;
let approvedTouchStart = 0;
let approvedLastTrigger = null;
let approvedLightboxState = null;
let approvedGridTouchStart = 0;
let approvedRotationTimer = null;
let approvedRotationCursor = 0;
const approvedRotationDelay = 2000;

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
  const normalizedIndex = (index + reviewCards.length) % reviewCards.length;
  if (normalizedIndex === reviewIndex) return;
  reviewIndex = normalizedIndex;
  [...(reviewIndicators?.children || [])].forEach((indicator, index) => {
    const isActive = index === reviewIndex;
    indicator.classList.toggle('is-active', isActive);
    indicator.setAttribute('aria-current', String(isActive));
  });
};

const clearReviewSubpixelOffset = () => {
  if (!reviewsTrack || !reviewUsingSubpixel) return;
  reviewsTrack.scrollLeft = Math.round(reviewAutoPosition);
  reviewsTrack.style.removeProperty('--review-subpixel');
  reviewAutoPosition = reviewsTrack.scrollLeft;
  reviewUsingSubpixel = false;
};

const pauseReviewsTemporarily = (duration = 2400) => {
  clearReviewSubpixelOffset();
  reviewManualPauseUntil = performance.now() + duration;
};

const measureReviewLoop = () => {
  if (!reviewsTrack || reviewCards.length < 2) return;
  const firstCard = reviewsTrack.children[0];
  const firstClone = reviewsTrack.children[reviewCards.length];
  if (!firstCard || !firstClone) return;
  reviewLoopWidth = firstClone.offsetLeft - firstCard.offsetLeft;
  reviewStepSize = reviewCardStep();
  if (reviewLoopWidth && reviewsTrack.scrollLeft >= reviewLoopWidth) {
    reviewsTrack.scrollLeft %= reviewLoopWidth;
  }
  reviewAutoPosition = reviewsTrack.scrollLeft;
};

const normalizeReviewLoop = () => {
  if (!reviewsTrack || !reviewLoopWidth) return;
  if (reviewsTrack.scrollLeft >= reviewLoopWidth) reviewsTrack.scrollLeft %= reviewLoopWidth;
  reviewAutoPosition = reviewsTrack.scrollLeft;
};

const syncReviewFromScroll = () => {
  const step = reviewStepSize || reviewCardStep();
  if (!reviewsTrack || !step || !reviewCards.length) return;
  const position = reviewLoopWidth ? reviewsTrack.scrollLeft % reviewLoopWidth : reviewsTrack.scrollLeft;
  markActiveReview(Math.round(position / step));
};

const moveReviews = direction => {
  if (!reviewsTrack || !reviewLoopWidth) return;
  const step = reviewCardStep();
  pauseReviewsTemporarily(2800);
  if (direction < 0 && reviewsTrack.scrollLeft < step * .55) {
    reviewsTrack.scrollLeft += reviewLoopWidth;
  }
  const target = reviewsTrack.scrollLeft + step * direction;
  reviewsTrack.scrollTo({ left: target, behavior: reduceReviewMotion ? 'auto' : 'smooth' });
  window.setTimeout(() => {
    normalizeReviewLoop();
    syncReviewFromScroll();
  }, reduceReviewMotion ? 0 : 760);
};

const goToReview = index => {
  if (!reviewsTrack || !reviewLoopWidth) return;
  pauseReviewsTemporarily(2800);
  const step = reviewCardStep();
  const target = index * step;
  markActiveReview(index);
  reviewsTrack.scrollTo({ left: target, behavior: reduceReviewMotion ? 'auto' : 'smooth' });
  window.setTimeout(() => {
    reviewAutoPosition = reviewsTrack.scrollLeft;
    syncReviewFromScroll();
  }, reduceReviewMotion ? 0 : 760);
};

const animateReviews = time => {
  if (!reviewsTrack) return;
  const elapsed = Math.min(time - (reviewLastFrame || time), 40);
  const modalIsOpen = reviewModal && !reviewModal.hidden;
  const isPaused = reduceReviewMotion || reviewHovered || reviewFocused || reviewTouching || modalIsOpen || time < reviewManualPauseUntil || document.hidden;
  if (!isPaused && reviewLoopWidth) {
    reviewAutoPosition += elapsed * .04;
    if (reviewAutoPosition >= reviewLoopWidth) reviewAutoPosition -= reviewLoopWidth;
    const integerPosition = Math.floor(reviewAutoPosition);
    reviewsTrack.scrollLeft = integerPosition;
    reviewsTrack.style.setProperty('--review-subpixel', `${integerPosition - reviewAutoPosition}px`);
    reviewUsingSubpixel = true;
    if (reviewStepSize) markActiveReview(Math.round(reviewAutoPosition / reviewStepSize));
  } else {
    clearReviewSubpixelOffset();
    reviewAutoPosition = reviewsTrack.scrollLeft;
  }
  reviewLastFrame = time;
  reviewLoopFrame = window.requestAnimationFrame(animateReviews);
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

const approvedStudentPhotos = {
  A: ['esquerda', 'direita', 'esquerda', 'esquerda', 'direita', 'esquerda', 'direita', 'esquerda', 'direita', 'direita']
    .map((side, index) => `./assets/cnh%20a/aprovado_lote2_${String(index + 1).padStart(2, '0')}_${side}.png`),
  B: ['esquerda', 'direita', 'esquerda', 'direita', 'esquerda', 'direita', 'esquerda', 'direita', 'esquerda', 'direita', 'esquerda', 'direita', 'esquerda', 'direita', 'direita', 'esquerda', 'direita', 'esquerda', 'direita']
    .map((side, index) => `./assets/cnh%20b/aprovado_${String(index + 1).padStart(2, '0')}_${side}.png`),
  D: Array.from({ length: 19 }, (_, index) => `./assets/cnh%20d/aprovado_onibus_${String(index + 1).padStart(3, '0')}.png`)
};

const preloadApprovedPhoto = source => {
  if (!source) return;
  const image = new Image();
  image.decoding = 'async';
  image.src = source;
};

const updateApprovedCardUI = state => {
  state.dots.forEach((dot, index) => dot.classList.toggle('is-active', index === state.index % state.dots.length));
};

const clearApprovedRotation = () => {
  window.clearTimeout(approvedRotationTimer);
  approvedRotationTimer = null;
};

const scheduleApprovedSequence = (delay = approvedRotationDelay) => {
  clearApprovedRotation();
  if (reduceReviewMotion || !approvedStates.length) return;
  approvedRotationTimer = window.setTimeout(async () => {
    const state = approvedStates[approvedRotationCursor];
    if (!state || state.hovered || state.transitioning || document.hidden || (approvedLightbox && !approvedLightbox.hidden)) {
      scheduleApprovedSequence(600);
      return;
    }
    await showApprovedPhoto(state, state.index + 1);
    approvedRotationCursor = (approvedRotationCursor + 1) % approvedStates.length;
    scheduleApprovedSequence();
  }, delay);
};

const showApprovedPhoto = async (state, targetIndex) => {
  if (!state || state.transitioning || !state.photos.length) return false;
  const nextIndex = (targetIndex + state.photos.length) % state.photos.length;
  if (nextIndex === state.index) return false;
  state.transitioning = true;
  const currentLayer = state.layers[state.activeLayer];
  const nextLayerIndex = state.activeLayer === 0 ? 1 : 0;
  const nextLayer = state.layers[nextLayerIndex];
  nextLayer.src = state.photos[nextIndex];
  nextLayer.alt = `Aluno aprovado - Categoria ${state.category}`;
  try {
    if (!nextLayer.complete) await new Promise((resolve, reject) => {
      nextLayer.addEventListener('load', resolve, { once: true });
      nextLayer.addEventListener('error', reject, { once: true });
    });
    await nextLayer.decode().catch(() => {});
  } catch {
    state.transitioning = false;
    return false;
  }
  nextLayer.classList.add('is-active');
  currentLayer.classList.remove('is-active');
  state.activeLayer = nextLayerIndex;
  state.index = nextIndex;
  updateApprovedCardUI(state);
  window.setTimeout(() => {
    if (!currentLayer.classList.contains('is-active')) currentLayer.removeAttribute('src');
    state.transitioning = false;
  }, reduceReviewMotion ? 0 : 800);
  preloadApprovedPhoto(state.photos[(state.index + 1) % state.photos.length]);
  preloadApprovedPhoto(state.photos[(state.index - 1 + state.photos.length) % state.photos.length]);
  return true;
};

const approvedStates = approvedCategoryCards.map((card, categoryIndex) => {
  const category = card.dataset.approvedCategory;
  const state = {
    card,
    category,
    photos: approvedStudentPhotos[category] || [],
    layers: [...card.querySelectorAll('.approved-photo-layer')],
    dots: [...card.querySelectorAll('.approved-card-dots i')],
    index: 0,
    activeLayer: 0,
    transitioning: false,
    hovered: false
  };
  updateApprovedCardUI(state);
  preloadApprovedPhoto(state.photos[1]);
  card.addEventListener('mouseenter', () => {
    state.hovered = true;
    clearApprovedRotation();
  });
  card.addEventListener('mouseleave', () => {
    state.hovered = false;
    scheduleApprovedSequence();
  });
  const changeManually = async direction => {
    clearApprovedRotation();
    await showApprovedPhoto(state, state.index + direction);
    approvedRotationCursor = (categoryIndex + 1) % approvedCategoryCards.length;
    scheduleApprovedSequence();
  };
  card.querySelector('.approved-card-prev')?.addEventListener('click', () => changeManually(-1));
  card.querySelector('.approved-card-next')?.addEventListener('click', () => changeManually(1));
  card.querySelector('.approved-photo-open')?.addEventListener('click', event => openApprovedLightbox(state, event.currentTarget));
  return state;
});

scheduleApprovedSequence();

const renderApprovedLightbox = () => {
  if (!approvedLightbox || !approvedLightboxState) return;
  const { state, index } = approvedLightboxState;
  const target = approvedLightbox.querySelector('img');
  target.src = state.photos[index];
  target.alt = `Aluno aprovado - Categoria ${state.category}`;
  approvedLightbox.querySelector('.approved-lightbox-category').textContent = `Categoria ${state.category}`;
  preloadApprovedPhoto(state.photos[(index + 1) % state.photos.length]);
  preloadApprovedPhoto(state.photos[(index - 1 + state.photos.length) % state.photos.length]);
};

const openApprovedLightbox = (state, trigger) => {
  if (!approvedLightbox || !state?.photos.length) return;
  approvedLastTrigger = trigger || document.activeElement;
  approvedLightboxState = { state, index: state.index };
  clearApprovedRotation();
  renderApprovedLightbox();
  approvedLightbox.hidden = false;
  document.body.classList.add('has-approved-lightbox');
  approvedLightbox.querySelector('.approved-lightbox-close')?.focus();
};

const closeApprovedLightbox = () => {
  if (!approvedLightbox || approvedLightbox.hidden) return;
  const selected = approvedLightboxState;
  approvedLightbox.hidden = true;
  document.body.classList.remove('has-approved-lightbox');
  if (selected) {
    showApprovedPhoto(selected.state, selected.index);
    approvedRotationCursor = (approvedStates.indexOf(selected.state) + 1) % approvedStates.length;
  }
  approvedLightboxState = null;
  scheduleApprovedSequence();
  approvedLastTrigger?.focus();
};

const moveApprovedLightbox = direction => {
  if (!approvedLightboxState) return;
  const total = approvedLightboxState.state.photos.length;
  approvedLightboxState.index = (approvedLightboxState.index + direction + total) % total;
  renderApprovedLightbox();
};

const selectApprovedCategory = category => {
  approvedSelectorButtons.forEach(button => {
    const isActive = button.dataset.approvedSelect === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  approvedCategoryCards.forEach(card => card.classList.toggle('is-mobile-active', card.dataset.approvedCategory === category));
};

approvedSelectorButtons.forEach(button => button.addEventListener('click', () => selectApprovedCategory(button.dataset.approvedSelect)));
approvedCardsGrid?.addEventListener('touchstart', event => { approvedGridTouchStart = event.changedTouches[0].clientX; }, { passive: true });
approvedCardsGrid?.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - approvedGridTouchStart;
  if (Math.abs(distance) < 48 || window.innerWidth > 640) return;
  const categories = approvedStates.map(state => state.category);
  const activeCategory = approvedCategoryCards.find(card => card.classList.contains('is-mobile-active'))?.dataset.approvedCategory || categories[0];
  const currentIndex = categories.indexOf(activeCategory);
  selectApprovedCategory(categories[(currentIndex + (distance < 0 ? 1 : -1) + categories.length) % categories.length]);
}, { passive: true });

approvedLightbox?.querySelector('.approved-lightbox-close')?.addEventListener('click', closeApprovedLightbox);
approvedLightbox?.querySelector('.approved-lightbox-backdrop')?.addEventListener('click', closeApprovedLightbox);
approvedLightbox?.querySelector('.approved-lightbox-prev')?.addEventListener('click', () => moveApprovedLightbox(-1));
approvedLightbox?.querySelector('.approved-lightbox-next')?.addEventListener('click', () => moveApprovedLightbox(1));
approvedLightbox?.addEventListener('touchstart', event => { approvedTouchStart = event.changedTouches[0].clientX; }, { passive: true });
approvedLightbox?.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].clientX - approvedTouchStart;
  if (Math.abs(distance) > 45) moveApprovedLightbox(distance > 0 ? -1 : 1);
}, { passive: true });
document.addEventListener('visibilitychange', () => {
  clearApprovedRotation();
  if (!document.hidden) scheduleApprovedSequence();
});

if (reviewsTrack && reviewCards.length > 1) {
  reviewCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('review-card-clone');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('button, a').forEach(control => control.setAttribute('tabindex', '-1'));
    reviewsTrack.appendChild(clone);
  });
  reviewsTrack.classList.add('is-looping');

  reviewsTrack.addEventListener('click', event => {
    const button = event.target.closest('.review-read-more');
    if (button) openReviewModal(button.closest('.review-card'));
  });
  reviewsTrack.addEventListener('scroll', () => {
    const isManualScroll = reviewHovered || reviewFocused || reviewTouching || performance.now() < reviewManualPauseUntil;
    if (!isManualScroll) return;
    window.cancelAnimationFrame(reviewScrollFrame);
    reviewScrollFrame = window.requestAnimationFrame(syncReviewFromScroll);
  }, { passive: true });
  reviewsTrack.addEventListener('mouseenter', () => { reviewHovered = true; });
  reviewsTrack.addEventListener('mouseleave', () => { reviewHovered = false; });
  reviewsTrack.addEventListener('focusin', () => { reviewFocused = true; });
  reviewsTrack.addEventListener('focusout', event => { reviewFocused = reviewsTrack.contains(event.relatedTarget); });
  reviewsTrack.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') reviewTouching = true;
    pauseReviewsTemporarily();
  }, { passive: true });
  reviewsTrack.addEventListener('pointerup', () => {
    reviewTouching = false;
    pauseReviewsTemporarily();
  }, { passive: true });
  reviewsTrack.addEventListener('pointercancel', () => { reviewTouching = false; }, { passive: true });
  reviewsTrack.addEventListener('wheel', () => pauseReviewsTemporarily(), { passive: true });

  window.requestAnimationFrame(() => {
    measureReviewLoop();
    reviewLoopFrame = window.requestAnimationFrame(animateReviews);
  });
}

reviewsPrev?.addEventListener('click', () => moveReviews(-1));
reviewsNext?.addEventListener('click', () => moveReviews(1));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeReviewModal();
    closeApprovedLightbox();
  }
  if (approvedLightbox && !approvedLightbox.hidden && event.key === 'ArrowLeft') moveApprovedLightbox(-1);
  if (approvedLightbox && !approvedLightbox.hidden && event.key === 'ArrowRight') moveApprovedLightbox(1);
});
window.addEventListener('resize', () => {
  measureReviewLoop();
  syncReviewFromScroll();
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
