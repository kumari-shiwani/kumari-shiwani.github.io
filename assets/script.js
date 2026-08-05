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
  let onSwatchChange = () => {}; // wired up later, once the 3D dress material exists
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
     MANNEQUIN — a wireframe dress-form cage, centred in view, that
     fills in with a solid, beautiful dress from the neckline down as
     you scroll — by the bottom of the page it reads as fully dressed.
     The dress colour follows the swatch picker.
     =============================================================== */
  const DRESS_SCALE = isTouch ? 0.62 : 1.0;
  const dressAnchor = new THREE.Group();
  const dressSpin = new THREE.Group();
  dressAnchor.add(dressSpin);

  // Silhouette profile (radius, height) revolved around the Y axis —
  // neck -> shoulder/bust swell -> waist -> hip -> tapered base.
  const profilePts = [
    [0.42, 4.0], [0.55, 3.5], [0.95, 3.0], [1.15, 2.3], [0.98, 1.4],
    [0.78, 0.6], [0.80, 0.0], [1.05, -0.8], [1.12, -1.6], [0.95, -2.4],
    [0.55, -3.0], [0.05, -3.3],
  ];
  const profile = profilePts.map(([x, y]) => new THREE.Vector2(x, y));
  const BODY_TOP = profilePts[0][1], BODY_BOTTOM = profilePts[profilePts.length - 1][1];

  // Linear-interpolated body radius at an arbitrary height, so both the
  // wireframe cage and the dress fill hug the silhouette's true curve.
  function bodyRadiusAt(y) {
    for (let i = 0; i < profilePts.length - 1; i++) {
      const [xa, ya] = profilePts[i];
      const [xb, yb] = profilePts[i + 1];
      if (y <= ya && y >= yb) {
        const t = (ya - y) / (ya - yb || 1e-6);
        return xa + (xb - xa) * t;
      }
    }
    return profilePts[profilePts.length - 1][0];
  }

  // Wireframe "blueprint" cage: latitude rings + longitude meridians,
  // like a tailor's croquis — clean grid lines, not a dense triangle mesh.
  const wireGroup = new THREE.Group();
  const wireMat = new THREE.LineBasicMaterial({ color: 0xe4d9bd, transparent: true, opacity: 0.5 });
  const LAT_COUNT = 26, LAT_SEG = 56, LON_COUNT = 20;
  for (let i = 0; i < LAT_COUNT; i++) {
    const y = BODY_TOP - (i / (LAT_COUNT - 1)) * (BODY_TOP - BODY_BOTTOM);
    const r = bodyRadiusAt(y);
    const pts = [];
    for (let j = 0; j <= LAT_SEG; j++) {
      const a = (j / LAT_SEG) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    wireGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
  }
  for (let i = 0; i < LON_COUNT; i++) {
    const a = (i / LON_COUNT) * Math.PI * 2;
    const pts = profilePts.map(([x, y]) => new THREE.Vector3(Math.cos(a) * x, y, Math.sin(a) * x));
    wireGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
  }
  dressSpin.add(wireGroup);

  // Stand: a slim rod and a round foot, like a real dress form.
  const standMat = new THREE.MeshStandardMaterial({ color: 0x241c12, roughness: 0.45, metalness: 0.6 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.6, 12), standMat);
  rod.position.y = -4.1;
  dressSpin.add(rod);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.14, 28), standMat);
  foot.position.y = -4.95;
  dressSpin.add(foot);

  // The dress itself: a solid, smoothly-shaded surface sitting just
  // outside the wireframe, revealed by a horizontal clip plane that
  // sweeps downward as you scroll — so it looks like it's filling in.
  const fillPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const dressMat = new THREE.MeshStandardMaterial({
    color: 0xc9a24a, roughness: 0.42, metalness: 0.24, side: THREE.DoubleSide,
    clippingPlanes: [fillPlane],
  });
  const DRESS_TOP = 2.9, DRESS_BOTTOM = -2.6;
  const dressGeo = new THREE.LatheGeometry(profile, 56);
  dressGeo.scale(1.025, 1.025, 1.025);
  const dressMesh = new THREE.Mesh(dressGeo, dressMat);
  dressSpin.add(dressMesh);

  // A fine trim line that travels with the fill edge — the "leading
  // thread" of the hem currently being finished.
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xfff3d6, roughness: 0.3, metalness: 0.5 });
  const trim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.045, 10, 48), trimMat);
  trim.rotation.x = Math.PI / 2;
  dressSpin.add(trim);

  const dressLight = new THREE.PointLight(0xffe9c2, 1.5, 30);
  dressLight.position.set(3, 4, 7);
  dressAnchor.add(dressLight);
  const dressRim = new THREE.PointLight(0xc9a24a, 0.9, 24);
  dressRim.position.set(-5, -1, -3);
  dressAnchor.add(dressRim);
  const dressFill = new THREE.PointLight(0xfff3e0, 0.6, 24);
  dressFill.position.set(0, -2, 8);
  dressAnchor.add(dressFill);

  dressSpin.scale.setScalar(DRESS_SCALE);
  scene.add(dressAnchor);

  // Wire the swatch picker to the garment colour now that dressMat exists.
  const swatchColorMap = { gold: 0xc9a24a, coral: 0xd97a5f, sage: 0x8fb39a, orchid: 0xc48fce };
  onSwatchChange = (name) => {
    const hex = swatchColorMap[name] || swatchColorMap.gold;
    dressMat.color.setHex(hex);
    trimMat.color.setHex(hex).lerp(new THREE.Color(0xffffff), 0.35);
  };
  onSwatchChange(currentSwatchName);

  const fillPoint = new THREE.Vector3();
  const upVec = new THREE.Vector3(0, 1, 0);
  function updateDressReveal() {
    const threshold = DRESS_TOP - scrollFrac * (DRESS_TOP - DRESS_BOTTOM);
    const worldY = dressAnchor.position.y + threshold * DRESS_SCALE;
    fillPoint.set(dressAnchor.position.x, worldY, dressAnchor.position.z);
    fillPlane.setFromNormalAndCoplanarPoint(upVec, fillPoint);
    trim.position.set(dressAnchor.position.x, worldY, dressAnchor.position.z);
    const r = bodyRadiusAt(threshold) * 1.03 * DRESS_SCALE;
    trim.scale.set(r, r, 1);
    trim.visible = scrollFrac > 0.01 && scrollFrac < 0.999;
  }

  const dressDesiredPos = new THREE.Vector3();
  const dressForward = new THREE.Vector3();
  const dressUp = new THREE.Vector3();
  function updateHeroObject() {
    // Centred directly in front of the camera at all times.
    dressForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    dressUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
    dressDesiredPos.copy(camera.position)
      .addScaledVector(dressForward, 16.5)
      .addScaledVector(dressUp, -0.3);
    if (reducedMotion) dressAnchor.position.copy(dressDesiredPos);
    else dressAnchor.position.lerp(dressDesiredPos, 0.12);

    updateDressReveal();
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
