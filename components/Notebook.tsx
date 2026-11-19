"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Download, Printer, Trash2, ArrowRight } from "lucide-react";
import { useWorkshop } from "./WorkshopProvider";
import { catalog, projectHref } from "@/lib/catalog";
import { NotebookExtras } from "./CreativeWorkshop";
export default function Notebook() {
  const { state, creative, ready, update, remove, clear, exportNotes } =
    useWorkshop();
  const [confirm, setConfirm] = useState("");
  const [reset, setReset] = useState(0);
  const entries = Object.entries(state.progress).filter(([id]) =>
    catalog.some((l) => l.id === id),
  );
  return (
    <>
      <div className="notebook-toolbar">
        <button
          className="button secondary"
          disabled={!entries.length}
          onClick={() => exportNotes("text")}
        >
          <Download size={17} /> Export text
        </button>
        <button
          className="button secondary"
          disabled={!entries.length}
          onClick={() => exportNotes("json")}
        >
          Export JSON
        </button>
        <button className="button secondary" onClick={() => window.print()}>
          <Printer size={17} /> Print
        </button>
        {(entries.length > 0 ||
          creative.attempts.length > 0 ||
          creative.questions.length > 0 ||
          Object.keys(creative.drafts).length > 0) && (
          <button className="text-button" onClick={() => setConfirm("all")}>
            <Trash2 size={16} /> Clear notebook
          </button>
        )}
      </div>
      <p className="fine">
        Your notes stay in this browser. People sharing the browser may see
        them, and clearing browser data can remove them. Export anything you
        want to keep. No name is needed.
      </p>
      {confirm && (
        <div className="confirm-box" role="alert">
          <p>
            {confirm === "all"
              ? "Erase the notes, drawings, saved tries, questions, and keepsakes in this notebook? Your materials list will stay. Save a complete workshop copy first if you want to keep these ideas."
              : "Erase this project’s notes and progress?"}
          </p>
          <button
            className="button"
            onClick={() => {
              if (confirm === "all") {
                clear();
                setReset((n) => n + 1);
              } else remove(confirm);
              setConfirm("");
            }}
          >
            Erase these notes
          </button>
          <button className="button secondary" onClick={() => setConfirm("")}>
            Keep them
          </button>
        </div>
      )}
      <nav className="notebook-jumps" aria-label="Notebook sections">
        <a href="#invention-shelf">My invention shelf</a>
        <a href="#wonder-pocket">My wonder pocket</a>
        <a href="#lesson-notes">My lesson notes</a>
      </nav>
      <NotebookExtras key={reset} />
      <h2 id="lesson-notes">My lesson notes</h2>
      {!ready ? (
        <p>Opening your notebook…</p>
      ) : !entries.length ? (
        <div className="empty-state">
          <BookOpen size={46} />
          <h2>A fresh page for a curious mind.</h2>
          <p>
            Your first guess, a surprising result, a sketch on paper: it all
            starts with something you wonder about.
          </p>
          <Link className="button" href="/explore/">
            Find a little adventure <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className="notebook-entries">
          {entries.map(([id, p]) => {
            const l = catalog.find((l) => l.id === id)!;
            return (
              <article key={id} className="notebook-entry">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">
                      {p.finished ? "SAVED FOR NEXT TIME" : "STILL EXPLORING"}
                    </span>
                    <h2>{l.title}</h2>
                  </div>
                  <button
                    className="text-button"
                    aria-label={`Delete notes for ${l.title}`}
                    onClick={() => setConfirm(id)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                {(
                  ["prediction", "observation", "change", "reflection"] as const
                ).map((key, i) => (
                  <label className="field" key={key}>
                    {
                      [
                        "I think…",
                        "I saw…",
                        "I changed / would try…",
                        "Next time…",
                      ][i]
                    }
                    <textarea
                      value={p[key]}
                      onChange={(e) =>
                        update(id, { ...p, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
                {p.spoken && <p>Some ideas were shared aloud or on paper.</p>}
                <Link className="text-link" href={projectHref(id)}>
                  Back to this invention <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
