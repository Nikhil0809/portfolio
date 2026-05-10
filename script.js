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
    const gap = 32; // 2rem gap
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

// ═══════════════════════════════════════════════════════════
// ═══ ANTI-GRAVITY COSMOS — Skills Floating Icons Engine ═══
// ═══════════════════════════════════════════════════════════
(function initCosmos() {
  const stage = document.getElementById('cosmosStage');
  const canvas = document.getElementById('particleCanvas');
  const tooltip = document.getElementById('cosmosTooltip');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d');
  const icons = stage.querySelectorAll('.float-icon');
  const iconCount = icons.length;

  // ── Resize canvas ──
  function resizeCanvas() {
    const section = canvas.closest('.skills-cosmos');
    if (!section) return;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ── Mouse tracking ──
  let mouseX = -9999, mouseY = -9999;
  let stageRect = stage.getBoundingClientRect();

  stage.addEventListener('mousemove', e => {
    stageRect = stage.getBoundingClientRect();
    mouseX = e.clientX - stageRect.left;
    mouseY = e.clientY - stageRect.top;
  });
  stage.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  // ── Particle System ──
  const particles = [];
  const PARTICLE_COUNT = 60;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,117,110,${alpha})`;
      ctx.fill();

      // Subtle glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184,150,90,${alpha * 0.15})`;
      ctx.fill();
    });
  }

  // ── Icon Physics State ──
  const stageW = () => stage.offsetWidth;
  const stageH = () => stage.offsetHeight;
  const centerX = () => stageW() / 2;
  const centerY = () => stageH() / 2;

  const iconStates = [];

  // Distribute icons in asymmetric orbital positions
  icons.forEach((icon, i) => {
    const depth = parseFloat(icon.dataset.depth) || 1;
    const angle = (i / iconCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const radius = 140 + Math.random() * 160;
    const scale = 0.6 + depth * 0.3;

    const state = {
      el: icon,
      // Position
      x: centerX() + Math.cos(angle) * radius,
      y: centerY() + Math.sin(angle) * radius,
      // Velocity
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      // Orbital
      orbAngle: angle,
      orbRadius: radius,
      orbSpeed: (0.0003 + Math.random() * 0.0006) * (Math.random() > 0.5 ? 1 : -1),
      // Drift
      driftPhaseX: Math.random() * Math.PI * 2,
      driftPhaseY: Math.random() * Math.PI * 2,
      driftSpeedX: 0.003 + Math.random() * 0.005,
      driftSpeedY: 0.002 + Math.random() * 0.004,
      driftAmpX: 8 + Math.random() * 15,
      driftAmpY: 6 + Math.random() * 12,
      // Z-axis bob
      zPhase: Math.random() * Math.PI * 2,
      zSpeed: 0.004 + Math.random() * 0.006,
      zAmp: 0.04 + Math.random() * 0.06,
      // Rotation
      rotX: 0, rotY: 0, rotZ: 0,
      rotVX: (Math.random() - 0.5) * 0.08,
      rotVY: (Math.random() - 0.5) * 0.08,
      rotVZ: (Math.random() - 0.5) * 0.04,
      // Scale & depth
      depth,
      scale,
      baseScale: scale,
      // Breathing
      breathPhase: Math.random() * Math.PI * 2,
      breathSpeed: 0.015 + Math.random() * 0.01,
      isBreathing: Math.random() > 0.5,
      // Mouse repulsion state
      repelX: 0,
      repelY: 0
    };

    iconStates.push(state);

    // Assign breathing class randomly
    if (state.isBreathing) {
      icon.style.animationDelay = (Math.random() * 4) + 's';
      icon.classList.add('breathing');
    }
  });

  // ── Tooltip ──
  icons.forEach((icon, i) => {
    icon.addEventListener('mouseenter', e => {
      const label = icon.dataset.label || '';
      if (tooltip && label) {
        tooltip.textContent = label;
        tooltip.classList.add('visible');
      }
    });
    icon.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.classList.remove('visible');
    });
  });

  document.addEventListener('mousemove', e => {
    if (tooltip && tooltip.classList.contains('visible')) {
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top = (e.clientY - 10) + 'px';
    }
  });

  // ── Physics Loop ──
  let lastTime = performance.now();

  function physicsStep(now) {
    const dt = Math.min((now - lastTime) / 16.67, 3); // Normalize to ~60fps
    lastTime = now;

    const sw = stageW();
    const sh = stageH();
    const cx = centerX();
    const cy = centerY();
    const iconSize = window.innerWidth < 768 ? 54 : 68;
    const halfIcon = iconSize / 2;

    iconStates.forEach((s, i) => {
      // 1. Orbital movement
      s.orbAngle += s.orbSpeed * dt;

      const orbTargetX = cx + Math.cos(s.orbAngle) * s.orbRadius;
      const orbTargetY = cy + Math.sin(s.orbAngle) * s.orbRadius;

      // 2. Random drift
      s.driftPhaseX += s.driftSpeedX * dt;
      s.driftPhaseY += s.driftSpeedY * dt;

      const driftX = Math.sin(s.driftPhaseX) * s.driftAmpX;
      const driftY = Math.cos(s.driftPhaseY) * s.driftAmpY;

      // 3. Target position = orbit + drift
      const targetX = orbTargetX + driftX;
      const targetY = orbTargetY + driftY;

      // 4. Spring force toward target (soft)
      const springK = 0.008;
      const ax = (targetX - s.x) * springK;
      const ay = (targetY - s.y) * springK;

      s.vx += ax * dt;
      s.vy += ay * dt;

      // 5. Mouse interaction — repulsion
      const REPEL_RADIUS = 120;
      const REPEL_STRENGTH = 2.5;
      if (mouseX > -999) {
        const dx = s.x - mouseX;
        const dy = s.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 1) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          s.repelX += (dx / dist) * force * dt;
          s.repelY += (dy / dist) * force * dt;
        }
      }

      // Decay repel
      s.repelX *= 0.92;
      s.repelY *= 0.92;
      s.vx += s.repelX * 0.1;
      s.vy += s.repelY * 0.1;

      // 6. Damping (friction in zero-g)
      s.vx *= 0.96;
      s.vy *= 0.96;

      // 7. Apply velocity
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      // 8. Soft boundary bounce
      const margin = 20;
      if (s.x < margin) { s.x = margin; s.vx *= -0.4; }
      if (s.x > sw - margin) { s.x = sw - margin; s.vx *= -0.4; }
      if (s.y < margin) { s.y = margin; s.vy *= -0.4; }
      if (s.y > sh - margin) { s.y = sh - margin; s.vy *= -0.4; }

      // 9. Z-axis breathing (scale oscillation)
      s.zPhase += s.zSpeed * dt;
      const zScale = 1 + Math.sin(s.zPhase) * s.zAmp;
      s.scale = s.baseScale * zScale;

      // 10. Gentle rotation
      s.rotX += s.rotVX * dt;
      s.rotY += s.rotVY * dt;
      s.rotZ += s.rotVZ * dt;

      // Subtle mouse parallax tilt
      let parallaxRX = 0, parallaxRY = 0;
      if (mouseX > -999) {
        parallaxRX = ((mouseY - cy) / sh) * 8 * s.depth;
        parallaxRY = ((mouseX - cx) / sw) * -8 * s.depth;
      }

      // 11. Apply transform
      const tx = s.x - halfIcon;
      const ty = s.y - halfIcon;
      s.el.style.transform =
        `translate3d(${tx}px, ${ty}px, 0)
         scale(${s.scale.toFixed(3)})
         rotateX(${(s.rotX + parallaxRX).toFixed(2)}deg)
         rotateY(${(s.rotY + parallaxRY).toFixed(2)}deg)
         rotateZ(${s.rotZ.toFixed(2)}deg)`;
    });

    // Draw particles
    drawParticles();

    requestAnimationFrame(physicsStep);
  }

  // ── Start when section is visible ──
  const cosmosObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lastTime = performance.now();
        requestAnimationFrame(physicsStep);
        cosmosObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const cosmosSection = document.querySelector('.skills-cosmos');
  if (cosmosSection) cosmosObs.observe(cosmosSection);

  // Recalculate positions on resize
  window.addEventListener('resize', () => {
    stageRect = stage.getBoundingClientRect();
    iconStates.forEach(s => {
      s.orbRadius = Math.min(s.orbRadius, Math.min(stageW(), stageH()) * 0.42);
    });
  });
})();
