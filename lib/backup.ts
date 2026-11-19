import { parseState } from "./state";
import {
  cleanDrawing,
  drawingRefs,
  newCreative,
  validDrawingId,
  type Drawing,
} from "./creative";
import type { WorkshopState } from "./types";
export function readWorkshopBackup(raw: string) {
  if (raw.length > 25 * 1024 * 1024)
    throw Error("This copy is too large to open here.");
  const x = JSON.parse(raw);
  if (
    !x ||
    x.version !== 1 ||
    (x.format && x.format !== "young-inventors-workshop") ||
    !x.progress ||
    !x.inventory
  )
    throw Error("Choose a workshop or notebook copy saved here.");
  const state = parseState(raw);
  const drawings: Record<string, Drawing> = {};
  if (
    x.drawings !== undefined &&
    (!x.drawings || typeof x.drawings !== "object" || Array.isArray(x.drawings))
  )
    throw Error("The drawings in this copy could not open.");
  for (const [id, d] of Object.entries(x.drawings || {})) {
    if (!validDrawingId(id)) throw Error("Unknown drawing in this copy.");
    drawings[id] = cleanDrawing(d);
  }
  for (const id of drawingRefs(state.creative || newCreative()))
    if (!drawings[id])
      throw Error(
        "This copy is missing a drawing. Keep your current notebook and choose a complete workshop copy.",
      );
  return { state, drawings };
}
