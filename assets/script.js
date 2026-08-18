(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      titles: ["Loungewear Chapter", "Mood Direction", "Silhouette Exploration", "Range Board", "Specification Sheet", "Garment View", "Colour Story", "Final Product"],
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

  /* ---------- Mobile nav ---------- */

  const nav = document.getElementById("nav");
  const menuButton = document.getElementById("menuButton");
  const navHome = nav?.parentElement;
  const navAnchor = nav?.nextElementSibling;

  function openMenu() {
    if (!nav) return;
    // #nav's normal parent has backdrop-filter, which makes it the containing
    // block for position:fixed descendants — reparent to <body> so the
    // mobile overlay actually covers the viewport instead of the glass pill.
    document.body.appendChild(nav);
    nav.classList.add("open");
    menuButton?.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
      if (!nav.classList.contains("open") && navHome) {
        navHome.insertBefore(nav, navAnchor || null);
      }
    }, 300);
  }

  menuButton?.addEventListener("click", () => {
    if (nav?.classList.contains("open")) closeMenu();
    else openMenu();
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Reveal on scroll ---------- */

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

  /* ---------- Hero backdrop crossfade ---------- */
  /* Ambient, heavily blurred crossfade between portfolio boards, standing in for a hero video loop. */

  const heroImgs = Array.from(document.querySelectorAll(".hero-bg-img"));
  if (heroImgs.length) {
    heroImgs.forEach((img) => { img.src = img.dataset.src; });

    if (reducedMotion) {
      heroImgs[0].classList.add("active");
    } else {
      let heroIndex = 0;
      heroImgs[0].classList.add("active");

      const HOLD_MS = 6500;
      const FADE_MS = 1400;

      function fade(el, from, to, duration, onDone) {
        const start = performance.now();
        function step(now) {
          const t = Math.min((now - start) / duration, 1);
          el.style.opacity = String(from + (to - from) * t);
          if (t < 1) requestAnimationFrame(step);
          else onDone?.();
        }
        requestAnimationFrame(step);
      }

      function cycle() {
        const current = heroImgs[heroIndex];
        const nextIndex = (heroIndex + 1) % heroImgs.length;
        const next = heroImgs[nextIndex];
        next.style.opacity = "0";
        next.classList.add("active");
        fade(next, 0, 0.55, FADE_MS);
        fade(current, 0.55, 0, FADE_MS, () => {
          current.classList.remove("active");
        });
        heroIndex = nextIndex;
        setTimeout(cycle, HOLD_MS);
      }

      setTimeout(cycle, HOLD_MS);
    }
  }

  /* ---------- Portfolio showcase ---------- */

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
        { opacity: 0.4, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 320, easing: "cubic-bezier(.2,.75,.25,1)" });
    }
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
})();
