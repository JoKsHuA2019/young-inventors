import test from "node:test";
import assert from "node:assert/strict";
import { freshProgress, parseState } from "../lib/state";
import { newCreative, cleanDrawing } from "../lib/creative";
import { readWorkshopBackup } from "../lib/backup";
import { readInventoryBackup } from "../lib/materials";
import { pilots } from "../lib/pilots";
import lessons from "../content/lessons.json";

test("older notebooks gain creative space without changing evidence or inventory", () => {
  const old = {
    version: 1,
    progress: {
      c01: { ...freshProgress(), observation: "Still dark", finished: false },
    },
    inventory: { paper: 3, aa_cells: 2 },
  };
  const next = parseState(JSON.stringify(old));
  assert.deepEqual(next.progress, old.progress);
  assert.deepEqual(next.inventory, old.inventory);
  assert.deepEqual(next.creative, newCreative());
});
test("complete workshop copies require every referenced drawing and retain immutable tries", () => {
  const creative = newCreative();
  creative.attempts = [
    {
      id: "try-1",
      lessonId: "c01",
      title: "A first light",
      created: "",
      progress: { ...freshProgress(), observation: "Dark" },
      drawingId: "drawing-one",
      modelNotes: ["Screen light on"],
    },
  ];
  creative.questions = [
    { id: "wonder-1", lessonId: "c01", text: "What if?", created: "" },
  ];
  const source = {
    version: 1,
    format: "young-inventors-workshop",
    inventory: { paper: 2 },
    progress: { c01: { ...freshProgress(), observation: "Shining" } },
    creative,
    drawings: {
      "drawing-one": {
        version: 1,
        strokes: [
          {
            color: "#355b46",
            width: 7,
            points: [
              [10, 20],
              [30, 40],
            ],
          },
        ],
      },
    },
  };
  const result = readWorkshopBackup(JSON.stringify(source));
  assert.equal(result.state.creative!.attempts[0].progress.observation, "Dark");
  assert.equal(result.state.progress.c01.observation, "Shining");
  assert.deepEqual(readInventoryBackup(JSON.stringify(source)), { paper: 2 });
  assert.throws(() =>
    readWorkshopBackup(JSON.stringify({ ...source, drawings: {} })),
  );
  assert.throws(() =>
    readWorkshopBackup(JSON.stringify({ ...source, format: "another-app" })),
  );
});
test("drawing files reject executable colors, unbounded points and damaged strokes", () => {
  const stroke = {
    color: "#355b46",
    width: 7,
    points: [
      [1, 2],
      [3, 4],
    ],
  };
  assert.equal(
    cleanDrawing({ version: 1, strokes: [stroke] }).strokes.length,
    1,
  );
  for (const s of [
    { ...stroke, color: "url(https://example.com)" },
    { ...stroke, width: 999 },
    { ...stroke, points: [[Infinity, 2]] },
    { ...stroke, points: [[601, 2]] },
    { ...stroke, points: [] },
    { ...stroke, points: Array.from({ length: 20001 }, () => [0, 0]) },
  ])
    assert.throws(() => cleanDrawing({ version: 1, strokes: [s] }));
});
test("each pilot retains seven matching build cards and the original pending review", () => {
  for (const [id, pilot] of Object.entries(pilots)) {
    const source = lessons.find((l) => l.id === id)!;
    const build = source.helper.cards.find((c) => c.kind === "build") as {
      actions: unknown[];
    };
    assert.equal(pilot.build.length, build.actions.length);
    assert.equal(source.helper.safety_review.bench_result, "not_tested");
  }
});
