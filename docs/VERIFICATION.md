# Implementation verification

Updated on 18 November 2026 (America/Los_Angeles). These results concern the website and preserved source logic. They do not constitute approval of a physical workshop.

## Software checks

| Check | Result and scope |
| --- | --- |
| Content validation | Passed: 30 complete editions, unique IDs and routes, acyclic prerequisites, materials, 210 build steps, existing image/diagram/sketch paths, and unchanged pending physical review states. |
| Content regeneration | Passed: importing the preserved source reproduces `lessons.json` and `catalog.json` byte for byte. |
| TypeScript and ESLint | TypeScript passed in the current production builds. ESLint passed during the initial implementation; it was not rerun for the making-box update. |
| Production export | Passed; all 45 generated pages are static. |
| GitHub Pages path | Passed against a separate `/young-inventors` export: all 30 project routes, public artwork and fonts, original downloads and code samples, client navigation, interactive model, note reload, making-box counts, and suggested-project images. |
| Unit tests | 15 passed: domain behavior, inventory matching/copies, legacy notebook preservation, complete workshop drawing references, invalid drawing rejection, and alignment of the seven pilot build cards with source review states. |
| Chromium browser tests | 65 passed, including all existing lesson, navigation, and making-box checks plus nine creative-workshop scenarios. The GitHub project-path case is skipped for root exports and run separately against its own build. |
| Creative workshop | Passed: all three investigation models and persistence; separation of screen clues from physical evidence; pointer drawing; shape controls and undo/redo; immutable first/next snapshots; question and companion persistence; complete backup transfer to a separate browser context; invalid/cancelled/failed-drawing import preservation; blocked drawing storage with downloadable recovery; gathering without inventory mutation; observation choices; and pause clearing the session-preparation check. |
| Adventure packs | All three pilot packs expose seven illustrated cards, the gathering list and parent guidance; image resources load; the full technical guide remains available through the original print route. Print-media visibility and mode cleanup are covered by browser checks. |
| Making box | Passed: search and group filtering, keyboard counters, persistence after reload, selected kit pieces only, repeated kits without double counting, file download and import into a separate browser context, restore preview/cancel/combine/replace, notebook preservation, invalid-copy rejection, blocked-storage export, and sharing changes between open tabs. |
| Investigation journey | Passed: prediction → preparation check → physical observation → notebook → export → cancel deletion → confirm deletion. |
| Failure and update behavior | Passed: unavailable local storage, missing illustrations before hydration, and a changed lesson revision that keeps notes while explaining the restarted setup. |
| Responsive checks | No horizontal page overflow at 360, 768, and 1440 px; home and lesson screenshots visually inspected. Making-box layouts additionally checked at 900 px and visually inspected at phone and desktop sizes. Mobile navigation and model controls work. |
| Automated accessibility | No axe WCAG A/AA violations found on five representative routes, the expanded navigation, and the making box at phone/desktop sizes, including its kit checklist and restore preview. Keyboard model and inventory controls and reduced-motion behavior checked. This is not a complete accessibility audit. |
| Printing | All 30 print views expose the complete reference diagram and review record. C01 was rendered to an A4 PDF; its illustrated worksheet, build diagram, and text extraction were inspected. Closed screen disclosures remain expanded in the printed guide. |
| Original resources | All original bookshelf links respond successfully. The app labels these downloads as the original edition. |
| Sketch logic | All 16 original host-mock checks pass using the portable wrapper described below. |

The browser suites are in `tests/browser/`; meaningful domain checks are in `tests/core.test.ts`, `tests/materials.test.ts`, and `tests/creative.test.ts`. Creative scenes, drawing tools and saved shelves were checked at 360, 768 and 1440 px, with phone/desktop screenshots inspected and representative expanded states checked with axe. Screenshots and test traces are local verification output and are excluded from the source/deployment archive.

## Sketch-check scope

Apple Clang rejects unused constants in the source test harness under its warnings-as-errors setting. `scripts/check-sketches-portable.py` adds `[[maybe_unused]]` to the mock Arduino constant declaration in memory. The preserved source harness, actual sketches, and test assertions are unchanged. This is host C++ logic verification, not compilation against an Arduino core, a board upload, an electrical measurement, or a safety test.

## Dependency audit

`npm audit --omit=dev` reports zero production dependency advisories. The full development dependency audit reports 14 high-severity entries inherited through the `picomatch` repeated-extglob ReDoS advisory (GHSA-fc5q-39xc-vjpf). The configured registry offered 4.0.7 and did not provide the proposed 4.0.8 patch during verification; no unsupported override or framework downgrade was retained. These glob tools are used in local development/linting and are not included as a server runtime in the static deployment. Recheck the development dependency tree when a patched version becomes available.

## Still requiring people and real materials

All 30 source bench results remain `not_tested`. Exact board/supply/component compatibility, mechanism clearances, real measurements, Arduino-core compilation, upload, human accessibility review, child usability pilots, and release signatures remain pending. The grown-up area exposes these states and the original review resources. A learner's preparation checkbox records that session only; it cannot change curriculum approval.

Safari/Firefox device review and actual screen-reader review were not performed. The generated illustrations are storytelling assets, not technical evidence. The original slide decks and PDFs are preserved downloads, not newly reauthored decks.
