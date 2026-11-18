"use client";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { catalog, tracks, filterLessons, type Filters } from "@/lib/catalog";
import { ProjectCard } from "./Shared";
import { useWorkshop } from "./WorkshopProvider";
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
export default function Explore() {
  const { state } = useWorkshop();
  const [f, setF] = useState(defaults),
    [more, setMore] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("board")) setF((s) => ({ ...s, board: p.get("board")! }));
  }, []);
  const set = (patch: Partial<Filters>) => setF({ ...f, ...patch });
  const found = filterLessons(catalog, f, state.inventory);
  return (
    <>
      <div className="browse-toolbar">
        <label className="search-field">
          <Search size={21} />
          <input
            aria-label="Search projects"
            placeholder="A light, a creature, a curious little machine…"
            value={f.query}
            onChange={(e) => set({ query: e.target.value })}
          />
        </label>
        <button
          className="button secondary"
          aria-expanded={more}
          onClick={() => setMore(!more)}
        >
          <SlidersHorizontal size={18} /> More ways to choose
        </button>
      </div>
      <div className="filter-chips">
        <button aria-pressed={!f.board} onClick={() => set({ board: "" })}>
          All little adventures
        </button>
        <button
          aria-pressed={f.board === "none"}
          onClick={() => set({ board: "none" })}
        >
          Paper & cardboard
        </button>
        <button
          aria-pressed={f.board === "no-arduino"}
          onClick={() => set({ board: "no-arduino" })}
        >
          No Arduino needed
        </button>
        <button
          aria-pressed={f.time === 35}
          onClick={() => set({ time: f.time === 35 ? 60 : 35 })}
        >
          35 minutes or less
        </button>
        <button aria-pressed={f.owned} onClick={() => set({ owned: !f.owned })}>
          Use my materials
        </button>
      </div>
      {more && (
        <div className="filter-panel">
          <label className="field">
            Project trail
            <select
              value={f.track}
              onChange={(e) => set({ track: e.target.value })}
            >
              <option value="">Every trail</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.original}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Time available
            <select
              value={f.time}
              onChange={(e) => set({ time: +e.target.value })}
            >
              {[25, 30, 35, 40, 45, 50, 60].map((n) => (
                <option key={n} value={n}>
                  Up to {n} minutes
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            A material to use
            <select
              value={f.part}
              onChange={(e) => set({ part: e.target.value })}
            >
              <option value="">Any material</option>
              {Array.from(
                new Map(
                  catalog
                    .flatMap((l) => l.materials)
                    .map((m) => [m.part_id, m.label]),
                ),
              )
                .sort((a, b) => a[1].localeCompare(b[1]))
                .map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
            </select>
          </label>
          <label className="field">
            Helper preparation
            <select
              value={f.help}
              onChange={(e) => set({ help: e.target.value })}
            >
              <option value="">Any shared activity</option>
              <option value="craft">Craft & mechanism preparation</option>
              <option value="electrical">Electrical setup & checks</option>
            </select>
          </label>
          <label className="field">
            A place to start
            <select
              value={f.support}
              onChange={(e) => set({ support: e.target.value })}
            >
              <option value="">Any starting point</option>
              <option value="first">No earlier lessons needed</option>
              <option value="next">Build on an earlier discovery</option>
            </select>
          </label>
        </div>
      )}
      <div className="results-line">
        <p>
          <strong>{found.length}</strong>{" "}
          {found.length === 1 ? "thing" : "things"} to make{" "}
          {f.owned ? "with the quantities you have recorded" : ""}
        </p>
        <button className="text-button" onClick={() => setF(defaults)}>
          <X size={15} /> Clear choices
        </button>
      </div>
      {found.length ? (
        <div className="project-grid">
          {found.map((l) => (
            <ProjectCard key={l.id} lesson={l} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Let’s try a different combination.</h2>
          <p>
            There isn’t a project with all of those choices just yet. Try
            allowing a little more time or choosing another material.
          </p>
          <button className="button" onClick={() => setF(defaults)}>
            Show every project
          </button>
        </div>
      )}
      <p className="fine browse-note">
        All projects are shared activities with adult preparation. Exact-kit
        physical review is pending. Materials matches are a starting point, not
        a compatibility check.
      </p>
    </>
  );
}
