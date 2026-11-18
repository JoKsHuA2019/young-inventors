import type { Progress, WorkshopState } from "./types";
export const STORAGE_KEY = "young-inventors.workshop.v1";
export const emptyState: WorkshopState = {
  version: 1,
  progress: {},
  inventory: {},
};
export const freshProgress = (version = "woodland-1"): Progress => ({
  version,
  step: 0,
  prediction: "",
  reason: "",
  observation: "",
  change: "",
  reflection: "",
  spoken: false,
  checked: false,
  outcome: "",
  finished: false,
  updated: "",
});
export function parseState(raw: string | null): WorkshopState {
  if (!raw) return { ...emptyState };
  const x = JSON.parse(raw);
  if (
    x.version !== 1 ||
    !x.progress ||
    !x.inventory ||
    typeof x.progress !== "object" ||
    typeof x.inventory !== "object"
  )
    throw Error("Unknown notebook format");
  const inventory: Record<string, number> = {};
  for (const [id, n] of Object.entries(x.inventory)) {
    if (typeof n === "number" && Number.isFinite(n) && n >= 0)
      inventory[id] = Math.min(999, Math.floor(n));
  }
  const progress: Record<string, Progress> = {};
  for (const [id, value] of Object.entries(x.progress)) {
    if (!/^[cpmsi]0[1-6]$/.test(id)) continue;
    const p = value as Partial<Progress>;
    if (!p || typeof p !== "object") continue;
    const clean = freshProgress(
      typeof p.version === "string" ? p.version : "woodland-1",
    );
    for (const key of [
      "prediction",
      "reason",
      "observation",
      "change",
      "reflection",
      "outcome",
      "updated",
    ] as const)
      if (typeof p[key] === "string") clean[key] = p[key];
    clean.step =
      typeof p.step === "number"
        ? Math.max(0, Math.min(8, Math.floor(p.step)))
        : 0;
    clean.checked = p.checked === true;
    clean.spoken = p.spoken === true;
    clean.finished = p.finished === true;
    progress[id] = clean;
  }
  return { version: 1, inventory, progress };
}
export type ProgressAction =
  | { type: "update"; patch: Partial<Progress> }
  | { type: "next" }
  | { type: "back" }
  | { type: "restart" };
export function progressReducer(
  state: Progress,
  action: ProgressAction,
): Progress {
  if (action.type === "restart")
    return { ...state, step: 0, checked: false, finished: false };
  if (action.type === "next")
    return { ...state, step: Math.min(8, state.step + 1) };
  if (action.type === "back")
    return { ...state, step: Math.max(0, state.step - 1) };
  return { ...state, ...action.patch };
}
export function notebookText(
  state: WorkshopState,
  titles: Record<string, string>,
) {
  return Object.entries(state.progress)
    .map(
      ([id, p]) =>
        `${titles[id] || id}\n\nI think: ${p.prediction}\nBecause: ${p.reason}\nI saw: ${p.observation}\nResult: ${p.outcome}\nI changed: ${p.change}\nNext time: ${p.reflection}\n${p.spoken ? "Some ideas were shared aloud or on paper." : ""}`,
    )
    .join("\n\n--------------------\n\n");
}
