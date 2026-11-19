import type { Progress } from "./types";

export const companions = ["Mouse", "Fox", "Rabbit", "Squirrel"] as const;
export type Companion = (typeof companions)[number] | "";
export type Stroke = {
  color: string;
  width: number;
  points: [number, number][];
};
export type Drawing = { version: 1; strokes: Stroke[] };
export type Investigation = {
  guess: string;
  trials: string[];
  clues: string[];
  revealed: boolean;
};
export type Attempt = {
  id: string;
  lessonId: string;
  title: string;
  created: string;
  progress: Progress;
  drawingId?: string;
  modelNotes: string[];
};
export type Wonder = {
  id: string;
  lessonId: string;
  text: string;
  created: string;
};
export type CreativeState = {
  companion: Companion;
  attempts: Attempt[];
  questions: Wonder[];
  drafts: Record<string, string>;
  gathered: Record<string, string[]>;
  investigations: Record<string, Investigation>;
  keepsakes: Record<string, string[]>;
};
export const newCreative = (): CreativeState => ({
  companion: "",
  attempts: [],
  questions: [],
  drafts: {},
  gathered: {},
  investigations: {},
  keepsakes: {},
});
export const newInvestigation = (): Investigation => ({
  guess: "",
  trials: [],
  clues: [],
  revealed: false,
});
export const validLessonId = (id: string) => /^[cpmsi]0[1-6]$/.test(id);
export const validDrawingId = (id: string) =>
  /^(draft-[cpmsi]0[1-6]|drawing-[a-zA-Z0-9-]{1,80})$/.test(id);
export const palette = [
  "#355b46",
  "#b14c32",
  "#87632a",
  "#416c8c",
  "#815b87",
  "#fffdf7",
];
export function cleanDrawing(value: unknown): Drawing {
  const d = value as Drawing;
  if (
    !d ||
    d.version !== 1 ||
    !Array.isArray(d.strokes) ||
    d.strokes.length > 300
  )
    throw Error("This drawing could not be read.");
  let points = 0;
  for (const s of d.strokes) {
    if (
      !s ||
      !palette.includes(s.color) ||
      ![3, 7, 13, 24].includes(s.width) ||
      !Array.isArray(s.points) ||
      !s.points.length
    )
      throw Error("Unknown drawing marks.");
    points += s.points.length;
    if (
      points > 20000 ||
      s.points.some(
        (p) =>
          !Array.isArray(p) ||
          p.length !== 2 ||
          p.some(
            (n) =>
              typeof n !== "number" || !Number.isFinite(n) || n < 0 || n > 600,
          ),
      )
    )
      throw Error("This drawing is too large or damaged.");
  }
  return { version: 1, strokes: d.strokes };
}

export function cleanCreative(
  value: unknown,
  cleanProgress: (v: unknown) => Progress,
): CreativeState {
  const c = newCreative();
  if (value === undefined) return c;
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Unknown creative notebook format");
  const x = value as Partial<CreativeState>;
  if (x.companion && companions.includes(x.companion as Exclude<Companion, "">))
    c.companion = x.companion;
  const str = (v: unknown, limit = 4000) =>
    typeof v === "string" ? v.slice(0, limit) : "";
  const list = (v: unknown) =>
    Array.isArray(v)
      ? v
          .filter((s): s is string => typeof s === "string")
          .slice(0, 100)
          .map((s) => s.slice(0, 500))
      : [];
  if (Array.isArray(x.attempts))
    c.attempts = x.attempts
      .slice(0, 300)
      .filter(
        (a) =>
          a &&
          typeof a.id === "string" &&
          /^[a-zA-Z0-9-]{1,90}$/.test(a.id) &&
          validLessonId(a.lessonId),
      )
      .map((a) => ({
        id: a.id,
        lessonId: a.lessonId,
        title: str(a.title, 100),
        created: str(a.created, 50),
        progress: cleanProgress(a.progress),
        modelNotes: list(a.modelNotes),
        ...(a.drawingId && validDrawingId(a.drawingId)
          ? { drawingId: a.drawingId }
          : {}),
      }));
  if (Array.isArray(x.questions))
    c.questions = x.questions
      .slice(0, 500)
      .filter(
        (q) =>
          q &&
          typeof q.id === "string" &&
          /^[a-zA-Z0-9-]{1,90}$/.test(q.id) &&
          validLessonId(q.lessonId),
      )
      .map((q) => ({
        id: q.id,
        lessonId: q.lessonId,
        text: str(q.text),
        created: str(q.created, 50),
      }));
  for (const [id, ref] of Object.entries(x.drafts || {}))
    if (validLessonId(id) && typeof ref === "string" && validDrawingId(ref))
      c.drafts[id] = ref;
  for (const key of ["gathered", "keepsakes"] as const)
    for (const [id, items] of Object.entries(x[key] || {}))
      if (validLessonId(id)) c[key][id] = list(items);
  for (const [id, v] of Object.entries(x.investigations || {}))
    if (validLessonId(id) && v && typeof v === "object")
      c.investigations[id] = {
        guess: str(v.guess),
        trials: list(v.trials),
        clues: list(v.clues),
        revealed: v.revealed === true,
      };
  return c;
}

export function drawingRefs(c: CreativeState) {
  return [
    ...new Set([
      ...Object.values(c.drafts),
      ...c.attempts.flatMap((a) => (a.drawingId ? [a.drawingId] : [])),
    ]),
  ];
}
