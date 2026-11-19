import { catalog, missingParts } from "./catalog";

export const materialGroups = [
  { id: "craft", label: "Paper & craft" },
  { id: "circuits", label: "Lights & circuits" },
  { id: "sensors", label: "Boards & sensors" },
  { id: "motion", label: "Moving parts" },
  { id: "project", label: "Project pieces" },
] as const;
export type MaterialGroup = (typeof materialGroups)[number]["id"];
const names: Record<string, [string, MaterialGroup, string]> = {
  cardboard: [
    "Cardboard pieces",
    "craft",
    "Sheets and scraps, prepared for your project.",
  ],
  paper: ["Paper", "craft", "For drawing, folding, and little paper worlds."],
  tape: ["Tape", "craft", "Count each roll."],
  marker: [
    "Marker",
    "craft",
    "For drawings, labels, and a friendly face or two.",
  ],
  ruler: ["Ruler", "craft", "One with centimeter marks."],
  string: [
    "Short pieces of string",
    "craft",
    "Count the short pieces set aside for making.",
  ],
  box: ["Cardboard box", "craft", "A dry box, ready for a helper to prepare."],
  shade: [
    "Shade card",
    "craft",
    "A dry card that blocks light and makes a little shadow.",
  ],
  target: [
    "Cardboard target",
    "craft",
    "A flat piece for the distance experiments.",
  ],
  aa_cells: [
    "AA alkaline batteries",
    "circuits",
    "Count each battery. Your helper will check the kind.",
  ],
  holder_2aa: [
    "Two-AA battery holder",
    "circuits",
    "The holder for the little 3 V circuits.",
  ],
  red_led: ["Red LED", "circuits", "One tiny red light."],
  yellow_led: ["Yellow LED", "circuits", "One tiny yellow light."],
  green_led: ["Green LED", "circuits", "One tiny green light."],
  resistor_220: [
    "220 Ω resistor",
    "circuits",
    "Helps limit the current in a little circuit. Ask your helper to check the kind.",
  ],
  resistor_10k: [
    "10 kΩ resistor",
    "circuits",
    "A circuit piece that works with your sensor. Your helper can check its value.",
  ],
  breadboard: [
    "Breadboard",
    "circuits",
    "A board with tiny holes where circuit pieces can join together.",
  ],
  jumpers: ["Jumper wires", "circuits", "Count each insulated wire."],
  button: [
    "Push button",
    "circuits",
    "Press it to join a path in the circuit. Your helper will check its legs.",
  ],
  foil_contacts: [
    "Foil contacts",
    "circuits",
    "Small, smooth pieces prepared for a switch.",
  ],
  passive_piezo: [
    "Quiet piezo sounder",
    "circuits",
    "An optional sound-making piece. Ask your helper to choose the right kind.",
  ],
  uno_r3: [
    "Arduino Uno R3",
    "sensors",
    "A little computer that follows your instructions. This workshop uses the 5 V Uno R3.",
  ],
  usb_data: [
    "USB data cable",
    "sensors",
    "Your helper can check that it carries data.",
  ],
  ldr: [
    "Light sensor",
    "sensors",
    "A little photoresistor with two legs. It helps a circuit notice light.",
  ],
  hc_sr04: [
    "Distance sensor",
    "sensors",
    "An HC-SR04 module that uses echoes to find nearby things. Check it with your helper.",
  ],
  ntc_10k: [
    "Temperature-sensing bead",
    "sensors",
    "A tiny 10 kΩ NTC bead that notices warmth. Your helper will prepare it.",
  ],
  pot_10k: [
    "Turning dial",
    "sensors",
    "Turn the little knob to change a signal. Ask your helper for a 10 kΩ potentiometer.",
  ],
  servo_5v: [
    "Little servo motor",
    "motion",
    "A small 5 V motor that turns a little arm. Your helper will check it first.",
  ],
  servo_supply: [
    "Servo power supply",
    "motion",
    "The separate 5 V power supply your helper prepares for the servo.",
  ],
  base: [
    "Prepared cardboard base",
    "motion",
    "A sturdy little base. Ask your helper to check its shape and holes.",
  ],
  pivot: [
    "Paper-fastener pivot",
    "motion",
    "A blunt fastener with its two prepared support tabs.",
  ],
  paper_load: [
    "Light paper load",
    "motion",
    "The small paper load for comparing levers.",
  ],
  fasteners: [
    "Linkage fasteners",
    "motion",
    "Covered, blunt fasteners for linkages; count each one.",
  ],
  fastener: [
    "Handle fastener",
    "motion",
    "The covered, blunt fastener for the handle project.",
  ],
  link_set: [
    "Cardboard linkage set",
    "motion",
    "Three cardboard links, cut and marked for the linkage project.",
  ],
  paper_arm: [
    "Light paper arm",
    "motion",
    "A very light arm with its stable mount.",
  ],
  bridge: [
    "Drawbridge pieces",
    "motion",
    "The prepared light bridge, hinge, and linkage.",
  ],
  dry_samples: [
    "Material sample set",
    "project",
    "Dry foil, a paperclip, wood, and plastic for a little investigation. Your helper picks the samples.",
  ],
  mystery_model: [
    "Mystery box model",
    "project",
    "The closed cardboard mechanism prepared by your helper.",
  ],
  fault_envelope: [
    "Clue envelope",
    "project",
    "Your helper keeps the mystery inside.",
  ],
  reference_linkage: [
    "Practice linkage",
    "project",
    "The checked, hand-powered model from the linkage project.",
  ],
  prototype: [
    "Finished invention",
    "project",
    "A helper-checked build for the little invention show.",
  ],
  test_notes: [
    "Paper test notes",
    "project",
    "Drawings and notes from your experiments.",
  ],
};
const sourceMaterials = new Map(
  catalog
    .flatMap((lesson) => lesson.materials)
    .map((material) => [material.part_id, material]),
);
export const materials = Array.from(sourceMaterials, ([id, material]) => {
  const [label, group, hint]: [string, MaterialGroup, string] = names[id] || [
    material.label,
    "project",
    "Check this piece with your helper.",
  ];
  return {
    id,
    label,
    group,
    hint,
    search:
      `${label} ${material.label} ${id.replaceAll("_", " ")} ${hint}`.toLowerCase(),
  };
}).sort((a, b) => a.label.localeCompare(b.label));
export const materialById = new Map(
  materials.map((material) => [material.id, material]),
);

export function projectsForInventory(inventory: Record<string, number>) {
  return catalog
    .map((lesson) => ({
      lesson,
      missing: missingParts(lesson, inventory),
      shared: lesson.materials.filter(
        (material) =>
          !material.optional && (inventory[material.part_id] || 0) > 0,
      ).length,
    }))
    .sort(
      (a, b) =>
        Number(b.shared > 0) - Number(a.shared > 0) ||
        a.missing.length - b.missing.length ||
        b.shared - a.shared,
    );
}

export const materialKits: Record<
  string,
  { label: string; items: Record<string, number> }
> = {
  craft: {
    label: "Paper & craft box",
    items: { cardboard: 1, paper: 1, tape: 1, marker: 1, ruler: 1, string: 1 },
  },
  circuit: {
    label: "First circuit",
    items: {
      aa_cells: 2,
      holder_2aa: 1,
      red_led: 1,
      resistor_220: 1,
      breadboard: 1,
      jumpers: 4,
    },
  },
  board: {
    label: "Arduino starter kit",
    items: {
      uno_r3: 1,
      usb_data: 1,
      breadboard: 1,
      red_led: 1,
      resistor_220: 1,
      button: 1,
      jumpers: 6,
    },
  },
  sensing: {
    label: "Sensor pieces",
    items: { ldr: 1, resistor_10k: 1, shade: 1, hc_sr04: 1, ntc_10k: 1 },
  },
  motion: {
    label: "Moving pieces",
    items: { servo_5v: 1, servo_supply: 1, pot_10k: 1, paper_arm: 1 },
  },
};

export function combineInventory(
  current: Record<string, number>,
  incoming: Record<string, number>,
  mode: "merge" | "replace",
) {
  const next = mode === "replace" ? {} : { ...current };
  for (const [id, quantity] of Object.entries(incoming)) {
    if (!materialById.has(id)) continue;
    const count = Number.isFinite(quantity)
      ? Math.max(0, Math.min(999, Math.floor(quantity)))
      : 0;
    next[id] = mode === "merge" ? Math.max(next[id] || 0, count) : count;
  }
  return next;
}

export function inventoryBackup(inventory: Record<string, number>) {
  return JSON.stringify(
    {
      format: "young-inventors-making-box",
      version: 1,
      savedAt: new Date().toISOString(),
      inventory: Object.fromEntries(
        materials
          .filter((material) => inventory[material.id] > 0)
          .map((material) => [material.id, inventory[material.id]]),
      ),
    },
    null,
    2,
  );
}

export function readInventoryBackup(raw: string): Record<string, number> {
  if (raw.length > 131072)
    throw Error("This file is too large for a making-box copy.");
  const value = JSON.parse(raw);
  if (
    !value ||
    typeof value !== "object" ||
    value.version !== 1 ||
    !(
      value.format === "young-inventors-making-box" ||
      value.format === "young-inventors-workshop" ||
      (!value.format && value.progress && typeof value.progress === "object")
    ) ||
    !value.inventory ||
    typeof value.inventory !== "object" ||
    Array.isArray(value.inventory)
  ) {
    throw Error("Choose a making-box copy saved by this workshop.");
  }
  const inventory: Record<string, number> = {};
  for (const [id, quantity] of Object.entries(value.inventory)) {
    if (
      !materialById.has(id) ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      quantity > 999
    ) {
      throw Error(
        "Some materials in this file could not be read. Your current box is safe.",
      );
    }
    if (quantity > 0) inventory[id] = quantity;
  }
  return inventory;
}
