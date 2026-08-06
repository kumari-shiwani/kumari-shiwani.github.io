(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const thumb = (n) => `assets/portfolio/thumb/page-${pad(n)}.jpg`;
  const full = (n) => `assets/portfolio/full/page-${pad(n)}.jpg`;

  const cases = {
    kidswear: {
      label: "Kidswear",
      pages: [4, 5, 6, 8, 9, 10, 12, 15, 19, 22],
      titles: ["Brand Board", "Forecast Board", "Theme Board", "Inspiration Board", "Palette", "Fabric Direction", "Single Jersey Spinel", "Rib Smithsonite", "Range Development", "Technical Detail"],
      copy: "Toddler sleep-and-play concepts with soft jersey, heirloom knitwear cues, applique storytelling, and practical dressing details."
    },
    sportswear: {
      label: "Sportswear",
      pages: [25, 26, 29, 34, 35, 39, 41, 45],
      titles: ["Problem Definition", "Training Range", "Persona Values", "Puma Direction", "Brand Prism", "Client Board", "Cozy Mood", "Product Range"],
      copy: "Performance-led training concepts for cycling comfort, sweat management, movement restriction, and feminine activewear styling."
    },
    loungewear: {
      label: "Loungewear",
      pages: [48, 49, 50, 51, 52, 56, 57, 58],
      titles: ["Loungewear Chapter", "Mood Direction", "Silhouette Exploration", "Range Board", "Specification Sheet", "Garment View", "Color Story", "Final Product"],
      copy: "Relaxed lifestyle product with comfort, softness, technical specification, and retail-ready presentation."
    },
    graphics: {
      label: "FCUK Graphics",
      pages: [61, 62, 63, 64],
      titles: ["Graphics Chapter", "T-Shirt Graphics", "Artwork Variants", "Final Graphic Range"],
      copy: "Graphic T-shirt artwork explorations prepared as clean, commercial apparel placements."
    }
  };

  let activeCase = "kidswear";
  let activeIndex = 0;
  let updateSceneTexture = () => {};

  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader?.classList.add("done");
      setTimeout(() => loader?.remove(), 550);
    }, 450);
  });

  const nav = document.getElementById("nav");
  const menuButton = document.getElementById("menuButton");
  menuButton?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const cursor = document.querySelector(".cursor");
  if (cursor && !isTouch) {
    window.addEventListener("mousemove", (event) => {
      cursor.style.opacity = "1";
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll("a, button, .board-frame, .glass-card").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  const boardImage = document.getElementById("boardImage");
  const boardFrame = document.getElementById("boardFrame");
  const caseLabel = document.getElementById("caseLabel");
  const boardTitle = document.getElementById("boardTitle");
  const caseCopy = document.getElementById("caseCopy");
  const miniGrid = document.getElementById("miniGrid");
  const tabs = document.querySelectorAll(".case-tab");

  function currentData() {
    return cases[activeCase];
  }

  function renderMiniGrid() {
    const data = currentData();
    miniGrid.innerHTML = "";
    data.pages.forEach((page, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = index === activeIndex ? "active" : "";
      button.setAttribute("aria-label", `${data.label} board ${index + 1}`);

      const img = document.createElement("img");
      img.src = thumb(page);
      img.alt = "";
      img.loading = "lazy";
      button.appendChild(img);

      button.addEventListener("click", () => {
        activeIndex = index;
        updateBoard();
      });

      miniGrid.appendChild(button);
    });
  }

  function updateBoard() {
    const data = currentData();
    const page = data.pages[activeIndex];
    boardImage.src = full(page);
    boardImage.alt = `${data.label} portfolio board: ${data.titles[activeIndex] || `Page ${page}`}`;
    caseLabel.textContent = data.label;
    boardTitle.textContent = data.titles[activeIndex] || `Portfolio page ${page}`;
    caseCopy.textContent = data.copy;
    [...miniGrid.children].forEach((child, index) => child.classList.toggle("active", index === activeIndex));
    if (boardFrame && !reducedMotion) {
      boardFrame.animate([
        { transform: "rotateX(11deg) rotateY(-18deg) translateY(8px)", opacity: 0.45 },
        { transform: "rotateX(8deg) rotateY(-13deg) translateY(0)", opacity: 1 }
      ], { duration: 360, easing: "cubic-bezier(.2,.75,.25,1)" });
    }
    updateSceneTexture(page);
  }

  function stepBoard(direction) {
    const data = currentData();
    activeIndex = (activeIndex + direction + data.pages.length) % data.pages.length;
    updateBoard();
  }

  document.getElementById("prevBoard")?.addEventListener("click", () => stepBoard(-1));
  document.getElementById("nextBoard")?.addEventListener("click", () => stepBoard(1));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCase = tab.dataset.case;
      activeIndex = 0;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      renderMiniGrid();
      updateBoard();
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");

  function openLightbox() {
    const data = currentData();
    const page = data.pages[activeIndex];
    lightboxImage.src = full(page);
    lightboxImage.alt = `${data.label} full portfolio board`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  }

  document.getElementById("openBoard")?.addEventListener("click", openLightbox);
  boardFrame?.addEventListener("click", openLightbox);
  document.getElementById("closeLightbox")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev")?.addEventListener("click", () => {
    stepBoard(-1);
    openLightbox();
  });
  document.getElementById("lightboxNext")?.addEventListener("click", () => {
    stepBoard(1);
    openLightbox();
  });
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") stepBoard(-1);
    if (event.key === "ArrowRight") stepBoard(1);
    if (event.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox();
  });

  renderMiniGrid();
  updateBoard();

  const canvas = document.getElementById("stage");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x090b0b, 0.035);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xd0a85a, 2.1, 80);
  keyLight.position.set(8, 10, 8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x78b9c8, 1.6, 80);
  rimLight.position.set(-12, -4, -6);
  scene.add(rimLight);

  const showroom = new THREE.Group();
  scene.add(showroom);

  const loaderTex = new THREE.TextureLoader();
  const featuredMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.42,
    metalness: 0.04
  });
  const featured = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.55, 0.12), featuredMaterial);
  featured.position.set(3.8, 0.15, -3);
  featured.rotation.set(-0.08, -0.42, 0.02);
  showroom.add(featured);

  const backMaterial = new THREE.MeshStandardMaterial({
    color: 0x201a14,
    roughness: 0.28,
    metalness: 0.7,
    emissive: 0x160e06,
    emissiveIntensity: 0.18
  });
  const backPlate = new THREE.Mesh(new THREE.BoxGeometry(7.55, 2.9, 0.08), backMaterial);
  backPlate.position.copy(featured.position);
  backPlate.position.z -= 0.11;
  backPlate.rotation.copy(featured.rotation);
  showroom.add(backPlate);

  const pagesForOrbit = [4, 9, 19, 25, 34, 39, 48, 52, 57, 61, 63];
  const orbit = new THREE.Group();
  showroom.add(orbit);

  pagesForOrbit.forEach((page, index) => {
    const angle = (index / pagesForOrbit.length) * Math.PI * 2;
    const radius = 7.2;
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.58,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    loaderTex.load(thumb(page), (texture) => {
      if ("encoding" in texture) texture.encoding = THREE.sRGBEncoding;
      mat.map = texture;
      mat.needsUpdate = true;
    });
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.96), mat);
    panel.position.set(Math.cos(angle) * radius - 1.8, Math.sin(angle * 1.7) * 1.25, Math.sin(angle) * radius - 8);
    panel.rotation.y = -angle + Math.PI / 2;
    panel.rotation.z = Math.sin(angle) * 0.08;
    orbit.add(panel);
  });

  const threadMaterial = new THREE.MeshStandardMaterial({
    color: 0xd0a85a,
    roughness: 0.38,
    metalness: 0.35
  });
  const threadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-12, -4, -12),
    new THREE.Vector3(-7, 2.8, -9),
    new THREE.Vector3(-2, -1.2, -7),
    new THREE.Vector3(4, 2.5, -10),
    new THREE.Vector3(10, -2.5, -14)
  ]);
  const thread = new THREE.Mesh(new THREE.TubeGeometry(threadCurve, 120, 0.025, 8, false), threadMaterial);
  scene.add(thread);

  const particleCount = isTouch ? 110 : 220;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 42;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 2] = -Math.random() * 42;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({ color: 0xefe4d3, size: 0.055, transparent: true, opacity: 0.58 })
  );
  scene.add(particles);

  updateSceneTexture = (page) => {
    loaderTex.load(full(page), (texture) => {
      if ("encoding" in texture) texture.encoding = THREE.sRGBEncoding;
      featuredMaterial.map = texture;
      featuredMaterial.needsUpdate = true;
    });
  };
  updateSceneTexture(currentData().pages[activeIndex]);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const narrow = window.innerWidth < 720;
    showroom.scale.setScalar(narrow ? 0.56 : 0.82);
    showroom.position.set(narrow ? 3.1 : 2.7, narrow ? -3.35 : -1.45, narrow ? -2.5 : 0);
    orbit.position.set(narrow ? 3.1 : 3.8, narrow ? -0.15 : -0.25, 0);
    thread.position.set(narrow ? 2.5 : 3.2, narrow ? -1.65 : -0.95, 0);
  }
  window.addEventListener("resize", resize);

  function scrollRatio() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    return max > 0 ? doc.scrollTop / max : 0;
  }

  function animate(time) {
    const t = time * 0.001;
    const ratio = scrollRatio();
    camera.position.z = 18 - ratio * 20;
    camera.position.x += ((mouseX * 2.8) - camera.position.x) * 0.035;
    camera.position.y += ((-mouseY * 1.7) - camera.position.y) * 0.035;
    camera.lookAt(0, 0, -6 - ratio * 12);

    showroom.rotation.y = Math.sin(t * 0.35) * 0.08 + ratio * 0.55;
    showroom.rotation.x = Math.sin(t * 0.28) * 0.035;
    orbit.rotation.y = t * 0.12 + ratio * Math.PI * 1.8;
    thread.rotation.z = Math.sin(t * 0.24) * 0.08;
    particles.rotation.y = t * 0.025;
    keyLight.intensity = 1.7 + Math.sin(t * 0.8) * 0.25;

    renderer.render(scene, camera);
    if (!reducedMotion) requestAnimationFrame(animate);
  }

  resize();
  if (reducedMotion) {
    renderer.render(scene, camera);
    window.addEventListener("scroll", () => renderer.render(scene, camera), { passive: true });
  } else {
    requestAnimationFrame(animate);
  }
})();
