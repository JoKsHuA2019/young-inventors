import test from "node:test";
import assert from "node:assert/strict";
import {
  catalog,
  byId,
  filterLessons,
  missingParts,
  type Filters,
} from "../lib/catalog";
import {
  parseState,
  freshProgress,
  progressReducer,
  notebookText,
} from "../lib/state";
import {
  echoDistance,
  linkagePoints,
  lampForThreshold,
  sensorReading,
} from "../lib/models";
const defaults: Filters = {
  query: "",
  track: "",
  time: 60,
  board: "",
  owned: false,
  part: "",
  help: "",
  support: "",
};
test("combined filters retain only real matching projects", () => {
  const found = filterLessons(catalog, {
    ...defaults,
    board: "no-arduino",
    time: 35,
  });
  assert(found.length > 0);
  assert(found.every((l) => l.board !== "uno_r3_5v" && l.minutes <= 35));
  assert.deepEqual(
    filterLessons(catalog, {
      ...defaults,
      query: "nonexistent penguin telescope",
    }),
    [],
  );
});
test("material matching checks quantity, optional piezo, and distinct IDs", () => {
  const c = byId("c01");
  const have = Object.fromEntries(
    c.materials.map((m) => [m.part_id, m.quantity]),
  );
  assert.equal(missingParts(c, have).length, 0);
  have.aa_cells = 1;
  assert.equal(missingParts(c, have)[0].missing, 1);
  assert.equal(missingParts(byId("p05"), { uno_r3: 1, usb_data: 1 }).length, 0);
  assert(
    missingParts(byId("m02"), { fastener: 20 }).some(
      (m) => m.part_id === "fasteners",
    ),
  );
});
test("progress navigation never erases evidence or invents completion", () => {
  const p = {
    ...freshProgress(),
    prediction: "Not sure",
    observation: "Still dark",
    step: 8,
  };
  const next = progressReducer(p, { type: "next" });
  assert.equal(next.step, 8);
  assert.equal(next.finished, false);
  const restarted = progressReducer(p, { type: "restart" });
  assert.equal(restarted.observation, "Still dark");
  assert.equal(restarted.step, 0);
  assert.equal(progressReducer(freshProgress(), { type: "back" }).step, 0);
});
test("storage rejects unknown versions and bounds damaged fields", () => {
  assert.throws(() => parseState("{"));
  assert.throws(() => parseState('{"version":2}'));
  const state = parseState(
    JSON.stringify({
      version: 1,
      inventory: { red_led: -5, aa_cells: 2.9 },
      progress: {
        c01: { step: 99, prediction: 5, observation: "A useful clue" },
      },
    }),
  );
  assert.equal(state.inventory.red_led, undefined);
  assert.equal(state.inventory.aa_cells, 2);
  assert.equal(state.progress.c01.step, 8);
  assert.equal(state.progress.c01.prediction, "");
  assert.match(notebookText(state, { c01: "Tent" }), /A useful clue/);
});
test("sensor models preserve missing echoes and opposite threshold rules", () => {
  assert.equal(echoDistance(0, false), null);
  assert.equal(echoDistance(50, true), null);
  assert.equal(echoDistance(101, false), null);
  assert.equal(echoDistance(20, false), 20);
  assert(sensorReading(100) < sensorReading(0));
  assert.equal(lampForThreshold(200, 500), true);
  assert.equal(lampForThreshold(200, 500, true), false);
  assert.equal(lampForThreshold(800, 500, true), true);
});
test("linkage model preserves link lengths across the permitted input arc", () => {
  for (const angle of [35, 50, 65])
    for (const short of [false, true]) {
      const p = linkagePoints(angle, short),
        distance = (a: number[], b: number[]) =>
          Math.hypot(a[0] - b[0], a[1] - b[1]);
      assert(Math.abs(distance(p.A, p.B) - 4) < 1e-8);
      assert(Math.abs(distance(p.B, p.C) - (short ? 9 : 10)) < 1e-8);
      assert(Math.abs(distance(p.C, p.D) - 8) < 1e-8);
    }
});
