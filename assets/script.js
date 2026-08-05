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
  function applySwatch(name) {
    if (name) document.documentElement.setAttribute('data-swatch', name);
    else document.documentElement.removeAttribute('data-swatch');
    swatches.forEach(s => s.classList.toggle('active', s.dataset.themeColor === name));
    try { localStorage.setItem('sk-swatch', name || ''); } catch (e) {}
  }
  swatches.forEach(s => s.addEventListener('click', () => applySwatch(s.dataset.themeColor)));
  try {
    const saved = localStorage.getItem('sk-swatch');
    if (saved) applySwatch(saved);
  } catch (e) {}

  /* ---------------- PRINT RESUME ---------------- */
  const printBtn = document.getElementById('printResume');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

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

  /* ================================================================
     3D SCENIC BACKGROUND (Three.js)
     ================================================================ */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const THEME_COLORS = {
    hero:         0xc9a24a,
    about:        0xd97a5f,
    brands:       0x8fb39a,
    competencies: 0xc48fce,
    skills:       0xc9a24a,
    experience:   0xd97a5f,
    contact:      0x8fb39a,
  };
  const sectionOrder = ['hero', 'about', 'brands', 'competencies', 'skills', 'experience', 'contact'];

  const scene = new THREE.Scene();
  const bgColor = new THREE.Color(0x0b0a08);
  scene.fog = new THREE.FogExp2(bgColor.getHex(), 0.028);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  const Z_START = 26, Z_END = -80;
  camera.position.set(0, 0, Z_START);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

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
     DRESS FORM — a clean, single, realistic apparel-design centerpiece.
     A tailor's mannequin torso (lathe-revolved silhouette) on a stand,
     wrapped in a fine gold technical pattern-grid with pinned "pattern
     dots", plus a slim tape-measure sash at the waist. One well-lit,
     ordered object reads as "designer's studio" — not a debris field.
     Always anchored a fixed distance in front of the camera so it's
     never scrolled out of view.
     =============================================================== */
  const DRESS_SCALE = isTouch ? 0.36 : 0.62;
  const dressAnchor = new THREE.Group();
  const dressSpin = new THREE.Group();
  dressAnchor.add(dressSpin);

  // Silhouette profile (radius, height) revolved around the Y axis —
  // neck -> shoulder/bust swell -> waist -> hip -> tapered base.
  const profile = [
    [0.42, 4.0], [0.55, 3.5], [0.95, 3.0], [1.15, 2.3], [0.98, 1.4],
    [0.78, 0.6], [0.80, 0.0], [1.05, -0.8], [1.12, -1.6], [0.95, -2.4],
    [0.55, -3.0], [0.05, -3.3],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  const torsoGeo = new THREE.LatheGeometry(profile, 40);
  const torso = new THREE.Mesh(
    torsoGeo,
    new THREE.MeshStandardMaterial({ color: 0xe9ddc6, roughness: 0.62, metalness: 0.04, side: THREE.DoubleSide })
  );
  dressSpin.add(torso);

  // Fine technical pattern-grid, sitting just outside the torso surface.
  const gridGeo = new THREE.LatheGeometry(profile, 40);
  gridGeo.scale(1.015, 1.015, 1.015);
  const grid = new THREE.Mesh(
    gridGeo,
    new THREE.MeshBasicMaterial({ color: 0xc9a24a, wireframe: true, transparent: true, opacity: 0.4 })
  );
  dressSpin.add(grid);

  // Pinned "pattern dots" at the grid's vertices, glowing softly.
  const pins = new THREE.Points(
    gridGeo,
    new THREE.PointsMaterial({ color: 0xffe9c2, size: 0.07, sizeAttenuation: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  dressSpin.add(pins);

  // Stand: a slim rod and a round foot, like a real dress form.
  const standMat = new THREE.MeshStandardMaterial({ color: 0x241c12, roughness: 0.45, metalness: 0.6 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.6, 12), standMat);
  rod.position.y = -4.1;
  dressSpin.add(rod);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.14, 28), standMat);
  foot.position.y = -4.95;
  dressSpin.add(foot);

  // Tape-measure sash at the waist.
  const sash = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.045, 10, 48),
    new THREE.MeshStandardMaterial({ color: 0xc2601f, roughness: 0.35, metalness: 0.5 })
  );
  sash.rotation.x = Math.PI / 2;
  sash.position.y = 0.6;
  dressSpin.add(sash);

  const dressLight = new THREE.PointLight(0xffe9c2, 1.4, 26);
  dressLight.position.set(3, 3, 6);
  dressAnchor.add(dressLight);
  const dressRim = new THREE.PointLight(0xc9a24a, 0.8, 20);
  dressRim.position.set(-4, -1, -3);
  dressAnchor.add(dressRim);

  dressSpin.scale.setScalar(DRESS_SCALE);
  scene.add(dressAnchor);

  const dressDesiredPos = new THREE.Vector3();
  const dressForward = new THREE.Vector3();
  const dressRight = new THREE.Vector3();
  const dressUp = new THREE.Vector3();
  const DRESS_REF_ASPECT = 1.6;
  function updateHeroObject() {
    // Horizontal FOV narrows on tall/portrait viewports, so a fixed
    // world-space side offset would push the object off-screen on mobile —
    // scale it by the camera's aspect ratio to keep a similar relative
    // screen position at any viewport shape.
    const aspectScale = Math.min(1, camera.aspect / DRESS_REF_ASPECT);
    const portrait = camera.aspect < 0.85;
    dressForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    dressRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
    dressUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
    dressDesiredPos.copy(camera.position)
      .addScaledVector(dressForward, portrait ? 15 : 15.5)
      .addScaledVector(dressRight, (portrait ? 2.6 : 5.4) * aspectScale)
      .addScaledVector(dressUp, portrait ? -3.4 : -0.4);
    if (reducedMotion) dressAnchor.position.copy(dressDesiredPos);
    else dressAnchor.position.lerp(dressDesiredPos, 0.12);
  }

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

    dressSpin.rotation.y += 0.0032;

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
