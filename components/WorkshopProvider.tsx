"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { emptyState, parseState, STORAGE_KEY, notebookText } from "@/lib/state";
import { catalog } from "@/lib/catalog";
import { combineInventory } from "@/lib/materials";
import type { WorkshopState, Progress } from "@/lib/types";
import {
  newCreative,
  newInvestigation,
  drawingRefs,
  type CreativeState,
  type Drawing,
  type Investigation,
} from "@/lib/creative";
import {
  readDrawing,
  writeDrawing,
  writeDrawings,
  deleteDrawings,
} from "@/lib/drawings";
type Context = {
  state: WorkshopState;
  ready: boolean;
  error: string;
  update: (id: string, p: Progress) => void;
  inventory: (id: string, quantity: number) => void;
  applyInventory: (
    items: Record<string, number>,
    mode: "merge" | "replace",
  ) => void;
  remove: (id: string) => void;
  clear: () => void;
  exportNotes: (format: "text" | "json") => void;
  creative: CreativeState;
  editCreative: (fn: (c: CreativeState) => CreativeState) => void;
  investigate: (id: string, patch: Partial<Investigation>) => void;
  saveAttempt: (id: string, title: string) => Promise<void>;
  exportWorkshop: () => Promise<void>;
  restoreWorkshop: (
    state: WorkshopState,
    drawings: Record<string, Drawing>,
  ) => Promise<void>;
};
const WorkshopContext = createContext<Context | null>(null);
export function download(content: string, name: string, type: string) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type }));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function WorkshopProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<WorkshopState>(emptyState),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    try {
      setState(parseState(localStorage.getItem(STORAGE_KEY)));
    } catch {
      setError(
        "Your saved workshop could not open. You can keep making here and save a copy of your materials and notes before leaving.",
      );
    }
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try {
        setState(parseState(event.key === null ? null : event.newValue));
        setError("");
      } catch {
        setError(
          "Another tab saved a list we couldn’t open. Your current work is still here; save a copy before leaving.",
        );
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const mutate = useCallback((fn: (s: WorkshopState) => WorkshopState) => {
    setState((old) => {
      const next = fn(old);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setError("");
      } catch {
        setError(
          "Your materials and notes are staying in this tab for now. Please save a copy before leaving.",
        );
      }
      return next;
    });
  }, []);
  const creative = state.creative || newCreative();
  const editCreative = (fn: (c: CreativeState) => CreativeState) =>
    mutate((s) => ({ ...s, creative: fn(s.creative || newCreative()) }));
  const exportWorkshop = async () => {
    const drawings: Record<string, Drawing> = {};
    for (const id of drawingRefs(creative)) {
      const drawing = await readDrawing(id);
      if (!drawing)
        throw Error(
          "A saved drawing is missing. Your written notes can still be exported separately.",
        );
      drawings[id] = drawing;
    }
    const copy = JSON.stringify({
      ...state,
      format: "young-inventors-workshop",
      drawings,
    });
    if (new Blob([copy]).size > 25 * 1024 * 1024)
      throw Error(
        "This workshop is larger than one copy can hold. Keep this tab open; your written notes can still be exported separately.",
      );
    download(copy, "my-workshop-backup.json", "application/json");
  };
  const value: Context = {
    state,
    ready,
    error,
    creative,
    editCreative,
    investigate: (id, patch) =>
      editCreative((c) => ({
        ...c,
        investigations: {
          ...c.investigations,
          [id]: { ...newInvestigation(), ...c.investigations[id], ...patch },
        },
      })),
    saveAttempt: async (id, title) => {
      if (creative.attempts.length >= 300)
        throw Error(
          "Your shelf is full. Save a workshop copy, then remove a few older cards to make room.",
        );
      const key = crypto.randomUUID();
      let drawingId: string | undefined;
      let drawingFailed = false;
      if (creative.drafts[id]) {
        const drawing = await readDrawing(creative.drafts[id]);
        if (!drawing)
          throw Error(
            "Your drawing could not open. Save it again before adding this idea to the shelf.",
          );
        drawingId = `drawing-${key}`;
        try {
          await writeDrawing(drawingId, drawing);
        } catch {
          drawingFailed = true;
        }
      }
      const snapshot = structuredClone(
        state.progress[id] || {
          version: "woodland-1",
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
        },
      );
      editCreative((c) => ({
        ...c,
        attempts: [
          ...c.attempts,
          {
            id: key,
            lessonId: id,
            title: title.trim().slice(0, 100) || "An idea worth keeping",
            created: new Date().toISOString(),
            progress: snapshot,
            ...(drawingId ? { drawingId } : {}),
            modelNotes: [...(c.investigations[id]?.trials || [])],
          },
        ],
        keepsakes: {
          ...c.keepsakes,
          [id]: [
            ...new Set([
              ...(c.keepsakes[id] || []),
              c.attempts.some((a) => a.lessonId === id)
                ? "Another try"
                : "An idea saved",
            ]),
          ],
        },
      }));
      if (drawingFailed)
        throw Error(
          "Your idea is on this tab’s shelf, but the drawing could not save on this device. Save a workshop copy before leaving.",
        );
    },
    exportWorkshop,
    restoreWorkshop: async (incoming, drawings) => {
      const next = structuredClone(incoming);
      const c = next.creative || newCreative();
      const remap = new Map(
        Object.keys(drawings).map((id) => [
          id,
          `drawing-${crypto.randomUUID()}`,
        ]),
      );
      if (remap.size)
        await writeDrawings(
          Object.fromEntries(
            Object.entries(drawings).map(([id, d]) => [remap.get(id)!, d]),
          ),
        );
      c.drafts = Object.fromEntries(
        Object.entries(c.drafts).map(([id, ref]) => [id, remap.get(ref)!]),
      );
      c.attempts = c.attempts.map((a) => ({
        ...a,
        ...(a.drawingId ? { drawingId: remap.get(a.drawingId)! } : {}),
      }));
      next.creative = c;
      mutate(() => next);
    },
    update: (id, p) =>
      mutate((s) => ({
        ...s,
        progress: {
          ...s.progress,
          [id]: { ...p, updated: new Date().toISOString() },
        },
      })),
    inventory: (id, n) =>
      mutate((s) => ({
        ...s,
        inventory: {
          ...s.inventory,
          [id]: Math.max(0, Math.min(999, Math.floor(n) || 0)),
        },
      })),
    applyInventory: (items, mode) =>
      mutate((s) => ({
        ...s,
        inventory: combineInventory(s.inventory, items, mode),
      })),
    remove: (id) =>
      mutate((s) => ({
        ...s,
        progress: Object.fromEntries(
          Object.entries(s.progress).filter(([key]) => key !== id),
        ),
      })),
    clear: () => {
      void deleteDrawings(drawingRefs(creative)).catch(() => {});
      mutate((s) => ({
        ...s,
        progress: {},
        creative: { ...newCreative(), companion: creative.companion },
      }));
    },
    exportNotes: (format) => {
      if (format === "json") {
        void exportWorkshop().catch((e) =>
          setError(
            e instanceof Error
              ? e.message
              : "The complete copy couldn’t open. Keep this tab open and try again.",
          ),
        );
        return;
      }
      download(
        notebookText(
          state,
          Object.fromEntries(catalog.map((l) => [l.id, l.title])),
        ),
        "my-invention-notebook.txt",
        "text/plain",
      );
    },
  };
  return (
    <WorkshopContext.Provider value={value}>
      {error && (
        <div className="storage-message" role="status">
          {error}{" "}
          <button
            onClick={() =>
              void exportWorkshop().catch(() =>
                setError(
                  "The complete copy couldn’t be made. Keep this tab open and try again; written notes can also be exported from your notebook.",
                ),
              )
            }
          >
            Save workshop copy
          </button>
        </div>
      )}
      {children}
    </WorkshopContext.Provider>
  );
}
export const useWorkshop = () => {
  const ctx = useContext(WorkshopContext);
  if (!ctx) throw Error("Missing workshop provider");
  return ctx;
};
