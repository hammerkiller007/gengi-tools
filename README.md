# Gengiai

Startup sandbox at gengiai.com. Next.js 16 (App Router, TypeScript, Tailwind v4).

## Run locally
```
npm install
npm run dev
```
Open http://localhost:3000

## Deploy (Phase 1, step 1)
1. Push this folder to a GitHub repo named `gengiai`.
2. vercel.com → Add New Project → import the repo → Deploy (defaults are correct).
3. Vercel gives you `gengiai-<something>.vercel.app`. That is the staging URL.
4. Every push to `main` redeploys automatically.

## Structure
- `src/app/` — routes (App Router)
- `src/app/globals.css` — design tokens from the template (colours, font)
- `.env.example` — env vars needed from Phase 1 step 2 onward
