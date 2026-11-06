# Villa Serein — architecture, revealed

A single-page architectural experience built with Three.js, GSAP ScrollTrigger and Lenis.
The procedural villa separates vertically into five independently modeled layers:
roof/pergola, private suites, terrace/ceiling slab, living/kitchen, and foundation/pool landscape.
The final section reassembles the building with a short damped settling motion.

## Run

```sh
npm ci
npm run dev
npm run build
npm run standalone
```

`npm run standalone` creates `artifacts/villa-serein.html` with embedded scripts, styling and fonts.
`dist/` is the deployable website. Use a web server for source/build previews.

## Browser checks

```sh
npx vite preview --port 4173
PREVIEW_URL=http://localhost:4173 npm run qa
```

Chromium defaults to `/usr/bin/chromium`; set `BROWSER_BIN` for a different executable.
Checks cover section navigation, layer separation, reassembly, ambient-motion pause,
quality toggle, mobile layout and the reduced-motion fallback. Mobile tests use emulation.

## Rendering

- PBR materials with generated travertine and teak texture maps.
- A procedural floating-point twilight HDR environment, prefiltered with PMREM.
- Pool water uses the Three.js Water planar-reflection shader and generated wave normals.
- Merged geometry reduces draw calls; one light casts shadows.
- Desktop cinematic mode includes BokehPass depth of field; Performance switches to direct rendering.
- Adaptive quality disables post-processing and lowers pixel ratio on slow devices. 60fps is a target,
  not a guarantee across all devices or software renderers.
- Mobile starts in Performance mode, uses smaller reflection targets and a simplified camera path.
- Reduced motion keeps the villa assembled, the camera static and the water frozen, without depth of field.
- The motion button pauses ambient animation while keeping deliberate scroll navigation available.

The residence, floor areas and studio identity are illustrative concept content, not a property listing
or construction specification. The model is created directly in Three.js; the earlier Blender fixture
is retained as an independent cloud-pipeline test (`npm run model`, `npm run verify`).

## Source map

- `web/villa.js`: architecture, furniture, textures, water and HDR environment.
- `web/main.js`: camera choreography, layer transforms, scrolling and accessibility.
- `web/style.css` and `index.html`: editorial presentation and progress navigation.
- `status.md`: current task status and verification limits.

Hosted privately at https://cloud-house-pipeline-preview.mauvepike65.chatgpt.site
