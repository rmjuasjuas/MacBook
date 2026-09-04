/* ============================================================
   MacBook Pro M1 Max — Scroll Experience (sin dependencias CDN)
   ============================================================ */

const TOTAL_FRAMES = 180;
const frames = new Array(TOTAL_FRAMES).fill(null);
const canvas = document.getElementById('macbook-canvas');
const ctx    = canvas.getContext('2d');
const dpr    = window.devicePixelRatio || 1;
let frameIndex = 0;

/* ── Resize & draw ─────────────────────────────────────────── */
function resizeCanvas(img) {
  const scale = Math.min(
    (window.innerWidth * 0.9) / img.naturalWidth,
    (window.innerHeight * 0.9) / img.naturalHeight
  );
  const w = img.naturalWidth  * scale;
  const h = img.naturalHeight * scale;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);
}

function drawFrame(i) {
  const img = frames[i];
  if (!img) return;
  const w = canvas.width  / dpr;
  const h = canvas.height / dpr;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
}

/* ── Preload ────────────────────────────────  ───────────────── */
let loaded = 0;
const loaderBar  = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');
const loader     = document.getElementById('loader');

function pad(n) { return String(n).padStart(4, '0'); }

function loadFrame(i) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      frames[i] = img;
      loaded++;
      const pct = Math.round(loaded / TOTAL_FRAMES * 100);
      loaderBar.style.width = pct + '%';
      loaderText.textContent = 'Cargando… ' + pct + '%';
      if (i === 0) { resizeCanvas(img); drawFrame(0); }
      resolve();
    };
    img.onerror = resolve;
    img.src = 'frames/frame_' + pad(i + 1) + '.webp';
  });
}

async function loadAll() {
  // First 10 fast
  await Promise.all(Array.from({length:10}, (_,i) => loadFrame(i)));
  initPage();
  // Rest in batches
  for (let i = 10; i < TOTAL_FRAMES; i += 20) {
    await Promise.all(
      Array.from({length: Math.min(20, TOTAL_FRAMES-i)}, (_,j) => loadFrame(i+j))
    );
  }
}

/* ── Init page ─────────────────────────────────────────────── */
function initPage() {
  // Hide loader with fade
  loader.style.transition = 'opacity 0.6s';
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 700);

  // Show header
  setTimeout(() => {
    document.getElementById('site-header').classList.add('visible');
  }, 500);

  // Hero entrance — simple CSS transitions
  const heroEls = [
    '.hero-eyebrow', '.hero-title', '.hero-subtitle', '.hero-desc', '.hero-cta-group', '.hero-scroll-hint'
  ];
  heroEls.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 400 + i * 120);
  });

  initScroll();
}

/* ── Scroll logic ──────────────────────────────────────────── */
function initScroll() {
  const container = document.getElementById('scroll-container');
  const canvasWrap = document.querySelector('.canvas-wrap');
  const sections  = document.querySelectorAll('[data-enter]');
  const marquees  = document.querySelectorAll('.marquee-section');
  let   lastScroll = -1;
  let   rafId = null;

  // Position all sections
  function positionSections() {
    const totalH = container.offsetHeight;
    sections.forEach(el => {
      el.style.top = (parseFloat(el.dataset.enter) * totalH) + 'px';
    });
  }
  positionSections();
  window.addEventListener('resize', () => { positionSections(); if(frames[0]) resizeCanvas(frames[0]); });

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  }

  function tick() {
    rafId = null;
    const scrollY   = window.scrollY;
    const canvasTop = document.getElementById('canvas-section').offsetTop;
    const totalH    = container.offsetHeight;
    const progress  = Math.max(0, Math.min(1, (scrollY - canvasTop) / totalH));

    // Canvas reveal
    if (scrollY > canvasTop - window.innerHeight * 0.8) {
      canvasWrap.classList.add('revealed');
    }

    // Frame animation (finishes at 55% scroll)
    const frameProgress = Math.min(1, progress / 0.55);
    const targetFrame   = Math.round(frameProgress * (TOTAL_FRAMES - 1));
    if (targetFrame !== frameIndex) {
      frameIndex = targetFrame;
      drawFrame(frameIndex);
    }

    // Section visibility
    sections.forEach(el => {
      const enter = parseFloat(el.dataset.enter);
      const leave = parseFloat(el.dataset.leave || '1');
      const inView = progress >= enter && progress < leave;

      if (inView && el.style.opacity !== '1') {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) translateX(0) scale(1)';
        // stagger children
        el.querySelectorAll('.tag, .section-title, .section-body').forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(20px)';
          setTimeout(() => {
            child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 100);
        });
      } else if (!inView && el.style.opacity === '1' && !el.dataset.persist) {
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity = '0';
      }
    });

    // Marquees
    marquees.forEach(el => {
      const enter = parseFloat(el.dataset.enter);
      const leave = parseFloat(el.dataset.leave || '1');
      const isReverse = el.classList.contains('marquee-reverse');
      const wrap = el.querySelector('.marquee-wrap');

      if (progress >= enter && progress < leave) {
        el.style.opacity = '1';
        const p = (progress - enter) / (leave - enter);
        const shift = (isReverse ? p : -p) * wrap.scrollWidth * 0.4;
        wrap.style.transform = 'translateX(' + shift + 'px)';
      } else {
        el.style.opacity = '0';
      }
    });

    // Stats counters
    const statsEl = document.querySelector('.stats-section');
    if (statsEl) {
      const enter = parseFloat(statsEl.dataset.enter);
      const leave = parseFloat(statsEl.dataset.leave || '1');
      const inView = progress >= enter && progress < leave;
      if (inView && statsEl.style.opacity !== '1') {
        statsEl.style.transition = 'opacity 0.6s ease';
        statsEl.style.opacity = '1';
        statsEl.querySelectorAll('.stat-num').forEach(num => {
          if (num.dataset.counted) return;
          num.dataset.counted = '1';
          const target = parseInt(num.dataset.target);
          const start = performance.now();
          const dur = 1800;
          function countUp(now) {
            const t = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            num.textContent = Math.round(ease * target);
            if (t < 1) requestAnimationFrame(countUp);
          }
          requestAnimationFrame(countUp);
        });
      } else if (!inView) {
        statsEl.style.opacity = '0';
      }
    }

    // CTA final
    const ctaEl = document.querySelector('.cta-final');
    if (ctaEl) {
      const enter = parseFloat(ctaEl.dataset.enter);
      if (progress >= enter && ctaEl.style.opacity !== '1') {
        ctaEl.style.transition = 'opacity 1s ease';
        ctaEl.style.opacity = '1';
        ctaEl.style.pointerEvents = 'auto';
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  tick(); // run once on init
}

/* ── Start ─────────────────────────────────────────────────── */
loadAll();