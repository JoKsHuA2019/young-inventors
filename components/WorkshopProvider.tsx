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
  const value: Context = {
    state,
    ready,
    error,
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
    clear: () => mutate((s) => ({ ...s, progress: {} })),
    exportNotes: (format) =>
      download(
        format === "json"
          ? JSON.stringify(state, null, 2)
          : notebookText(
              state,
              Object.fromEntries(catalog.map((l) => [l.id, l.title])),
            ),
        `my-invention-notebook.${format === "json" ? "json" : "txt"}`,
        format === "json" ? "application/json" : "text/plain",
      ),
  };
  return (
    <WorkshopContext.Provider value={value}>
      {error && (
        <div className="storage-message" role="status">
          {error}{" "}
          <button
            onClick={() =>
              download(
                JSON.stringify(state, null, 2),
                "my-workshop-backup.json",
                "application/json",
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
