/* ═══ PORTFOLIO ANIMATIONS & INTERACTIONS ═══ */

// ── Loader ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    animateHero();
  }, 1800);
});

// ── Hero entrance animation ──
function animateHero() {
  const els = ['heroTag','heroTitle','heroLine','heroSub','heroBtns','scrollInd'];
  els.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 200);
  });

  // Typing effect for hero italic text
  const typing = document.getElementById('heroTyping');
  if (!typing) return;
  const words = ['Future', 'Intelligent', 'Innovative', 'Impactful'];
  let wordIndex = 0;
  setInterval(() => {
    typing.style.opacity = '0';
    typing.style.transform = 'translateY(10px)';
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      typing.textContent = words[wordIndex];
      typing.style.opacity = '1';
      typing.style.transform = 'translateY(0)';
    }, 400);
  }, 3000);
  typing.style.transition = 'opacity .4s ease, transform .4s ease';
}

// ── Custom Cursor ──
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
if (dot && ring) {
  let mx = 0, my = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function moveCursor() {
    dx += (mx - dx) * 0.15;
    dy += (my - dy) * 0.15;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    dot.style.transform = 'translate(-50%,-50%)';
    ring.style.left = dx + 'px';
    ring.style.top = dy + 'px';
    requestAnimationFrame(moveCursor);
  })();
  document.querySelectorAll('a,button,.skill-card,.project-card-h,.achievement-card,.cert-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Trigger skill bars
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ── Stat Counter Animation ──
const statNums = document.querySelectorAll('.stat-num[data-count]');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isDecimal = target % 1 !== 0;
      const duration = 1500;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = isDecimal ? target.toFixed(2) : target;
      }
      requestAnimationFrame(tick);
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObs.observe(el));

// ── Mouse glow effect on hero ──
const hero = document.getElementById('hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hero.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(196,117,110,0.06), transparent 50%), var(--cream)`;
  });
  hero.addEventListener('mouseleave', () => {
    hero.style.background = 'var(--cream)';
  });
}

// ── Parallax floating shapes ──
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.float-shape').forEach((shape, i) => {
    const speed = (i + 1) * 0.03;
    shape.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ── About image tilt on hover ──
const aboutPhoto = document.getElementById('aboutPhoto');
if (aboutPhoto) {
  const wrap = aboutPhoto.parentElement;
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    aboutPhoto.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    aboutPhoto.style.transition = 'transform .1s ease';
  });
  wrap.addEventListener('mouseleave', () => {
    aboutPhoto.style.transform = 'perspective(600px) rotateY(0) rotateX(0)';
    aboutPhoto.style.transition = 'transform .5s ease';
  });
}

// ═══ PROJECTS CAROUSEL (Infinite Auto-Scroll) ═══
(function initCarousel() {
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('currentSlide');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !prevBtn || !nextBtn) return;

  // Clone cards for infinite loop
  const originalCards = Array.from(track.querySelectorAll('.project-card-h'));
  const numOriginal = originalCards.length;
  
  // Only clone if we have cards
  if (numOriginal > 0) {
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.style.animation = 'none'; // Disable entrance animation on clones
      clone.style.opacity = '1';
      clone.style.transform = 'none';
      track.appendChild(clone);
    });
  }

  const allCards = track.querySelectorAll('.project-card-h');
  let currentIndex = 0;
  let isDragging = false, startX = 0, scrollStart = 0;
  let autoPlayTimer;

  function getCardWidth() {
    if (!allCards.length) return 0;
    const gap = 24; // 1.5rem gap
    return allCards[0].offsetWidth + gap;
  }

  function updateActiveState() {
    // Update counter and dots based on original index
    const logicalIndex = currentIndex % numOriginal;
    if (counter) counter.textContent = String(logicalIndex + 1).padStart(2, '0');
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === logicalIndex);
      });
    }
  }

  function goToSlide(index, instant = false) {
    if (instant) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    }
    
    currentIndex = index;
    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateActiveState();
  }

  function nextSlide() {
    if (currentIndex >= numOriginal) {
      // Instant reset to 0, then slide to 1
      goToSlide(0, true);
      // Force reflow
      track.getBoundingClientRect();
      goToSlide(1);
    } else {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex <= 0) {
      // Instant jump to cloned end, then slide back
      goToSlide(numOriginal, true);
      track.getBoundingClientRect();
      goToSlide(numOriginal - 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });
  
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  // Dot click
  if (dotsContainer) {
    dotsContainer.querySelectorAll('.dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index));
        resetAutoPlay();
      });
    });
  }

  // Drag support
  const carousel = document.getElementById('projectsCarousel');
  carousel.addEventListener('mousedown', e => {
    isDragging = true; startX = e.clientX;
    scrollStart = currentIndex * getCardWidth();
    track.style.transition = 'none';
    clearInterval(autoPlayTimer);
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    track.style.transform = `translateX(${-scrollStart + diff}px)`;
  });
  document.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - startX;
    if (diff < -50) nextSlide();
    else if (diff > 50) prevSlide();
    else goToSlide(currentIndex);
    resetAutoPlay();
  });

  // Touch support
  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    scrollStart = currentIndex * getCardWidth();
    track.style.transition = 'none';
    clearInterval(autoPlayTimer);
  }, { passive: true });
  carousel.addEventListener('touchmove', e => {
    const diff = e.touches[0].clientX - startX;
    track.style.transform = `translateX(${-scrollStart + diff}px)`;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -40) nextSlide();
    else if (diff > 40) prevSlide();
    else goToSlide(currentIndex);
    resetAutoPlay();
  });

  // Auto-play slowly
  function startAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, 3500); // Slow moving
  }

  function resetAutoPlay() {
    startAutoPlay();
  }

  carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
  });

  // Initial update
  updateActiveState();
  startAutoPlay();
  
  // Recalculate on resize
  window.addEventListener('resize', () => goToSlide(currentIndex, true));
})();

// ── Smooth anchor scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
