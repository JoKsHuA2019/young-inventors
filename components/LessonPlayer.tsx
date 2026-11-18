"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Lightbulb,
  Pause,
  Printer,
  Volume2,
} from "lucide-react";
import { freshProgress, progressReducer } from "@/lib/state";
import { steps, type Lesson, type Progress } from "@/lib/types";
import { projectHref, trackFor, byId } from "@/lib/catalog";
import { useWorkshop } from "./WorkshopProvider";
import { StoryImage } from "./Shared";
import HelperGuide from "./HelperGuide";
const Preview = dynamic(() => import("./Preview"), {
  loading: () => <p>Setting out the little model…</p>,
});
export default function LessonPlayer({
  lesson,
  code,
}: {
  lesson: Lesson;
  code: string;
}) {
  const { state, ready, update, exportNotes } = useWorkshop();
  const p = state.progress[lesson.id] || freshProgress();
  const [view, setView] = useState<"child" | "helper">("child");
  const [revisionNotice, setRevisionNotice] = useState(false);
  const [symptom, setSymptom] = useState(0),
    [hints, setHints] = useState(1),
    [speak, setSpeak] = useState(false),
    [voiceAvailable, setVoiceAvailable] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const t = trackFor(lesson.track);
  useEffect(() => {
    setVoiceAvailable("speechSynthesis" in window);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);
  useEffect(() => {
    if (p.version !== lesson.version && ready) {
      setRevisionNotice(true);
      update(lesson.id, {
        ...p,
        version: lesson.version,
        step: 0,
        checked: false,
        finished: false,
      });
    }
  }, [ready, lesson.id, lesson.version, p, update]);
  const change = (patch: Partial<Progress>) =>
    update(lesson.id, progressReducer(p, { type: "update", patch }));
  const go = (step: number) => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeak(false);
    change({ step });
    setTimeout(() => heading.current?.focus(), 0);
  };
  const read = () => {
    if (speak) {
      window.speechSynthesis.cancel();
      setSpeak(false);
      return;
    }
    const s = new SpeechSynthesisUtterance(
      [
        lesson.intro,
        lesson.question,
        "Try the little model. Choose a control and notice what changes.",
        lesson.buildText,
        lesson.exploreText,
        lesson.discovery,
        "Choose a clue to investigate.",
        lesson.invitation,
        "Tell the story of what you noticed and changed.",
      ][p.step],
    );
    s.rate = 0.88;
    s.onend = () => setSpeak(false);
    s.onerror = () => setSpeak(false);
    window.speechSynthesis.speak(s);
    setSpeak(true);
  };
  const hint = lesson.debug.faults[symptom];
  return (
    <main id="main" className="lesson-page">
      <div className="lesson-top">
        <Link href={`/trails/${lesson.track}/`} className="back-link">
          <ArrowLeft size={16} />
          {t.original}
        </Link>
        <div className="view-switch" aria-label="Reading view">
          <button
            aria-pressed={view === "child"}
            onClick={() => setView("child")}
          >
            Our project
          </button>
          <button
            aria-pressed={view === "helper"}
            onClick={() => setView("helper")}
          >
            For grown-ups
          </button>
        </div>
      </div>
      <div className="lesson-title">
        <span className="eyebrow">
          {lesson.character.toUpperCase()}’S WORKBENCH · {lesson.minutes}{" "}
          MINUTES
        </span>
        <h1>{lesson.title}</h1>
      </div>
      <div className="review-note">
        <Lightbulb size={17} />
        <span>
          {lesson.board === "none"
            ? "Make with a helper. Ask them to prepare and check the moving parts."
            : "Make with a helper. Disconnect all power before changing wires; ask them to check before reconnecting."}{" "}
          <button className="text-button" onClick={() => setView("helper")}>
            Grown-up preparation & review status
          </button>
        </span>
      </div>
      {revisionNotice && (
        <div className="review-note" role="status">
          <BookOpen size={17} />
          <span>
            This project has a few new pages. Your ideas are still in your
            notebook. Let’s start at the beginning and check the setup together.
          </span>
        </div>
      )}
      {view === "helper" ? (
        <>
          <HelperGuide lesson={lesson} code={code} />
          <button className="button" onClick={() => setView("child")}>
            Back to our project <ArrowRight size={17} />
          </button>
        </>
      ) : (
        <div className="player-layout">
          <aside className="step-nav">
            <span className="eyebrow">OUR LITTLE ADVENTURE</span>
            <ol>
              {steps.map((s, i) => (
                <li key={s}>
                  <button
                    aria-label={s}
                    disabled={!ready}
                    onClick={() => go(i)}
                    aria-current={p.step === i ? "step" : undefined}
                  >
                    <span>{p.step > i ? <Check size={13} /> : i + 1}</span>
                    {s}
                  </button>
                </li>
              ))}
            </ol>
            <Link className="pause-link" href="/notebook/">
              <Pause size={16} /> Save a place for later
            </Link>
          </aside>
          <section className="player-panel" aria-label="Lesson">
            <div className="step-top">
              <span>
                CHAPTER {p.step + 1} OF {steps.length}
              </span>
              {voiceAvailable && (
                <button className="text-button read-button" onClick={read}>
                  <Volume2 size={16} />
                  {speak ? "Stop reading" : "Read to me"}
                </button>
              )}
            </div>
            <h2 ref={heading} tabIndex={-1}>
              {steps[p.step] === "The story"
                ? `A little help for ${lesson.character}`
                : steps[p.step]}
            </h2>
            {p.step === 0 && (
              <>
                <StoryImage
                  image={lesson.image}
                  alt={lesson.title}
                  className="lesson-art"
                />
                <p className="story-prose">{lesson.intro}</p>
                <p className="invitation-note">
                  There’s more than one way to be an inventor. You can make,
                  draw, talk, or direct a helper.
                </p>
              </>
            )}
            {p.step === 1 && (
              <>
                <p className="story-prose">{lesson.question}</p>
                <fieldset className="prediction">
                  <legend>What do you think?</legend>
                  {lesson.choices.map((c) => (
                    <label key={c}>
                      <input
                        type="radio"
                        name="prediction"
                        checked={p.prediction === c}
                        onChange={() => change({ prediction: c })}
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </fieldset>
                <label className="field">
                  What makes you think that?
                  <textarea
                    value={p.reason}
                    onChange={(e) => change({ reason: e.target.value })}
                    placeholder="You can write a little, draw on paper, or tell your helper."
                  />
                </label>
                <p className="fine">
                  A guess is a place to begin. You can change your mind when you
                  find new evidence.
                </p>
              </>
            )}
            {p.step === 2 && (
              <>
                <p>
                  Let’s explore a small version on the screen before making the
                  real thing. What changes when you try the controls?
                </p>
                <Preview key={lesson.id} kind={lesson.preview} />
              </>
            )}
            {p.step === 3 && (
              <>
                <StoryImage
                  image={lesson.actionImage}
                  alt={`Making and trying ${lesson.title}`}
                  className="lesson-art"
                />
                <p className="story-prose">{lesson.buildText}</p>
                <p>
                  Your helper has the exact preparation and build steps. You can
                  choose the test and help trace how the parts work together.
                </p>
                <button
                  className="button secondary"
                  onClick={() => setView("helper")}
                >
                  Open the matching build guide <ArrowRight size={17} />
                </button>
                <details className="materials-disclosure">
                  <summary>What will we need?</summary>
                  <ul>
                    {lesson.materials.map((m) => (
                      <li key={m.part_id}>
                        {m.quantity} × {m.label}
                        {m.optional ? " (optional)" : ""}
                      </li>
                    ))}
                  </ul>
                  <Link href="/my-parts/">Check my materials</Link>
                </details>
                {lesson.prerequisites.length > 0 && (
                  <p className="fine">
                    Useful first discoveries:{" "}
                    {lesson.prerequisites.map((id) => (
                      <Link key={id} href={projectHref(id)}>
                        {byId(id).title}.{" "}
                      </Link>
                    ))}
                  </p>
                )}
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={p.checked}
                    onChange={(e) => change({ checked: e.target.checked })}
                  />
                  My helper has prepared and checked our setup, or is
                  demonstrating a checked build.
                </label>
                <p className="fine">
                  For a shared activity after exact-kit review. This records
                  your session preparation; it does not approve the curriculum.
                </p>
              </>
            )}
            {p.step === 4 && (
              <>
                {!p.checked ? (
                  <div className="gentle-message">
                    <h3>Let’s get the real setup ready.</h3>
                    <p>
                      An on-screen model cannot check your actual materials. Ask
                      your helper to read the build guide and prepare the
                      checked experiment before trying the physical steps.
                    </p>
                    <button className="button" onClick={() => go(3)}>
                      Back to making <ArrowLeft size={17} />
                    </button>
                    <p>
                      You can still browse the explanation and keep a prediction
                      for another day.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="story-prose">{lesson.exploreText}</p>
                    <div className="experiment-note">
                      <h3>One thing to change</h3>
                      <p>{lesson.experiment.variable}</p>
                      <h3>Things to keep the same</h3>
                      <p>{lesson.experiment.keep_constant}</p>
                    </div>
                    <label className="field">
                      What happened in your real experiment?
                      <textarea
                        value={p.observation}
                        onChange={(e) =>
                          change({ observation: e.target.value })
                        }
                        placeholder="Write what you actually saw. A surprising result is useful too."
                      />
                    </label>
                    <fieldset className="outcome-choice">
                      <legend>How did this try go?</legend>
                      {[
                        "We noticed a result",
                        "Still working on it",
                        "The difference was hard to tell",
                      ].map((v) => (
                        <label key={v}>
                          <input
                            type="radio"
                            name="outcome"
                            checked={p.outcome === v}
                            onChange={() => change({ outcome: v })}
                          />
                          {v}
                        </label>
                      ))}
                    </fieldset>
                    <p className="fine">
                      Paper, a drawing, or a spoken explanation works just as
                      well.
                    </p>
                  </>
                )}
              </>
            )}
            {p.step === 5 && (
              <>
                <p className="story-prose">{lesson.discovery}</p>
                <details>
                  <summary>A closer look, with your helper</summary>
                  <p>
                    {String(
                      lesson.helper.cards.find((c) => c.kind === "reveal")
                        ?.explorer || lesson.helper.learning_objective,
                    )}
                  </p>
                </details>
                <div className="paper-note">
                  <Lightbulb size={24} />
                  <p>
                    Think back to your guess. Which observation helped you keep
                    it, change it, or ask another question?
                  </p>
                </div>
                {!p.observation && !p.spoken && (
                  <p className="fine">
                    Reading ahead is welcome. Return to the real experiment when
                    a checked setup is ready.
                  </p>
                )}
              </>
            )}
            {p.step === 6 && (
              <>
                <p>
                  Something unexpected is a clue. Choose what you noticed, then
                  open one hint at a time.
                </p>
                <label className="field">
                  What needs a closer look?
                  <select
                    value={symptom}
                    onChange={(e) => {
                      setSymptom(+e.target.value);
                      setHints(1);
                    }}
                  >
                    {lesson.debug.faults.map((f, i) => (
                      <option key={f.symptom} value={i}>
                        {f.symptom}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="safety-cue">
                  {lesson.debug.before_physical_changes}
                </p>
                <ol className="hint-list">
                  {hint.hints.slice(0, hints).map((h, i) => (
                    <li key={h}>
                      <span>CLUE {i + 1}</span>
                      <p>{h}</p>
                    </li>
                  ))}
                </ol>
                <button
                  className="button secondary"
                  disabled={hints >= hint.hints.length}
                  onClick={() => setHints(hints + 1)}
                >
                  {hints < hint.hints.length
                    ? "Show another clue"
                    : "All clues are open"}
                </button>
                <p className="fine">
                  Ask your helper to handle technical checks. An unresolved
                  result can go in your notebook.
                </p>
              </>
            )}
            {p.step === 7 && (
              <>
                <p className="story-prose">{lesson.invitation}</p>
                <fieldset className="remix-choices">
                  <legend>Or choose another small investigation</legend>
                  {lesson.remix.map((r) => (
                    <label key={r.type}>
                      <input
                        type="radio"
                        name="remix"
                        checked={p.change === r.prompt}
                        onChange={() => change({ change: r.prompt })}
                      />
                      <span>
                        {r.prompt[0].toUpperCase() + r.prompt.slice(1)}
                      </span>
                    </label>
                  ))}
                </fieldset>
                <label className="field">
                  What would you change, and how would you test it?
                  <textarea
                    value={p.change}
                    onChange={(e) => change({ change: e.target.value })}
                    placeholder="Your own idea belongs here, too."
                  />
                </label>
              </>
            )}
            {p.step === 8 && (
              <>
                <div className="paper-note">
                  <BookOpen size={27} />
                  <p>
                    Your invention has a story now. A first guess, something you
                    noticed, and an idea worth trying next.
                  </p>
                </div>
                <dl className="notebook-summary">
                  <dt>I thought</dt>
                  <dd>
                    {p.prediction || "A spoken guess or drawing is welcome."}
                  </dd>
                  <dt>I noticed</dt>
                  <dd>
                    {p.observation ||
                      "You can tell your helper or keep a paper record."}
                  </dd>
                  <dt>I changed / would try</dt>
                  <dd>
                    {p.change ||
                      "A useful next test counts, even if the build is unfinished."}
                  </dd>
                </dl>
                <label className="field">
                  What are you wondering about next?
                  <textarea
                    value={p.reflection}
                    onChange={(e) => change({ reflection: e.target.value })}
                    placeholder="A new question, a different design, or something to try again…"
                  />
                </label>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={p.spoken}
                    onChange={(e) => change({ spoken: e.target.checked })}
                  />
                  I shared my ideas aloud or on paper.
                </label>
                <div className="button-row">
                  <button
                    className="button"
                    onClick={() => change({ finished: true })}
                  >
                    {p.finished ? (
                      <>
                        <Check size={17} /> Saved for next time
                      </>
                    ) : (
                      <>
                        I’m done for now <Check size={17} />
                      </>
                    )}
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => exportNotes("text")}
                  >
                    Export my notes
                  </button>
                </div>
                <p className="fine">
                  Saved in this browser when storage is available. Other people
                  using this browser may see your notes. Browser cleanup can
                  erase them.
                </p>
                {p.finished && (
                  <Link className="next-adventure" href="/explore/">
                    What shall we investigate next? <ArrowRight size={18} />
                  </Link>
                )}
              </>
            )}
            <div className="player-bottom">
              <button
                className="button secondary"
                disabled={p.step === 0}
                onClick={() => go(p.step - 1)}
              >
                <ArrowLeft size={17} /> Back
              </button>
              <span>
                {p.step + 1} / {steps.length}
              </span>
              {p.step < 8 ? (
                <button className="button" onClick={() => go(p.step + 1)}>
                  Next <ArrowRight size={17} />
                </button>
              ) : (
                <Link className="button secondary" href="/notebook/">
                  My notebook <BookOpen size={17} />
                </Link>
              )}
            </div>
          </section>
        </div>
      )}
      <div className="lesson-tools">
        <button className="text-button" onClick={() => window.print()}>
          <Printer size={17} /> Print the project & worksheet
        </button>
        <Link href="/notebook/">
          Visit my notebook <ArrowRight size={16} />
        </Link>
      </div>
      <section className="print-only">
        <div className="print-project-head">
          <div>
            <p className="eyebrow">
              {lesson.character}’s workshop · {lesson.id.toUpperCase()}
            </p>
            <h1>{lesson.title}</h1>
          </div>
          <StoryImage image={lesson.image} alt={lesson.title} />
        </div>
        <p>{lesson.intro}</p>
        <h2>My prediction</h2>
        <p>{lesson.question}</p>
        <p>
          {p.prediction} {p.reason}
        </p>
        <div className="write-lines" />
        <h2>Our experiment</h2>
        <p>{lesson.exploreText}</p>
        <p>Change: {lesson.experiment.variable}</p>
        <p>Keep the same: {lesson.experiment.keep_constant}</p>
        <h2>What I observed</h2>
        <p>{p.observation}</p>
        <div className="write-lines" />
        <h2>What we discovered</h2>
        <p>{lesson.discovery}</p>
        <h2>My next idea</h2>
        <p>{lesson.invitation}</p>
        <p>
          {p.change} {p.reflection}
        </p>
        <div className="write-lines" />
        <HelperGuide lesson={lesson} code={code} printMode />
      </section>
    </main>
  );
}
