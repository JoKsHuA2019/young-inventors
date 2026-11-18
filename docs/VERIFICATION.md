# Implementation verification

Checked on 17 November 2026 (America/Los_Angeles). These results concern the website and preserved source logic. They do not constitute approval of a physical workshop.

## Software checks

| Check | Result and scope |
| --- | --- |
| Content validation | Passed: 30 complete editions, unique IDs and routes, acyclic prerequisites, materials, 210 build steps, existing image/diagram/sketch paths, and unchanged pending physical review states. |
| Content regeneration | Passed: importing the preserved source reproduces `lessons.json` and `catalog.json` byte for byte. |
| TypeScript and ESLint | Passed without errors or warnings. |
| Production export | Passed; all 45 generated pages are static. |
| Unit tests | 6 passed: combined filters, quantities/optional materials, progress preservation, damaged storage handling, sensor edge cases, and linkage geometry. |
| Chromium browser tests | 46 passed, including every lesson's model, helper guide, seven build steps, hint ladder, note persistence, and print view. |
| Investigation journey | Passed: prediction → preparation check → physical observation → notebook → export → cancel deletion → confirm deletion. |
| Failure and update behavior | Passed: unavailable local storage, missing illustrations before hydration, and a changed lesson revision that keeps notes while explaining the restarted setup. |
| Responsive checks | No horizontal page overflow at 360, 768, and 1440 px; home and lesson screenshots visually inspected. Mobile navigation and model controls work. |
| Automated accessibility | No axe WCAG A/AA violations found on five representative routes. Keyboard model controls and reduced-motion behavior checked. This is not a complete accessibility audit. |
| Printing | All 30 print views expose the complete reference diagram and review record. C01 was rendered to an A4 PDF; its illustrated worksheet, build diagram, and text extraction were inspected. Closed screen disclosures remain expanded in the printed guide. |
| Original resources | All original bookshelf links respond successfully. The app labels these downloads as the original edition. |
| Sketch logic | All 16 original host-mock checks pass using the portable wrapper described below. |

The browser suite is in `tests/browser/workshop.spec.ts`; meaningful domain checks are in `tests/core.test.ts`. Screenshots and test traces are local verification output and are excluded from the source/deployment archive.

## Sketch-check scope

Apple Clang rejects unused constants in the source test harness under its warnings-as-errors setting. `scripts/check-sketches-portable.py` adds `[[maybe_unused]]` to the mock Arduino constant declaration in memory. The preserved source harness, actual sketches, and test assertions are unchanged. This is host C++ logic verification, not compilation against an Arduino core, a board upload, an electrical measurement, or a safety test.

## Dependency audit

`npm audit --omit=dev` reports zero production dependency advisories. The full development dependency audit reports 14 high-severity entries inherited through the `picomatch` repeated-extglob ReDoS advisory (GHSA-fc5q-39xc-vjpf). The configured registry offered 4.0.7 and did not provide the proposed 4.0.8 patch during verification; no unsupported override or framework downgrade was retained. These glob tools are used in local development/linting and are not included as a server runtime in the static deployment. Recheck the development dependency tree when a patched version becomes available.

## Still requiring people and real materials

All 30 source bench results remain `not_tested`. Exact board/supply/component compatibility, mechanism clearances, real measurements, Arduino-core compilation, upload, human accessibility review, child usability pilots, and release signatures remain pending. The grown-up area exposes these states and the original review resources. A learner's preparation checkbox records that session only; it cannot change curriculum approval.

Safari/Firefox device review and actual screen-reader review were not performed. The generated illustrations are storytelling assets, not technical evidence. The original slide decks and PDFs are preserved downloads, not newly reauthored decks.
