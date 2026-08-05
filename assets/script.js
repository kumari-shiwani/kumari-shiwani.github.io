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
     WOOL YARN BALL — the signature apparel motif.
     Always anchored a fixed distance in front of the camera (so it's
     never scrolled out of view), with a single gold thread that
     visibly unrolls off it as you scroll down and rolls back on as
     you scroll up (via a growing/shrinking TubeGeometry drawRange).
     =============================================================== */
  const YARN_R = isTouch ? 1.15 : 2.3;
  const yarnAnchor = new THREE.Group();
  const ballSpin = new THREE.Group();
  yarnAnchor.add(ballSpin);

  const yarnCore = new THREE.Mesh(
    new THREE.SphereGeometry(YARN_R * 0.82, 28, 28),
    new THREE.MeshStandardMaterial({ color: 0x2c2115, roughness: 1 })
  );
  ballSpin.add(yarnCore);

  const woolColors = [0xf2e8d6, 0xe9d7ac, 0xf8f1e2, 0xd8b978, 0xede0c8, 0xf1e0c0];
  const STRAND_COUNT = 52;
  for (let i = 0; i < STRAND_COUNT; i++) {
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
    );
    const rad = YARN_R * (0.9 + Math.random() * 0.14);
    const pts = [];
    const n = 22;
    for (let j = 0; j < n; j++) {
      const t = (j / n) * Math.PI * 2;
      const v = new THREE.Vector3(Math.cos(t) * rad, Math.sin(t) * rad, (Math.random() - 0.5) * 0.5);
      v.applyQuaternion(q);
      pts.push(v);
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const geo = new THREE.TubeGeometry(curve, 50, 0.085 + Math.random() * 0.05, 6, true);
    const mat = new THREE.MeshStandardMaterial({
      color: woolColors[i % woolColors.length], roughness: 0.92, metalness: 0.02,
    });
    ballSpin.add(new THREE.Mesh(geo, mat));
  }

  const yarnLight = new THREE.PointLight(0xffe9c2, 1.3, 24);
  yarnLight.position.set(2, 2, 5);
  yarnAnchor.add(yarnLight);

  /* the unrolling thread — one long tube, revealed progressively via drawRange.
     Spirals outward from the ball's surface in a widening loop (rather than
     receding straight into depth, which perspective would foreshorten into
     nothing) so its growth reads clearly on screen as it "unrolls". */
  const threadPts = [];
  const THREAD_WAYPOINTS = 46;
  const SPIRAL_TURNS = 2.6;
  for (let i = 0; i <= THREAD_WAYPOINTS; i++) {
    const t = i / THREAD_WAYPOINTS;
    const angle = t * SPIRAL_TURNS * Math.PI * 2;
    const radius = YARN_R * (1.08 + t * 3.3);
    threadPts.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.68 - t * YARN_R * 0.96,
      Math.sin(angle * 1.3) * YARN_R * 0.6 - t * YARN_R * 1.5
    ));
  }
  const threadCurve = new THREE.CatmullRomCurve3(threadPts);
  const THREAD_TUBULAR_SEGMENTS = 260;
  const THREAD_RADIAL_SEGMENTS = 8;
  const threadGeo = new THREE.TubeGeometry(threadCurve, THREAD_TUBULAR_SEGMENTS, YARN_R * 0.065, THREAD_RADIAL_SEGMENTS, false);
  threadGeo.setDrawRange(0, 0);
  const threadMat = new THREE.MeshStandardMaterial({ color: 0xc2601f, roughness: 0.32, metalness: 0.55 });
  const threadMesh = new THREE.Mesh(threadGeo, threadMat);
  threadMesh.userData.totalSegments = THREAD_TUBULAR_SEGMENTS;
  threadMesh.userData.indicesPerSeg = THREAD_RADIAL_SEGMENTS * 6;
  yarnAnchor.add(threadMesh);

  scene.add(yarnAnchor);

  const yarnDesiredPos = new THREE.Vector3();
  const yarnForward = new THREE.Vector3();
  const yarnRight = new THREE.Vector3();
  const yarnUp = new THREE.Vector3();
  const YARN_REF_ASPECT = 1.6;
  function updateYarnBall() {
    // Horizontal FOV narrows on tall/portrait viewports, so a fixed
    // world-space side offset would push the ball off-screen on mobile —
    // scale it by the camera's aspect ratio to keep it in a similar
    // relative screen position at any viewport shape.
    const aspectScale = Math.min(1, camera.aspect / YARN_REF_ASPECT);
    const portrait = camera.aspect < 0.85;
    yarnForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    yarnRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
    yarnUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
    yarnDesiredPos.copy(camera.position)
      .addScaledVector(yarnForward, portrait ? 27 : 18.5)
      .addScaledVector(yarnRight, (portrait ? 3.6 : 6.6) * aspectScale)
      .addScaledVector(yarnUp, portrait ? -8.6 : -1.2);
    if (reducedMotion) yarnAnchor.position.copy(yarnDesiredPos);
    else yarnAnchor.position.lerp(yarnDesiredPos, 0.12);

    const revealSegs = Math.max(1, Math.round(scrollFrac * threadMesh.userData.totalSegments));
    threadGeo.setDrawRange(0, revealSegs * threadMesh.userData.indicesPerSeg);
  }

  /* ribbon particles — drifting fabric swatches */
  const isSmall = window.innerWidth < 720;
  const RIBBON_COUNT = isSmall ? 45 : 130;
  const palette = [0xc9a24a, 0xd97a5f, 0x8fb39a, 0xc48fce, 0xf3ecdf, 0x8a3324];
  const ribbons = [];
  const ribbonGeo = new THREE.PlaneGeometry(1.7, 0.42);
  for (let i = 0; i < RIBBON_COUNT; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      roughness: 0.55, metalness: 0.2,
      transparent: true, opacity: 0.8, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(ribbonGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 46,
      Z_START - Math.random() * (Z_START - Z_END + 20)
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData = {
      spin: (Math.random() - 0.5) * 0.006,
      bobSpeed: 0.3 + Math.random() * 0.5,
      bobPhase: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
    };
    scene.add(mesh);
    ribbons.push(mesh);
  }

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
    updateYarnBall();
  }

  function animate(time) {
    if (!running) { requestAnimationFrame(animate); return; }
    scrollFrac = updateProgress();
    updateCamera();
    lerpLightToTheme();

    ballSpin.rotation.y += 0.006;
    ballSpin.rotation.x += 0.0022;

    const t = time * 0.001;
    ribbons.forEach(r => {
      r.rotation.x += r.userData.spin;
      r.rotation.y += r.userData.spin * 1.4;
      r.position.y = r.userData.baseY + Math.sin(t * r.userData.bobSpeed + r.userData.bobPhase) * 1.2;
    });

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
