"use client";
import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Leaf,
  Lightbulb,
  Download,
  Upload,
  Pencil,
  Heart,
  Plus,
} from "lucide-react";
import { companions, type Companion, type Attempt } from "@/lib/creative";
import { freshProgress } from "@/lib/state";
import { catalog, projectHref, byId } from "@/lib/catalog";
import { readWorkshopBackup } from "@/lib/backup";
import { pilots } from "@/lib/pilots";
import { useWorkshop } from "./WorkshopProvider";
import DrawingPad, { SavedDrawing } from "./DrawingPad";
import { StoryImage } from "./Shared";

export function FriendFace({ name }: { name: Companion }) {
  const rabbit = name === "Rabbit",
    fox = name === "Fox",
    squirrel = name === "Squirrel";
  const fur = fox
    ? "#cf8753"
    : squirrel
      ? "#b68c62"
      : rabbit
        ? "#ebe1ce"
        : "#b7beb0";
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className="friend-face">
      <circle cx="40" cy="42" r="36" fill="#edf0df" />
      {rabbit ? (
        <>
          <ellipse cx="29" cy="22" rx="8" ry="20" fill={fur} />
          <ellipse cx="51" cy="22" rx="8" ry="20" fill={fur} />
          <path
            d="M29 11v19M51 11v19"
            stroke="#d6aba0"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ) : fox ? (
        <>
          <path d="M17 43L14 9 38 32M43 32L66 9 63 43" fill={fur} />
          <path d="M20 26l-2-10 11 13M53 29l9-13-2 12" fill="#f3d5b6" />
        </>
      ) : (
        <>
          <circle cx="20" cy="27" r="14" fill={fur} />
          <circle cx="60" cy="27" r="14" fill={fur} />
          <circle cx="20" cy="27" r="8" fill="#e5bca8" />
          <circle cx="60" cy="27" r="8" fill="#e5bca8" />
        </>
      )}
      <ellipse cx="40" cy="47" rx="27" ry="25" fill={fur} />
      <ellipse cx="40" cy="57" rx="18" ry="12" fill="#faf3e3" />
      <circle cx="29" cy="44" r="2.5" fill="#293e33" />
      <circle cx="51" cy="44" r="2.5" fill="#293e33" />
      <path d="M36 53q4-4 8 0l-4 4z" fill="#64483a" />
      <path
        d="M40 57v4m-5 0q5 5 10 0"
        fill="none"
        stroke="#64483a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="22" cy="53" rx="5" ry="3" fill="#dc9f88" opacity=".5" />
      <ellipse cx="58" cy="53" rx="5" ry="3" fill="#dc9f88" opacity=".5" />
    </svg>
  );
}
export function CompanionPicker() {
  const { creative, editCreative, ready } = useWorkshop();
  return (
    <details className="companion-picker">
      <summary>
        <span className="friend-summary">
          <FriendFace name={creative.companion || "Mouse"} />
          <span>
            {creative.companion
              ? `${creative.companion} is keeping you company`
              : "A friend for your ideas"}
            <small>Choose a woodland companion, if you’d like.</small>
          </span>
        </span>
      </summary>
      <div className="friend-choices">
        {companions.map((name) => (
          <button
            className="friend-choice"
            key={name}
            disabled={!ready}
            aria-pressed={creative.companion === name}
            onClick={() => editCreative((c) => ({ ...c, companion: name }))}
          >
            <FriendFace name={name} />
            {name}
          </button>
        ))}
      </div>
      <button
        className="text-button"
        onClick={() => editCreative((c) => ({ ...c, companion: "" }))}
      >
        Explore on my own
      </button>
    </details>
  );
}
export function FriendNote({ children }: { children: React.ReactNode }) {
  const { creative } = useWorkshop();
  return (
    <div className="friend-note">
      <FriendFace name={creative.companion || "Mouse"} />
      <p>
        <strong>{creative.companion || "Mouse"} says</strong>
        {children}
      </p>
    </div>
  );
}
export function CreativeNotebook({ lessonId }: { lessonId: string }) {
  const { state, creative, editCreative, saveAttempt, update, error, ready } =
    useWorkshop();
  const [title, setTitle] = useState(""),
    [question, setQuestion] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(false);
  const attempts = creative.attempts.filter((a) => a.lessonId === lessonId);
  return (
    <div className="creative-notebook">
      <DrawingPad lessonId={lessonId} />
      <section className="creative-card">
        <span className="eyebrow">KEEP A LITTLE PIECE OF TODAY</span>
        <h3>
          {attempts.length
            ? "Another try belongs here, too."
            : "Your first idea has a place."}
        </h3>
        <p>
          Save a drawing and the notes you have now. Your next try gets its own
          card, so you can look back at what changed.
        </p>
        <label className="field">
          Name this idea
          <input
            value={title}
            maxLength={100}
            placeholder={
              attempts.length ? "My next little experiment" : "My first idea"
            }
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <button
          className="button"
          disabled={!ready || busy}
          onClick={async () => {
            setBusy(true);
            setSaved(false);
            try {
              await saveAttempt(
                lessonId,
                title ||
                  (attempts.length
                    ? `My next idea · try ${attempts.length + 1}`
                    : "My first idea"),
              );
              setMessage("Your idea is on the invention shelf.");
              setTitle("");
              setSaved(true);
            } catch (e) {
              setMessage(
                e instanceof Error
                  ? e.message
                  : "Your idea couldn’t save. Keep this tab open and try again.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <BookOpen size={17} />
          {busy
            ? "Putting your idea on the shelf…"
            : "Save this try to my shelf"}
        </button>
        <p role="status" className="creative-status">
          {message}
          {message && error
            ? " This tab is keeping your work for now; save a workshop copy before leaving."
            : ""}
        </p>
        {saved && (
          <>
            <FriendNote>
              {attempts.length > 1
                ? "You made room for another idea. What changed between your tries?"
                : "A first idea is a lovely thing to keep. You can come back and try something new."}
            </FriendNote>
            <Link className="text-link" href="/notebook/#invention-shelf">
              Visit my invention shelf
            </Link>
            <div className="next-try-card">
              <Leaf size={20} />
              <div>
                <strong>Another little thing to try</strong>
                <p>
                  {pilots[lessonId]?.remixes[attempts.length % 2]?.text ||
                    "Look back at your drawing or notes. Circle one part you’d like to understand better, then draw what you think it does. Your helper can help choose one small test."}
                </p>
                <Link
                  href={projectHref(lessonId)}
                  className="text-link"
                  onClick={() =>
                    update(lessonId, {
                      ...(state.progress[lessonId] || freshProgress()),
                      step: 7,
                    })
                  }
                >
                  Try another idea
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
      <section className="creative-card wonder-pocket">
        <span className="eyebrow">YOUR WONDER POCKET</span>
        <h3>What question shall we keep?</h3>
        <p>
          Some questions need another day. Tuck yours here so it will be waiting
          for you.
        </p>
        <label className="field">
          A question for another day
          <textarea
            value={question}
            maxLength={4000}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="I wonder what would happen if…"
          />
        </label>
        <button
          className="button secondary"
          disabled={
            !ready || !question.trim() || creative.questions.length >= 500
          }
          onClick={() => {
            editCreative((c) => ({
              ...c,
              questions: [
                ...c.questions,
                {
                  id: crypto.randomUUID(),
                  lessonId,
                  text: question.trim(),
                  created: new Date().toISOString(),
                },
              ],
              keepsakes: {
                ...c.keepsakes,
                [lessonId]: [
                  ...new Set([
                    ...(c.keepsakes[lessonId] || []),
                    "A question kept",
                  ]),
                ],
              },
            }));
            setQuestion("");
            setMessage("Your question is tucked into your wonder pocket.");
          }}
        >
          <Plus size={17} /> Keep this question
        </button>
        {creative.questions
          .filter((q) => q.lessonId === lessonId)
          .slice(-3)
          .map((q) => (
            <p key={q.id} className="pocket-question">
              <Lightbulb size={17} />
              {q.text}
            </p>
          ))}
      </section>
    </div>
  );
}
function AttemptCard({
  attempt,
  editable = true,
}: {
  attempt: Attempt;
  editable?: boolean;
}) {
  const { editCreative } = useWorkshop();
  const [renaming, setRenaming] = useState(false),
    [name, setName] = useState(attempt.title),
    [remove, setRemove] = useState(false);
  const lesson = byId(attempt.lessonId);
  return (
    <article className="shelf-card">
      {attempt.drawingId ? (
        <SavedDrawing id={attempt.drawingId} />
      ) : (
        <StoryImage image={lesson.image} alt="" />
      )}
      <div className="shelf-card-copy">
        <span className="eyebrow">{lesson.title}</span>
        <h3>{attempt.title}</h3>
        {renaming ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editCreative((c) => ({
                ...c,
                attempts: c.attempts.map((a) =>
                  a.id === attempt.id
                    ? { ...a, title: name.trim() || a.title }
                    : a,
                ),
              }));
              setRenaming(false);
            }}
          >
            <label className="field">
              New name
              <input
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button className="button secondary">Keep this name</button>
          </form>
        ) : null}
        <dl>
          <dt>My guess</dt>
          <dd>
            {attempt.progress.prediction ||
              "An idea in a drawing or a conversation."}
          </dd>
          <dt>From the real experiment</dt>
          <dd>
            {attempt.progress.observation ||
              "No written observation saved for this try."}
          </dd>
          <dt>My next idea</dt>
          <dd>
            {attempt.progress.change ||
              attempt.progress.reflection ||
              "There is still room to wonder."}
          </dd>
        </dl>
        {!!attempt.modelNotes.length && (
          <details>
            <summary>Clues from the screen model</summary>
            <ul>
              {attempt.modelNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
            <p>These are screen experiments, separate from your real build.</p>
          </details>
        )}
        <Link className="text-link" href={projectHref(lesson.id)}>
          Return to this adventure
        </Link>
        {editable && (
          <div className="shelf-actions">
            <button
              className="text-button"
              onClick={() => setRenaming(!renaming)}
            >
              Rename
            </button>
            <button className="text-button" onClick={() => setRemove(true)}>
              Remove from shelf
            </button>
          </div>
        )}
        {remove && (
          <div className="gentle-confirm">
            <p>
              Remove this saved try? Your current drawing and lesson notes will
              stay.
            </p>
            <button
              className="button secondary"
              onClick={() =>
                editCreative((c) => ({
                  ...c,
                  attempts: c.attempts.filter((a) => a.id !== attempt.id),
                }))
              }
            >
              Remove this try
            </button>
            <button className="text-button" onClick={() => setRemove(false)}>
              Keep it
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
export function InventionShelf({ compact = false }: { compact?: boolean }) {
  const { creative, ready } = useWorkshop();
  const [lessonId, setLessonId] = useState(""),
    [compare, setCompare] = useState(false);
  if (compact && !creative.attempts.length) return null;
  const entries = creative.attempts.filter(
    (a) => !lessonId || a.lessonId === lessonId,
  );
  const shown = compact
    ? entries.slice(-3).reverse()
    : compare && entries.length > 1
      ? [entries[0], entries.at(-1)!]
      : [...entries].reverse();
  return (
    <section
      id={compact ? undefined : "invention-shelf"}
      className={`invention-shelf ${compact ? "compact-shelf" : ""}`}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">LITTLE IDEAS, WORTH KEEPING</span>
          <h2>My invention shelf</h2>
          <p>
            {compact
              ? "A few things you’ve been wondering about."
              : "First ideas and next tries can sit happily side by side."}
          </p>
        </div>
        {compact && (
          <Link className="button secondary" href="/notebook/#invention-shelf">
            Open my shelf
          </Link>
        )}
      </div>
      {!compact && (
        <>
          <label className="field">
            Look at one adventure
            <select
              value={lessonId}
              onChange={(e) => {
                setLessonId(e.target.value);
                setCompare(false);
              }}
            >
              <option value="">All my adventures</option>
              {catalog
                .filter((l) =>
                  creative.attempts.some((a) => a.lessonId === l.id),
                )
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
            </select>
          </label>
          {lessonId && entries.length > 1 && (
            <button
              className="button secondary"
              aria-pressed={compare}
              onClick={() => setCompare(!compare)}
            >
              {compare ? "Show every try" : "Compare my first and latest tries"}
            </button>
          )}
        </>
      )}
      {!shown.length ? (
        <div className="empty-shelf">
          <Pencil size={32} />
          <h3>A little space for something wonderful.</h3>
          <p>
            {ready
              ? "Save an idea from a project’s notebook. Your drawing and notes will appear here together."
              : "Opening your shelf…"}
          </p>
          <Link className="text-link" href={projectHref("i01")}>
            Visit Fox’s mystery box
          </Link>
        </div>
      ) : (
        <div className={`shelf-grid ${compare ? "comparison-grid" : ""}`}>
          {shown.map((a) => (
            <AttemptCard key={a.id} attempt={a} editable={!compact} />
          ))}
        </div>
      )}
    </section>
  );
}
export function NotebookExtras() {
  const {
    state,
    creative,
    editCreative,
    update,
    exportWorkshop,
    restoreWorkshop,
  } = useWorkshop();
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [pending, setPending] = useState<ReturnType<
      typeof readWorkshopBackup
    > | null>(null),
    [draft, setDraft] = useState("");
  const [removeQuestion, setRemoveQuestion] = useState("");
  const fileId = "workshop-copy-file";
  return (
    <>
      <CompanionPicker />
      <section className="workshop-copy">
        <div>
          <h2>Keep the whole little workshop</h2>
          <p>
            A complete copy carries your drawings, shelf, questions, notes, and
            materials to another browser or device.
          </p>
        </div>
        <div className="button-row">
          <button
            className="button secondary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await exportWorkshop();
                setMessage("Your complete workshop copy is ready to keep.");
              } catch (e) {
                setMessage(
                  e instanceof Error
                    ? e.message
                    : "The copy couldn’t be made. Keep this tab open and try again.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <Download size={17} /> Save complete workshop
          </button>
          <label
            className={`button secondary file-button ${busy ? "is-busy" : ""}`}
            htmlFor={fileId}
          >
            <Upload size={17} /> Open workshop copy
            <input
              id={fileId}
              type="file"
              accept=".json,application/json"
              disabled={busy}
              onChange={async (e) => {
                const f = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                setPending(null);
                if (!f) return;
                try {
                  if (f.size > 25 * 1024 * 1024)
                    throw Error("This copy is too large to open here.");
                  setPending(readWorkshopBackup(await f.text()));
                  setMessage("");
                } catch (error) {
                  setMessage(
                    error instanceof Error
                      ? error.message
                      : "That copy couldn’t open. Your workshop is still here.",
                  );
                }
              }}
            />
          </label>
        </div>
        <p className="creative-status" role="status">
          {message}
        </p>
        {pending && (
          <div className="gentle-confirm">
            <h3>A workshop waiting to open</h3>
            <p>
              This copy has {Object.keys(pending.state.progress).length} lesson
              notebooks, {pending.state.creative?.attempts.length || 0} saved
              tries, and {Object.keys(pending.drawings).length} drawings.
              Opening it replaces the current workshop, including materials.
              Save a complete copy of your current work first if you want to
              keep both.
            </p>
            <button
              className="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await restoreWorkshop(pending.state, pending.drawings);
                  setPending(null);
                  setDraft("");
                  setMessage(
                    "Your workshop copy is open. Welcome back to your ideas.",
                  );
                } catch {
                  setMessage(
                    "The copy couldn’t be stored. Your current workshop is still here. Keep this tab open and try again.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              Open this workshop instead
            </button>
            <button
              className="text-button"
              disabled={busy}
              onClick={() => setPending(null)}
            >
              Keep my current workshop
            </button>
          </div>
        )}
      </section>
      <InventionShelf />
      <section className="creative-card">
        <span className="eyebrow">A DRAWING CAN KEEP GROWING</span>
        <h2>Back to my drawing pad</h2>
        <label className="field">
          Choose an adventure to draw about
          <select value={draft} onChange={(e) => setDraft(e.target.value)}>
            <option value="">Choose a little adventure</option>
            {catalog.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </label>
        {draft && <CreativeNotebook key={draft} lessonId={draft} />}
      </section>
      <section id="wonder-pocket" className="wonder-pocket creative-card">
        <span className="eyebrow">QUESTIONS FOR ANOTHER DAY</span>
        <h2>My wonder pocket</h2>
        {!creative.questions.length ? (
          <p>
            Your next “what if?” can live here. Keep a question from any
            project’s notebook.
          </p>
        ) : (
          creative.questions.map((q) => (
            <article className="wonder-entry" key={q.id}>
              <Lightbulb size={23} />
              <div>
                <h3>{q.text}</h3>
                <p className="fine">From {byId(q.lessonId).title}</p>
                <Link
                  className="text-link"
                  href={projectHref(q.lessonId)}
                  onClick={() =>
                    update(q.lessonId, {
                      ...(state.progress[q.lessonId] || freshProgress()),
                      reflection: q.text,
                      step: 2,
                    })
                  }
                >
                  Explore this question
                </Link>
                <button
                  className="text-button"
                  onClick={() => setRemoveQuestion(q.id)}
                >
                  Let this question go
                </button>
                {removeQuestion === q.id && (
                  <div className="gentle-confirm">
                    <p>Remove this question from the pocket?</p>
                    <button
                      className="button secondary"
                      onClick={() => {
                        editCreative((c) => ({
                          ...c,
                          questions: c.questions.filter((v) => v.id !== q.id),
                        }));
                        setRemoveQuestion("");
                      }}
                    >
                      Remove question
                    </button>
                    <button
                      className="text-button"
                      onClick={() => setRemoveQuestion("")}
                    >
                      Keep wondering
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>
      <details className="creative-card keepsake-box">
        <summary>
          <Heart size={18} /> Little discovery keepsakes
        </summary>
        <p>
          These remember things you tried. There’s nothing to collect in a
          hurry, and every adventure is always open.
        </p>
        <div className="keepsake-list">
          {Object.entries(creative.keepsakes).flatMap(([id, items]) =>
            items.map((item) => (
              <span key={`${id}-${item}`}>
                <Leaf size={17} />
                {item}
                <small>{byId(id).title}</small>
              </span>
            )),
          )}
        </div>
        {!Object.keys(creative.keepsakes).length && (
          <p>
            A saved idea, a new question, or another try can leave a keepsake
            here.
          </p>
        )}
      </details>
    </>
  );
}
