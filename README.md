# Young Inventors — The Woodland Workshop

A guest engineering workshop for ages 8–13, with 30 authored story editions, interactive learning models, exact adult setup guides, materials matching, a browser-local notebook, and printable projects. Built for Reverse Engineering Foundation.

## Run locally

Requires Node.js 20.9+ and npm. Python 3 is used by the content import and optional host-mock sketch checks.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables, credentials, API keys, accounts, or database are needed to run the app. Production content and fonts are self-hosted.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The static production export is `out/`. To preview it manually:

```sh
npm run preview
```

## Content and artwork

- `source/original/` preserves the supplied source files. The source archive SHA-256 is recorded in `docs/source-provenance.json`.
- `content/stories.json` contains the individually written woodland stories and preview kinds. `python3 scripts/import-content.py` joins these with the original records by lesson ID and regenerates the full lesson data and lightweight catalog.
- `public/originals/` contains the unchanged original PDFs and PowerPoints. The current app is a separate edition; use its print view for current wording and worksheets.
- `public/art/` contains the original workshop and cast illustrations made with built-in imagegen. Exact prompts and source paths are recorded in `docs/art-prompts.json`. WebP derivatives are optimized for web delivery. These pictures are not wiring instructions.
- Original per-lesson story/action sheet cells supply distinct scenes for all 30 activities. Technical reference diagrams and complete connection tables remain in the grown-up guides.
- Fonts are self-hosted, with their license files alongside them.

## Behavior and limitations

Project prerequisites are readiness guidance, not browsing locks. The player orders build before hardware-dependent observations and records session preparation separately from curriculum review. Screen models use explicitly illustrative values and never establish physical success.

Inventory matches exact part IDs and quantities. Prepared geometry and compatibility still require a helper check. P05 defaults to its silent built-in LED variant, so the piezo is optional. Full connection tables are authoritative over abbreviated original reference maps.

Notebook, progress, and inventory use one versioned localStorage record. Blocked or full storage falls back to the current tab with export controls. Clearing notes preserves the materials inventory. No account, public upload, analytics, live AI tutor, or server-side learner record is present.

The site is publicly accessible at https://young-inventors.emma-rong-27.chatgpt.site using the hosted address. Anyone with the link can visit; the application has no learner sign-up. Notebooks and materials inventories remain local to each visitor’s browser.

## Human review still required

All exact-kit bench tests, Arduino-core compilation, board upload, mechanism clearance checks, human accessibility review, child usability pilots, and release signatures remain pending. The original host-mock checks and software tests do not establish physical readiness. The app displays these review states and includes the original review template.

See `docs/CONTENT_MAPPING.md` for editorial and technical decisions, and `docs/VERIFICATION.md` for actual verification results and remaining checks.
