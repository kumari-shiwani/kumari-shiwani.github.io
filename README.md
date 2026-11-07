# Shiwani Kumari — Portfolio

**The Red Thread.** Eleven collections hung as cloth on one red line in WebGL. Scroll through an intro act on how a collection is made (Pantone chips that assemble into a tee and get stitched by a needle), then walk the line; the air tints to each collection's palette. Press `I` (or the Index button) to pull every board into a 360° archive, and click any board for a zoomable full-resolution view.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows`.

## Where things live

- `src/lib/data.ts` holds all copy: contact details, the 11 collections (page ranges and descriptions), per-board titles and CV content.
- `src/three/` holds the 3D scene: `layout.ts` (where boards sit on the thread, mapping scroll to position), `clothShader.ts` (fabric motion and lighting), `Engine.ts` (scene, camera, archive mode, texture streaming, collection tints) and `Intro.ts` (the Pantone chip / tee / needle act).
- `assets/portfolio/{thumb,tex,full}/pNN.jpg` contains each board at 640px, 1600px and 3200px wide, generated from the 7016px source PNGs.

To add or reorder boards, drop new images into the three folders and update `chapters` and `titles` in `data.ts`.
