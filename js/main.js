/**
 * PORTFOLIO — MAIN JS
 * GSAP + ScrollTrigger animations
 * Custom cursor, page loader, horizontal scroll
 */

// ============================================
// GSAP REGISTRATION
// ============================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================
// UTILITIES
// ============================================
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================
// PAGE LOADER
// ============================================
function initLoader() {
  const loader = qs('#page-loader');
  if (!loader) return;

  const logoSpans = qsa('.loader-logo span');
  const bar = qs('.loader-bar');
  const count = qs('.loader-count');

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = '';
      initAfterLoad();
    }
  });

  document.body.style.overflow = 'hidden';

  // Animate logo letters in
  tl.to(logoSpans, {
    translateY: '0%',
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.06,
    delay: 0.2
  });

  // Animate counter
  let progress = { val: 0 };
  tl.to(progress, {
    val: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      const v = Math.round(progress.val);
      if (bar) bar.style.width = v + '%';
      if (count) count.textContent = v + '%';
    }
  }, 0.4);

  // Fade out loader
  tl.to(loader, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    delay: 0.3,
    onComplete: () => loader.style.display = 'none'
  });
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
  const cursor = qs('#cursor');
  const follower = qs('#cursor-follower');
  const cursorText = qs('#cursor-text');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursor, {
      x: mouseX, y: mouseY,
      duration: 0.15,
      ease: 'power3.out'
    });

    if (cursorText) {
      gsap.to(cursorText, {
        x: mouseX, y: mouseY + 36,
        duration: 0.15
      });
    }
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverEls = qsa('a, button, [data-cursor]');
  hoverEls.forEach(el => {
    const curText = el.dataset.cursorText;
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
      if (curText && cursorText) {
        cursorText.textContent = curText;
        cursorText.style.opacity = '1';
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
      if (cursorText) cursorText.style.opacity = '0';
    });
  });

  // Hide on mobile
  document.addEventListener('touchstart', () => {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }, { once: true });
}

// ============================================
// NAVIGATION
// ============================================
function initNav() {
  const nav = qs('nav');
  const menuBtn = qs('.nav-menu-btn');
  const mobileMenu = qs('.mobile-menu');
  const mobileLinks = qsa('.mobile-menu a');

  if (!nav) return;

  // Scroll behavior
  let lastScroll = 0;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const scroll = self.scroller.pageYOffset || 0;
      if (scroll > 80 && scroll > lastScroll) {
        gsap.to(nav, { y: '-100%', duration: 0.5, ease: 'power2.inOut' });
      } else {
        gsap.to(nav, { y: '0%', duration: 0.5, ease: 'power2.out' });
      }
      lastScroll = scroll;
    }
  });

  // Mobile menu toggle
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// ============================================
// HERO ANIMATIONS
// ============================================
function initHero() {
  const hero = qs('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ delay: 0.3 });

  // Eyebrow
  tl.to('.hero-eyebrow', {
    opacity: 1, y: 0, duration: 1, ease: 'expo.out'
  }, 0);

  // Hero title lines
  const titleMasks = qsa('.hero-title .text-mask-inner');
  tl.to(titleMasks, {
    translateY: '0%',
    duration: 1.4,
    ease: 'expo.out',
    stagger: 0.08
  }, 0.2);

  // Description
  tl.to('.hero-desc', {
    opacity: 1, y: 0, duration: 1, ease: 'expo.out'
  }, 0.6);

  tl.to('.hero-jp', {
    opacity: 1, y: 0, duration: 1, ease: 'expo.out'
  }, 0.7);

  tl.to('.hero-scroll-hint', {
    opacity: 1, duration: 1
  }, 1);

  // Background parallax
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set('.hero-bg-img', {
        y: self.progress * 80
      });
    }
  });
}

// ============================================
// SECTION REVEAL ANIMATIONS
// ============================================
function initReveals() {
  // Reveal up
  qsa('.reveal-up').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out',
          delay: parseFloat(el.dataset.delay || 0)
        });
      },
      once: true
    });
  });

  // Reveal left
  qsa('.reveal-left').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1, x: 0,
          duration: 1.2, ease: 'expo.out',
          delay: parseFloat(el.dataset.delay || 0)
        });
      },
      once: true
    });
  });

  // Reveal right
  qsa('.reveal-right').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1, x: 0,
          duration: 1.2, ease: 'expo.out',
          delay: parseFloat(el.dataset.delay || 0)
        });
      },
      once: true
    });
  });

  // Reveal scale
  qsa('.reveal-scale').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1, scale: 1,
          duration: 1.4, ease: 'expo.out',
          delay: parseFloat(el.dataset.delay || 0)
        });
      },
      once: true
    });
  });

  // Text mask reveals
  qsa('.text-mask').forEach((mask, i) => {
    const inner = mask.querySelector('.text-mask-inner');
    if (!inner) return;
    ScrollTrigger.create({
      trigger: mask,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(inner, {
          translateY: '0%',
          duration: 1.2,
          ease: 'expo.out',
          delay: parseFloat(mask.dataset.delay || 0)
        });
      },
      once: true
    });
  });
}

// ============================================
// STAGGER ANIMATIONS
// ============================================
function initStagger() {
  qsa('[data-stagger]').forEach(container => {
    const children = qsa(container.dataset.stagger, container);
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.12
        });
      },
      once: true
    });
  });
}

// ============================================
// HORIZONTAL SCROLL
// ============================================
function initHorizontalScroll() {
  const wrapper = qs('.h-scroll-wrapper');
  const container = qs('.h-scroll-container');

  if (!wrapper || !container) return;

  const cards = qsa('.h-scroll-card');

  const gap = 2;
  const totalWidth = cards.length * (cards[0].offsetWidth + gap);
  const scrollAmount = totalWidth - window.innerWidth;

  // top + bottom same spacing
  const extraSpace = window.innerHeight * 0.5;

  gsap.to(container, {
    x: -scrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      pin: true,
      scrub: 1,

      // start after 50% viewport space
      start: `top+=${extraSpace} top`,

      // end with same bottom spacing
      end: () => `+=${scrollAmount + window.innerHeight + extraSpace}`,

      anticipatePin: 1
    }
  });
}

// ============================================
// IMAGE PARALLAX
// ============================================
function initParallax() {
  qsa('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax || 0.2);
    ScrollTrigger.create({
      trigger: el.closest('section') || el.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(el, { y: self.progress * 100 * speed });
      }
    });
  });
}

// ============================================
// SPLIT IMAGE REVEAL (clip-path)
// ============================================
function initSplitReveal() {
  qsa('.split-img-reveal').forEach(el => {
    gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(el, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.6,
          ease: 'expo.inOut'
        });
      },
      once: true
    });
  });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
  qsa('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.5,
          ease: 'expo.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          }
        });
      },
      once: true
    });
  });
}

// ============================================
// GALLERY FILTER (Work page)
// ============================================
function initFilter() {
  const tabs = qsa('.filter-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter items
      const items = qsa('[data-category]');
      items.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        gsap.to(item, {
          opacity: show ? 1 : 0.15,
          scale: show ? 1 : 0.97,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });
  });
}

// ============================================
// LIGHTBOX
// ============================================
function initLightbox() {
  const lightbox = qs('#lightbox');
  if (!lightbox) return;

  const lightboxImg = qs('.lightbox-img');
  const closeBtn = qs('.lightbox-close');
  const prevBtn = qs('.lightbox-prev');
  const nextBtn = qs('.lightbox-next');
  const countEl = qs('.lightbox-count');

  let images = [];
  let current = 0;

  function openLightbox(index) {
    current = index;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (countEl) countEl.textContent = `${current + 1} / ${images.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    current = (current + dir + images.length) % images.length;
    gsap.to(lightboxImg, {
      opacity: 0, x: dir * -40, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        lightboxImg.src = images[current].src;
        gsap.fromTo(lightboxImg,
          { opacity: 0, x: dir * 40 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    });
    if (countEl) countEl.textContent = `${current + 1} / ${images.length}`;
  }

  // Gather gallery images
  qsa('.gallery-item').forEach((item, i) => {
    const img = item.querySelector('.gallery-img');
    if (img) {
      images.push({ src: img.src, alt: img.alt });
      item.addEventListener('click', () => openLightbox(i));
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Click outside
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// ============================================
// PAGE TRANSITION
// ============================================
function initPageTransitions() {
  const transition = qs('#page-transition');
  if (!transition) return;

  qsa('a[data-transition]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.href;
      if (!href || href === window.location.href) return;
      e.preventDefault();

      gsap.fromTo(transition,
        { y: '100%' },
        {
          y: '0%',
          duration: 0.7,
          ease: 'expo.inOut',
          onComplete: () => { window.location.href = href; }
        }
      );
    });
  });

  // Animate in on load
  gsap.fromTo(transition,
    { y: '0%' },
    { y: '-100%', duration: 0.8, ease: 'expo.inOut', delay: 0.1 }
  );
}

// ============================================
// WORK PAGE — PROJECT ITEMS
// ============================================
function initProjectItems() {
  const items = qsa('.project-item');
  if (!items.length) return;

  gsap.set(items, { opacity: 0, x: -30 });

  ScrollTrigger.create({
    trigger: '.project-list',
    start: 'top 80%',
    onEnter: () => {
      gsap.to(items, {
        opacity: 1, x: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08
      });
    },
    once: true
  });
}

// ============================================
// WORK GRID STAGGER
// ============================================
function initWorkGrid() {
  const items = qsa('.work-item');
  if (!items.length) return;

  gsap.set(items, { opacity: 0, scale: 0.95 });

  ScrollTrigger.create({
    trigger: '.work-grid',
    start: 'top 80%',
    onEnter: () => {
      gsap.to(items, {
        opacity: 1, scale: 1,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1
      });
    },
    once: true
  });
}

// ============================================
// GALLERY REVEAL
// ============================================
function initGalleryReveal() {
  const items = qsa('.gallery-item');
  if (!items.length) return;

  gsap.set(items, { opacity: 0, y: 40 });

  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(item, {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'expo.out',
          delay: (i % 3) * 0.1
        });
      },
      once: true
    });
  });
}

// ============================================
// MARQUEE PAUSE ON HOVER
// ============================================
function initMarquee() {
  const track = qs('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

// ============================================
// INIT AFTER LOAD
// ============================================
function initAfterLoad() {
  initCursor();
  initNav();
  initHero();
  initReveals();
  initStagger();
  initHorizontalScroll();
  initParallax();
  initSplitReveal();
  initCounters();
  initFilter();
  initLightbox();
  initProjectItems();
  initWorkGrid();
  initGalleryReveal();
  initMarquee();
  initPageTransitions();

  // Refresh ScrollTrigger
  setTimeout(() => ScrollTrigger.refresh(), 100);
}

// ============================================
// BOOT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Set initial states
  gsap.set('.hero-eyebrow', { opacity: 0, y: 20 });
  gsap.set('.hero-desc', { opacity: 0, y: 20 });
  gsap.set('.hero-jp', { opacity: 0, y: 20 });
  gsap.set('.hero-scroll-hint', { opacity: 0 });

  const hasLoader = qs('#page-loader');
  if (hasLoader) {
    initLoader();
  } else {
    initAfterLoad();
    // Animate transition panel out
    const tp = qs('#page-transition');
    if (tp) {
      gsap.fromTo(tp, { y: '0%' }, { y: '-100%', duration: 0.8, ease: 'expo.inOut', delay: 0.1 });
    }
  }
});
