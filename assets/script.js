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
  let onSwatchChange = () => {}; // wired up later, once the 3D ribbon material exists
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
  renderer.localClippingEnabled = true;

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
     RIBBON — a length of satin unspooling gracefully through space,
     centred in view. As you scroll it draws further out from the
     spool in a loose flowing flourish, catching the light like real
     fabric; the ribbon's colour follows the swatch picker. Built from
     a hand-rolled ribbon strip (not an attempt at a realistic body),
     which is what keeps it reliably beautiful at every angle.
     =============================================================== */
  const RIBBON_SCALE = isTouch ? 0.9 : 1.5;
  const ribbonAnchor = new THREE.Group();
  const ribbonSpin = new THREE.Group();
  ribbonAnchor.add(ribbonSpin);

  // A loose, elegant flourish through 3D space — the ribbon's path.
  const ribbonWaypoints = [
    [0, 3.3, 0], [1.7, 2.1, 1.3], [2.6, 0.3, -0.7], [1.1, -1.3, 1.5],
    [-1.4, -2.1, -1.0], [-2.7, -0.1, 1.3], [-1.1, 1.9, -0.7], [0.6, 3.1, 0.9],
    [2.3, 1.3, -1.4], [2.0, -1.7, 0.5], [0.1, -3.3, -1.0],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const ribbonCurve = new THREE.CatmullRomCurve3(ribbonWaypoints);

  const RIBBON_SEGMENTS = 220, RIBBON_WIDTH = 0.95;
  function buildRibbonGeometry() {
    const pts = ribbonCurve.getPoints(RIBBON_SEGMENTS);
    const worldUp = new THREE.Vector3(0, 1, 0);
    const positions = [], uvs = [];
    for (let i = 0; i <= RIBBON_SEGMENTS; i++) {
      const p = pts[i];
      const tangent = ribbonCurve.getTangentAt(i / RIBBON_SEGMENTS).normalize();
      let right = new THREE.Vector3().crossVectors(tangent, worldUp);
      if (right.lengthSq() < 1e-5) right.set(1, 0, 0);
      right.normalize().multiplyScalar(RIBBON_WIDTH / 2);
      positions.push(p.x - right.x, p.y - right.y, p.z - right.z, p.x + right.x, p.y + right.y, p.z + right.z);
      const v = i / RIBBON_SEGMENTS;
      uvs.push(0, v, 1, v);
    }
    const indices = [];
    for (let i = 0; i < RIBBON_SEGMENTS; i++) {
      const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
      indices.push(a, c, b, b, c, d);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }
  const ribbonGeo = buildRibbonGeometry();
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xc9a24a, roughness: 0.32, metalness: 0.22, side: THREE.DoubleSide,
    transparent: true, opacity: 0.9,
  });
  const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbonMesh.userData.indicesPerSeg = 6;
  ribbonMesh.userData.totalSegments = RIBBON_SEGMENTS;
  ribbonGeo.setDrawRange(0, 6);
  ribbonSpin.add(ribbonMesh);

  // The spool it unwinds from — a clean, simple, reliably good-looking
  // object (a cylinder body with a few wound rings), anchoring the
  // ribbon's story without attempting anything anatomical.
  const spoolGroup = new THREE.Group();
  const spoolMat = new THREE.MeshStandardMaterial({ color: 0x2c2115, roughness: 0.85, metalness: 0.08 });
  const spoolBody = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.3, 24, 1, true), spoolMat);
  spoolBody.rotation.z = Math.PI / 2;
  spoolGroup.add(spoolBody);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.4, metalness: 0.35 });
  for (let i = -1; i <= 1; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.05, 10, 32), ringMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = i * 0.42;
    spoolGroup.add(ring);
  }
  spoolGroup.position.copy(ribbonWaypoints[0]).add(new THREE.Vector3(0, 0.15, 0));
  ribbonSpin.add(spoolGroup);

  const ribbonLight = new THREE.PointLight(0xffe9c2, 1.5, 32);
  ribbonLight.position.set(3, 4, 7);
  ribbonAnchor.add(ribbonLight);
  const ribbonRim = new THREE.PointLight(0xc9a24a, 0.9, 26);
  ribbonRim.position.set(-5, -2, -3);
  ribbonAnchor.add(ribbonRim);
  const ribbonFill = new THREE.PointLight(0xfff3e0, 0.55, 24);
  ribbonFill.position.set(0, -3, 8);
  ribbonAnchor.add(ribbonFill);

  ribbonSpin.scale.setScalar(RIBBON_SCALE);
  scene.add(ribbonAnchor);

  // Wire the swatch picker to the ribbon's colour.
  const swatchColorMap = { gold: 0xc9a24a, coral: 0xd97a5f, sage: 0x8fb39a, orchid: 0xc48fce };
  onSwatchChange = (name) => {
    const hex = swatchColorMap[name] || swatchColorMap.gold;
    ribbonMat.color.setHex(hex);
    ringMat.color.setHex(hex);
  };
  onSwatchChange(currentSwatchName);

  function updateRibbonReveal() {
    const revealSegs = Math.max(1, Math.round(scrollFrac * RIBBON_SEGMENTS));
    ribbonGeo.setDrawRange(0, revealSegs * ribbonMesh.userData.indicesPerSeg);
  }

  const ribbonDesiredPos = new THREE.Vector3();
  const ribbonForward = new THREE.Vector3();
  const ribbonUp = new THREE.Vector3();
  function updateHeroObject() {
    // Centred directly in front of the camera at all times.
    ribbonForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    ribbonUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
    ribbonDesiredPos.copy(camera.position)
      .addScaledVector(ribbonForward, 20)
      .addScaledVector(ribbonUp, -0.2);
    if (reducedMotion) ribbonAnchor.position.copy(ribbonDesiredPos);
    else ribbonAnchor.position.lerp(ribbonDesiredPos, 0.12);

    updateRibbonReveal();
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

    ribbonSpin.rotation.y += 0.0032;
    ribbonSpin.rotation.x = Math.sin(time * 0.00018) * 0.12;

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
