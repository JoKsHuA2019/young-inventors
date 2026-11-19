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

### Creative workshop additions

The original layout and nine lesson stages remain. C01 (tent light), M01 (cardboard jaw), and I01 (mystery box) now offer optional investigations inside **Try the model**, seven illustrated cards and a gathering checklist inside **Make it**, parent quick-start guidance, observation choices, creative briefs, and pause/tidy guidance. C01 changes only the return connection and retains its resistor; M01 compares fixed 6 cm and 14 cm effort arms with a fixed pivot; I01 requires two exterior screen trials before its optional model reveal. Screen clues never populate physical-observation fields.

Every lesson's notebook includes a drawing pad, a named snapshot of the current attempt, and a question pocket. The notebook page has a creation shelf, first/latest comparison within one lesson, renaming/removal, and links back to the relevant adventure. Companion choices and optional keepsakes reflect authored exploration actions, without scores or locks. The homepage shows the latest three saved tries. Drawing has pointer tools, undo/redo, confirmation before clearing, and keyboard-operable shape controls. An earlier saved attempt keeps its own drawing snapshot.

**Print our adventure pack** provides the pilot's worksheet, parent quick-start, gathering list, and all seven illustrated cards. **Print the project & worksheet** retains the complete technical guide. The short pack points back to that guide; it does not replace its exact connection checks. Putting a project away clears its session-preparation checkbox so the setup can be checked again next time.

### Local storage and copies

Existing `young-inventors.workshop.v1` records load without losing notes or inventory. Optional `creative` metadata adds attempts, questions, draft references, companions, gathering selections, screen investigations, and keepsakes. Vector drawings use the `young-inventors.drawings` IndexedDB database; they are never uploaded. Draft marks are written after each stroke or editing action. A completed write is required before showing a saved-on-device message; failures retain current-tab data and explain how to export it.

**Save complete workshop** (also the notebook's JSON export) includes all referenced drawings, notes, materials, and creative records. **Open workshop copy** validates the file and previews it before replacing the current workshop. Referenced drawings must be present and valid. Imported drawings receive fresh IDs and are written in one transaction before metadata changes; a failed drawing import preserves the current workshop. Legacy notebook JSON copies without drawings are accepted. Complete imports are limited to 25 MiB; drawing data accepts only the workshop palette, supported line widths, bounded numeric coordinates, up to 300 strokes and 20,000 points per drawing. The shelf holds up to 300 tries and the question pocket up to 500 questions.

Clearing the notebook removes written notes and creative records while preserving materials and the chosen companion. Removing an individual written entry leaves shelf snapshots intact. Material-only copy/import remains separate and does not replace notebook or drawing records.

### Learning and materials

Project prerequisites are readiness guidance, not browsing locks. The player orders build before hardware-dependent observations and records session preparation separately from curriculum review. Screen models use explicitly illustrative values and never establish physical success.

The making box groups supplies into friendly shelves, starting with paper and craft materials. Children can search, change counts with + and −, review a kit before adding its pieces, and switch to just the supplies they have. Project ideas prioritize activities that use something already in the box and show the quantities still to gather. Matching retains exact part IDs and quantities. Prepared geometry and compatibility still require a helper check. P05 defaults to its silent built-in LED variant, so the piezo is optional. Full connection tables are authoritative over abbreviated original reference maps.

Notebook metadata, progress, and inventory use one versioned localStorage record, shared between open tabs at the same website address. Blocked or full storage falls back to the current tab with export controls and an explanation. Clearing notes preserves the materials inventory. No account, public upload, analytics, live AI tutor, or server-side learner record is present.

**Save a copy** downloads a small `my-making-box.json` file. **Open a copy** previews its materials before changing the current box. Combining keeps the larger quantity for each part, so opening the same copy or adding the same kit twice does not double counts. Replacing changes only materials and preserves notebook entries. The importer validates the file format, known part IDs, whole-number counts from 0 to 999, and a 128 KiB size limit. It can also read the materials from a full workshop/notebook JSON export. Copies let visitors carry a materials list between devices, browsers, or the two website addresses; they are not cloud synchronization. Clearing browser data can erase local work.

The site is publicly accessible at https://young-inventors.emma-rong-27.chatgpt.site using the hosted address. Anyone with the link can visit; the application has no learner sign-up. Notebooks and materials inventories remain local to each visitor’s browser.

## GitHub Pages

The public source repository is https://github.com/JoKsHuA2019/young-inventors. `.github/workflows/pages.yml` builds and publishes the `main` branch to https://jokshua2019.github.io/young-inventors/ using GitHub Actions. It runs the unit tests and content validation before publishing.

After saving source for Sites, push the same `main` commit to the `github` remote to update the Pages copy.

GitHub Pages uses a project path, so its build sets `NEXT_PUBLIC_BASE_PATH=/young-inventors`. Next.js applies this prefix to navigation and bundles; `lib/assets.ts` applies it to public illustrations and downloads. Fonts are bundled from the same local files. Sites builds leave this variable unset and keep their root-level routes.

To check the GitHub Pages export locally:

```sh
NEXT_PUBLIC_BASE_PATH=/young-inventors npm run build
NEXT_PUBLIC_BASE_PATH=/young-inventors npx playwright test tests/browser/subpath.spec.ts
```

Rebuild without that variable before packaging for Sites. A browser keeps separate notebooks and inventories for the two website addresses; neither host stores a learner account or synchronizes browser data.

## Human review still required

All exact-kit bench tests, Arduino-core compilation, board upload, mechanism clearance checks, human accessibility review, child usability pilots, and release signatures remain pending. The original host-mock checks and software tests do not establish physical readiness. The app displays these review states and includes the original review template.

See `docs/CONTENT_MAPPING.md` for editorial and technical decisions, and `docs/VERIFICATION.md` for actual verification results and remaining checks.
