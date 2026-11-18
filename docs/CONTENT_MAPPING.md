# Content mapping and editorial decisions

The supplied archive is the preserved technical baseline. The user's later direction authorizes rewriting learner copy for ages 8–13, with a cozy animal workshop, craft-first discovery, and explicit relevance to reverse engineering, engineering, and circuitry.

## Import contract

The source `child_pages.json`, `helper_lessons.json`, and current `lesson_manifest.json` join on the existing lowercase lesson IDs. Source manifest/child schema version is 4.0; helper schema is 2.0. The handoff's archive-edition numbering is not the schema version.

`content/stories.json` supplies the new title, character, substantial opening, prediction question/choices, child explanation, creative invitation, and preview kind. The import uses source child pages 3 and 4 for power-aware shared build/experiment wording. The source helper record supplies exact materials, wiring, seven build steps, observations, debug hints, remixes, code paths, cleanup, and review status. All 30 child editions have a separate `woodland-1` revision.

The UI sequence is story → prediction → screen model → checked build → physical experiment → explanation → hints → remix → reflection. This implements the source `app_card_order` intent. It deliberately does not render the raw source cards array, which places exploration before building.

## Resolved source mismatches

- Detailed materials take precedence over older summaries. I01's flashlight and I04's optional electronics are not silently added to their mechanical BOMs.
- P05's passive piezo is optional; its default sketch uses the board's built-in LED. The sound variant needs adult component and volume review.
- Generic craft IDs are retained without automatic substitution. `fastener` and `fasteners` remain separate. Matching cardboard does not establish the exact prepared geometry.
- Connection maps are supplemental. Their generator limits some maps to six rows, so full tables are always shown. P04's map explains PWM rather than full wiring.
- Seven step diagrams exist for each of the five original flagships. The other activities use their overall map, complete tables, and detailed written steps.
- C02 closes the circuit when its foil flap closes. C05 uses an independent resistor per branch. I01 uses an exterior-only prepared mechanism. I06 finishes locally.
- M02/I03 previews compute linkage closure for a limited 30° input arc with the source link lengths; the alternative coupler length is 1 cm shorter. These models do not establish clearance or bench review.
- Servo examples retain the current sketches' 60°–100° range and the specified external supply. M05 remains the servo drawbridge; no unreviewed string-driven variant is introduced.
- S03/S04 preserve missing/invalid echoes as unknown. S04 uses toggle intervals, not a misleading full-flash frequency. S02 uses a below-threshold light rule; S06 uses an above-threshold alert.
- S05 uses relative example readings, includes an inconclusive option, and retains the insulated-bead/no-heater instructions.
- P06's browser activity is explicitly an estimate distinct from the hardware sketch. Early presses are rejected; resets and unmounts cancel timers.

## Review and future updates

Software completion is distinct from editorial, physical, accessibility, and pilot sign-off. Preserve pending source states until a reviewer records evidence against the exact content revision, board, supply, parts, sketch hash, and toolchain.

When changing content semantics, increment the app content revision. The player keeps learner notes but resets the instructional position and session setup check when it encounters a changed revision. Source originals remain unchanged; printable app views carry the new edition's story and matching technical guide.

## Intentional boundaries

No server APIs, database, learner accounts, uploads, public social features, or external analytics. Existing slides/PDFs remain downloadable as the original edition. App print views provide the current revised project and worksheet; slides have not been reauthored. Generated artwork shows ideas rather than technically validated builds.
