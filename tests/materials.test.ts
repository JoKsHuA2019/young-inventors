import test from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../lib/catalog";
import {
  combineInventory,
  inventoryBackup,
  readInventoryBackup,
  materials,
  projectsForInventory,
} from "../lib/materials";

test("project ideas prioritize supplies already found and retain accurate missing quantities", () => {
  const craft = projectsForInventory({ cardboard: 1, paper: 1, tape: 1 });
  assert(craft.slice(0, 3).every((item) => item.shared > 0));
  assert(craft.findIndex((item) => item.lesson.id === "p05") > 2);
  const ready = projectsForInventory({ uno_r3: 1, usb_data: 1 });
  assert.equal(ready[0].missing.length, 0);
  const insufficient = projectsForInventory({ aa_cells: 1 }).find(
    (item) => item.lesson.id === "c01",
  )!;
  assert.equal(
    insufficient.missing.find((item) => item.part_id === "aa_cells")!.missing,
    1,
  );
});

test("friendly material shelves retain every exact curriculum part ID", () => {
  assert.deepEqual(
    new Set(materials.map((material) => material.id)),
    new Set(
      catalog.flatMap((lesson) =>
        lesson.materials.map((material) => material.part_id),
      ),
    ),
  );
  assert(materials.find((material) => material.id === "fastener"));
  assert(materials.find((material) => material.id === "fasteners"));
});

test("kit and backup merging keeps larger counts without double counting", () => {
  const original = { aa_cells: 8, paper: 3, fastener: 1 };
  const incoming = { aa_cells: 2, jumpers: 4, fasteners: 3 };
  const merged = combineInventory(original, incoming, "merge");
  assert.deepEqual(merged, { ...original, jumpers: 4, fasteners: 3 });
  assert.deepEqual(combineInventory(merged, incoming, "merge"), merged);
  assert.deepEqual(combineInventory(original, incoming, "replace"), incoming);
  assert.deepEqual(original, { aa_cells: 8, paper: 3, fastener: 1 });
});

test("making-box copies round trip and can read materials from full workshop copies", () => {
  const inventory = { aa_cells: 999, paper: 1, tape: 0 };
  assert.deepEqual(readInventoryBackup(inventoryBackup(inventory)), {
    aa_cells: 999,
    paper: 1,
  });
  assert.deepEqual(readInventoryBackup(inventoryBackup({})), {});
  assert.deepEqual(
    readInventoryBackup(
      JSON.stringify({
        version: 1,
        inventory,
        progress: { c01: { observation: "A tiny light!" } },
      }),
    ),
    { aa_cells: 999, paper: 1 },
  );
});

test("unreadable or invalid copies cannot be applied as a making box", () => {
  const valid = {
    format: "young-inventors-making-box",
    version: 1,
    inventory: { paper: 1 },
  };
  const invalid = [
    "{",
    "null",
    "[]",
    "x".repeat(131073),
    JSON.stringify({ ...valid, version: 2 }),
    JSON.stringify({ ...valid, format: "something-else" }),
    JSON.stringify({ ...valid, inventory: [] }),
    ...[
      { paper: -1 },
      { paper: 1.5 },
      { paper: "2" },
      { paper: 1000 },
      { unknown: 1 },
      JSON.parse('{"__proto__":1}'),
    ].map((inventory) => JSON.stringify({ ...valid, inventory })),
  ];
  for (const raw of invalid) assert.throws(() => readInventoryBackup(raw));
});
