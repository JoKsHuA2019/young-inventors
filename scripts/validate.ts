import { z } from "zod";
import fs from "node:fs";
import data from "../content/lessons.json";
const material = z.object({
  part_id: z.string().min(1),
  quantity: z.number().positive(),
  label: z.string().min(1),
  compatibility: z.string(),
  optional: z.boolean(),
});
const image = z.object({
  path: z.string(),
  cell: z.number().int().min(0).max(5),
  columns: z.literal(3),
  rows: z.literal(2),
});
const schema = z.object({
  id: z.string().regex(/^[cpmsi]0[1-6]$/),
  slug: z.string(),
  title: z.string().min(5),
  intro: z.string().min(100),
  question: z.string().min(15),
  choices: z.array(z.string()).length(3),
  discovery: z.string().min(100),
  invitation: z.string().min(20),
  preview: z.string(),
  minutes: z.number().positive(),
  prerequisites: z.array(z.string()),
  image,
  actionImage: image,
  materials: z.array(material).min(1),
  helper: z.object({
    hardware_review_status: z.literal("not_tested"),
    release_status: z.literal("blocked_pending_physical_review"),
    code_path: z.string().nullable(),
    connections: z
      .array(
        z.object({
          source: z.string(),
          destination: z.string(),
          note: z.string(),
        }),
      )
      .min(1),
    cards: z.array(
      z.object({
        kind: z.string(),
        actions: z
          .array(
            z.object({
              number: z.number(),
              instruction: z.string(),
              diagram: z.string().optional(),
            }),
          )
          .optional(),
      }),
    ),
  }),
});
export function validate() {
  const lessons = z.array(schema).length(30).parse(data);
  const ids = new Set(lessons.map((l) => l.id)),
    slugs = new Set(lessons.map((l) => l.slug));
  if (ids.size !== 30 || slugs.size !== 30) throw Error("Duplicate ID/slug");
  const visiting = new Set<string>(),
    done = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) throw Error("Prerequisite cycle");
    if (done.has(id)) return;
    visiting.add(id);
    const l = lessons.find((l) => l.id === id);
    if (!l) throw Error("Missing prerequisite " + id);
    l.prerequisites.forEach(visit);
    visiting.delete(id);
    done.add(id);
  }
  for (const l of lessons) {
    visit(l.id);
    for (const img of [l.image, l.actionImage])
      if (!fs.existsSync("public/" + img.path))
        throw Error("Missing art " + img.path);
    const actions = l.helper.cards.find((c) => c.kind === "build")?.actions;
    if (actions?.length !== 7) throw Error("Missing build steps " + l.id);
    for (const a of actions)
      if (a.diagram && !fs.existsSync("public/" + a.diagram))
        throw Error("Missing diagram " + a.diagram);
    if (l.helper.code_path && !fs.existsSync("public/" + l.helper.code_path))
      throw Error("Missing sketch " + l.id);
    if (!fs.existsSync(`public/assets/${l.id}-connection-map.png`))
      throw Error("Missing map " + l.id);
  }
  return lessons;
}
validate();
console.log(
  "PASS: 30 complete story editions, unique IDs and slugs, acyclic prerequisites, materials, 210 build steps, artwork, diagrams, sketch paths, and pending physical review states.",
);
