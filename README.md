# Harsh Kumar Singh — Motion Designer Portfolio

A senior-level, highly interactive portfolio site for Harsh Kumar Singh, Motion Graphics Designer at Inshorts (Noida, India).

**Stack:** Vite + React + Tailwind CSS v4 + GSAP (ScrollTrigger) + Lenis smooth scrolling + three.js (`@react-three/fiber` / `@react-three/drei`).

## Highlights

- Preloader with counter + curtain reveal
- 3D hero: undulating particle wave field with mouse-parallax camera (pauses when tab hidden)
- Kinetic mouse-reactive hero typography
- **Pixel, the 3D guide** — a mascot that follows the cursor, reacts per section, and drops tips when clicked
- Custom cursor, magnetic buttons, scroll progress bar
- "Available for Freelance & Fulltime" marquee ticker
- Selected Work: 4 project slots with 3D tilt, hover motion previews, "On Behance soon" states
- Scroll-driven 3D sculpture interlude (distorted torus knot)
- Interactive easing-curve playground
- Live Noida clock + "currently" status in the footer
- Fully responsive with animated mobile menu

## Editing the words

Every word on the site lives in **`src/content.js`** — open it in the GitHub web UI, change text between the quotes, commit, and the site rebuilds itself in 2–3 minutes. The mascot's look (`guide.mascot`: skin, hair, outfit, accent) is tuned there too.

## Your own 3D character

Pixel is a placeholder built from 3D primitives. To replace him with your own character:

1. Export your character as `.glb` (Blender: File → Export → glTF 2.0, `.glb`)
2. Drop the file at **`public/character.glb`**
3. Push — the site loads it automatically and Pixel steps aside

(If the file is missing or fails to load, the built-in mascot shows instead.)

## Development

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build   # outputs to dist/
```

The site auto-deploys to GitHub Pages via the Actions workflow in `.github/workflows/deploy.yml` on every push to `main`.

Project artwork loads from the artist's own Behance CDN ([behance.net/harsh19_](https://www.behance.net/harsh19_)).
