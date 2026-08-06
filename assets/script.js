(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ---------------- YEAR ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- LOADER ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 700);
    }, 550);
  });

  /* ---------------- NAV ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.classList.toggle('is-open', open);
  });
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------------- SCROLL PROGRESS ---------------- */
  const progressFill = document.getElementById('progressFill');
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const max = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    const pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
    if (progressFill) progressFill.style.height = pct + '%';
    return pct / 100;
  }

  /* ---------------- CUSTOM CURSOR ---------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
    });
    document.querySelectorAll('a, button, .tilt-card, .swatch').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing && cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing && cursorRing.classList.remove('active'));
    });
    (function ringLoop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
      requestAnimationFrame(ringLoop);
    })();
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- TILT CARDS ---------------- */
  if (!isTouch) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------------- MAGNETIC BUTTONS ---------------- */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------------- SWATCH PALETTE PICKER ---------------- */
  const swatches = document.querySelectorAll('.swatch');
  let currentSwatchName = 'gold';
  let onSwatchChange = () => {}; // wired up later, once the 3D gallery frame material exists
  function applySwatch(name) {
    if (name) document.documentElement.setAttribute('data-swatch', name);
    else document.documentElement.removeAttribute('data-swatch');
    swatches.forEach(s => s.classList.toggle('active', s.dataset.themeColor === name));
    try { localStorage.setItem('sk-swatch', name || ''); } catch (e) {}
    currentSwatchName = name || 'gold';
    onSwatchChange(currentSwatchName);
  }
  swatches.forEach(s => s.addEventListener('click', () => applySwatch(s.dataset.themeColor)));
  try {
    const saved = localStorage.getItem('sk-swatch');
    if (saved) applySwatch(saved);
  } catch (e) {}

  /* ---------------- CONFETTI ---------------- */
  const confettiColors = ['#c9a24a', '#d97a5f', '#8fb39a', '#c48fce', '#f3ecdf'];
  function spawnConfetti(x, y, count = 16) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'confetto';
      const size = 5 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 90;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.width = size + 'px';
      el.style.height = (size * 0.5) + 'px';
      el.style.background = confettiColors[i % confettiColors.length];
      el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
      el.style.setProperty('--rot', `${(Math.random() * 720 - 360).toFixed(0)}deg`);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => spawnConfetti(e.clientX, e.clientY));
  });

  /* ---------------- PORTFOLIO GALLERY + LIGHTBOX ---------------- */
  const PORTFOLIO_CATS = {
    kidswear:   [2, 24],
    sportswear: [25, 47],
    loungewear: [48, 60],
    fcuk:       [61, 64],
  };
  function pad2(n) { return String(n).padStart(2, '0'); }
  function portfolioThumb(n) { return `assets/portfolio/thumb/page-${pad2(n)}.jpg`; }
  function portfolioFull(n) { return `assets/portfolio/full/page-${pad2(n)}.jpg`; }

  const portfolioGrid = document.getElementById('portfolioGrid');
  const portfolioTabs = document.querySelectorAll('.portfolio-tab');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCount = document.getElementById('lightboxCount');
  let portfolioList = [];
  let lightboxIndex = 0;

  function renderPortfolioGrid(cat) {
    if (!portfolioGrid) return;
    const [start, end] = PORTFOLIO_CATS[cat] || PORTFOLIO_CATS.kidswear;
    portfolioList = [];
    portfolioGrid.innerHTML = '';
    for (let n = start; n <= end; n++) {
      const idx = portfolioList.length;
      portfolioList.push(n);
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      img.src = portfolioThumb(n);
      img.loading = 'lazy';
      img.alt = `Portfolio page ${n}`;
      fig.appendChild(img);
      fig.addEventListener('click', () => openLightbox(idx));
      portfolioGrid.appendChild(fig);
    }
  }

  function openLightbox(idx) {
    lightboxIndex = idx;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  function updateLightbox() {
    const pageNum = portfolioList[lightboxIndex];
    lightboxImg.src = portfolioFull(pageNum);
    lightboxImg.alt = `Portfolio page ${pageNum}`;
    if (lightboxCount) lightboxCount.textContent = `${lightboxIndex + 1} / ${portfolioList.length}`;
  }
  function stepLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + portfolioList.length) % portfolioList.length;
    updateLightbox();
  }

  portfolioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      portfolioTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderPortfolioGrid(tab.dataset.cat);
    });
  });

  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => stepLightbox(1));
  if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  renderPortfolioGrid('kidswear');

  /* ================================================================
     3D SCENIC BACKGROUND (Three.js)
     ================================================================ */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const THEME_COLORS = {
    hero:         0xc9a24a,
    about:        0xd97a5f,
    portfolio:    0xc48fce,
    brands:       0x8fb39a,
    competencies: 0xc48fce,
    skills:       0xc9a24a,
    experience:   0xd97a5f,
    contact:      0x8fb39a,
  };

  const scene = new THREE.Scene();
  const bgColor = new THREE.Color(0x0b0a08);
  scene.fog = new THREE.FogExp2(bgColor.getHex(), 0.028);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  const Z_START = 26, Z_END = -80;
  camera.position.set(0, 0, Z_START);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

  /* lights */
  const ambient = new THREE.AmbientLight(0x2b2114, 0.9);
  scene.add(ambient);
  const light1 = new THREE.PointLight(THEME_COLORS.hero, 1.4, 120);
  light1.position.set(14, 12, 14);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xd97a5f, 0.9, 140);
  light2.position.set(-18, -8, -20);
  scene.add(light2);

  /* ===============================================================
     GALLERY RING — a rotating 3D carousel of real pages from the
     portfolio, textured onto framed panels. Centred in view. Because
     the "3D objects" are actual photographs of real design work, it
     reads as genuinely realistic at every angle — no risk of looking
     like an abstract shape gone wrong. Spins continuously, and each
     scroll adds a bit more spin, tying the motion to the page.
     =============================================================== */
  const GALLERY_PAGES = [1, 4, 9, 19, 26, 34, 39, 48, 50, 57, 61];
  const GALLERY_SCALE = isTouch ? 0.62 : 0.98;
  const galleryAnchor = new THREE.Group();
  const gallerySpin = new THREE.Group();
  galleryAnchor.add(gallerySpin);

  const GALLERY_RADIUS = 5.6;
  const GALLERY_PANEL_W = 4.2;
  const GALLERY_PANEL_H = GALLERY_PANEL_W * (595 / 1683);
  const galleryPanelGeo = new THREE.PlaneGeometry(GALLERY_PANEL_W, GALLERY_PANEL_H);
  const galleryFrameGeo = new THREE.PlaneGeometry(GALLERY_PANEL_W + 0.16, GALLERY_PANEL_H + 0.16);
  const galleryFrameMat = new THREE.MeshBasicMaterial({ color: 0xc9a24a });
  const textureLoader = new THREE.TextureLoader();

  GALLERY_PAGES.forEach((pageNum, i) => {
    const angle = (i / GALLERY_PAGES.length) * Math.PI * 2;
    const x = Math.sin(angle) * GALLERY_RADIUS;
    const z = Math.cos(angle) * GALLERY_RADIUS;
    const y = Math.sin(angle * 2.3) * 0.4;

    const frame = new THREE.Mesh(galleryFrameGeo, galleryFrameMat);
    frame.position.set(x, y, z);
    frame.rotation.y = angle;
    frame.position.addScaledVector(new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle)), -0.03);
    gallerySpin.add(frame);

    // Fall back to a solid cream card (instead of going invisible/black)
    // if the texture can't load — e.g. the page opened directly as a
    // file:// URL, where browsers block WebGL from reading local images.
    const panelMat = new THREE.MeshBasicMaterial({ color: 0xf2e8d6 });
    const panel = new THREE.Mesh(galleryPanelGeo, panelMat);
    panel.position.set(x, y, z);
    panel.rotation.y = angle;
    gallerySpin.add(panel);

    textureLoader.load(
      portfolioThumb(pageNum),
      (tex) => {
        if ('encoding' in tex) tex.encoding = THREE.sRGBEncoding;
        panelMat.map = tex;
        panelMat.color.set(0xffffff);
        panelMat.needsUpdate = true;
      },
      undefined,
      () => { /* keep the cream fallback card on error */ }
    );
  });

  gallerySpin.scale.setScalar(GALLERY_SCALE);
  scene.add(galleryAnchor);

  // The swatch picker tints the frames — a nod to "picking a swatch"
  // for the whole gallery's accent, without needing a dress to dye.
  const swatchColorMap = { gold: 0xc9a24a, coral: 0xd97a5f, sage: 0x8fb39a, orchid: 0xc48fce };
  onSwatchChange = (name) => {
    galleryFrameMat.color.setHex(swatchColorMap[name] || swatchColorMap.gold);
  };
  onSwatchChange(currentSwatchName);

  const galleryDesiredPos = new THREE.Vector3();
  const galleryForward = new THREE.Vector3();
  const galleryUp = new THREE.Vector3();
  function updateHeroObject() {
    // Centred directly in front of the camera at all times. Portrait
    // viewports stack the hero text much taller (more line-wrapping),
    // so the carousel needs to sit further down to clear the buttons.
    const portrait = camera.aspect < 0.85;
    galleryForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    galleryUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
    galleryDesiredPos.copy(camera.position)
      .addScaledVector(galleryForward, portrait ? 27 : 23)
      .addScaledVector(galleryUp, portrait ? -7.6 : -4.9);
    if (reducedMotion) galleryAnchor.position.copy(galleryDesiredPos);
    else galleryAnchor.position.lerp(galleryDesiredPos, 0.12);

    gallerySpin.rotation.y = scrollFrac * Math.PI * 2.4 + galleryIdleSpin;

    // A hero-only flourish: there's a full gallery with a lightbox just
    // below, so rather than have real portfolio pages float over every
    // section's text for the whole scroll, fade this carousel out once
    // you've scrolled past the hero. Based on raw pixels scrolled (not
    // scroll fraction) so it fades at the same point on any page length —
    // a fraction-based threshold would barely move on a long mobile page.
    const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
    const fadeStartPx = 60, fadeEndPx = 420;
    let heroFade = 1 - (scrollPx - fadeStartPx) / (fadeEndPx - fadeStartPx);
    heroFade = Math.max(0, Math.min(1, heroFade));
    galleryAnchor.visible = heroFade > 0.01;
    gallerySpin.scale.setScalar(GALLERY_SCALE * (0.4 + heroFade * 0.6));
  }
  let galleryIdleSpin = 0;

  /* sparse starfield — faint ambient depth, not a debris field */
  const STAR_COUNT = isTouch ? 220 : 420;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 90;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    starPositions[i * 3 + 2] = Z_START - Math.random() * (Z_START - Z_END + 30);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xf3ecdf, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.55 })
  );
  scene.add(stars);

  /* ---------------- section theme tracking ---------------- */
  let currentTheme = 'hero';
  const sectionEls = document.querySelectorAll('.scene-section');
  if ('IntersectionObserver' in window) {
    const themeIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          currentTheme = entry.target.dataset.theme || currentTheme;
        }
      });
    }, { threshold: [0.4] });
    sectionEls.forEach(el => themeIO.observe(el));
  }

  /* ---------------- mouse parallax ---------------- */
  let targetPX = 0, targetPY = 0, parX = 0, parY = 0;
  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      targetPX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  /* ---------------- resize ---------------- */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  /* ---------------- render loop ---------------- */
  const tmpColor = new THREE.Color();
  let scrollFrac = 0;
  let running = true;

  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  function lerpLightToTheme() {
    const target = THEME_COLORS[currentTheme] || THEME_COLORS.hero;
    tmpColor.set(target);
    light1.color.lerp(tmpColor, 0.02);
  }

  function updateCamera() {
    const z = Z_START + scrollFrac * (Z_END - Z_START);
    parX += (targetPX - parX) * 0.04;
    parY += (targetPY - parY) * 0.04;
    camera.position.z = z;
    camera.position.x = Math.sin(scrollFrac * Math.PI * 2.4) * 3 + parX * 2.2;
    camera.position.y = Math.cos(scrollFrac * Math.PI * 1.6) * 1.4 - parY * 1.4;
    camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, camera.position.z - 30);
    updateHeroObject();
  }

  function animate(time) {
    if (!running) { requestAnimationFrame(animate); return; }
    scrollFrac = updateProgress();
    updateCamera();
    lerpLightToTheme();

    galleryIdleSpin += 0.0025;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  onResize();
  if (reducedMotion) {
    scrollFrac = updateProgress();
    updateCamera();
    renderer.render(scene, camera);
    window.addEventListener('scroll', () => {
      scrollFrac = updateProgress();
      updateCamera();
      renderer.render(scene, camera);
    }, { passive: true });
  } else {
    window.addEventListener('scroll', updateProgress, { passive: true });
    requestAnimationFrame(animate);
  }
})();
