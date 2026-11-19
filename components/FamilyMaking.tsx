"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Leaf,
  PackageOpen,
  Pause,
  Printer,
  Lightbulb,
  Pencil,
} from "lucide-react";
import type { Lesson, Progress } from "@/lib/types";
import { pilots } from "@/lib/pilots";
import { materialById } from "@/lib/materials";
import { assetPath } from "@/lib/assets";
import { useWorkshop } from "./WorkshopProvider";
import { FriendFace } from "./CreativeWorkshop";

function MysteryPicture({ step }: { step: number }) {
  return (
    <svg
      viewBox="0 0 400 200"
      role="img"
      aria-label={
        [
          "Closed prepared box and its marked push tab",
          "Sketch the visible outside",
          "Compare two predictions",
          "Choose a gentle exterior test",
          "Watch the tab",
          "Compare two observations",
          "Discuss the evidence with a helper",
        ][step]
      }
      className="build-picture"
    >
      <rect width="400" height="200" rx="15" fill="#f0f0df" />
      <rect
        x="38"
        y="52"
        width="142"
        height="103"
        rx="8"
        fill="#dbba87"
        stroke="#9d7b49"
        strokeWidth="3"
      />
      <path
        d="M38 52l25-18h142l-25 18zM180 52l25-18v101l-25 20z"
        fill="#c7a16f"
        stroke="#9d7b49"
        strokeWidth="3"
      />
      <rect x="15" y="103" width="54" height="15" rx="4" fill="#a5bcab" />
      <path
        d="M29 96v30"
        stroke="#9f5338"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <text x="112" y="116" fontSize="35" textAnchor="middle" fill="#805a35">
        ?
      </text>
      <rect
        x="240"
        y="40"
        width="120"
        height="124"
        rx="6"
        fill="#fffdf7"
        stroke="#c2caaa"
        strokeWidth="2"
      />
      <path
        d="M257 75h85m-85 25h65m-65 25h75"
        stroke="#9aa990"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {step === 2 ? (
        <>
          <text x="252" y="63" fill="#355b46">
            return / stay
          </text>
        </>
      ) : (
        <text x="252" y="63" fill="#355b46">
          {step === 5
            ? "try 1 / try 2"
            : step === 6
              ? "our clues"
              : "our ideas"}
        </text>
      )}
    </svg>
  );
}
export function ParentQuickStart({ lesson }: { lesson: Lesson }) {
  const pilot = pilots[lesson.id];
  if (!pilot) return null;
  return (
    <section className="creative-card parent-quick-start">
      <span className="eyebrow">A LITTLE HELP BEFORE YOU BEGIN</span>
      <h2>Your quick-start card</h2>
      <p>
        <strong>Time together:</strong> the existing adventure is about{" "}
        {lesson.minutes} minutes. Set aside separate preparation time; it
        depends on your materials and experience.
      </p>
      <ul>
        {pilot.prep.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div className="parent-prompt">
        <Lightbulb size={22} />
        <p>
          <strong>A question to offer</strong>
          {pilot.ask}
        </p>
      </div>
      <p>{pilot.concept}</p>
      <p>
        Let the child choose a test, watch closely, and explain their idea. The
        helper prepares the exact build and handles the technical checks.
      </p>
      <p className="fine">
        Use alongside the complete guide below. Physical trials and release
        review are still pending.
      </p>
    </section>
  );
}
export function GatheringList({
  lesson,
  print = false,
}: {
  lesson: Lesson;
  print?: boolean;
}) {
  const { state, creative, editCreative } = useWorkshop();
  const gathered = creative.gathered[lesson.id] || [];
  return (
    <section className="gathering-list">
      <h3>
        <PackageOpen size={22} /> Let’s set out our supplies
      </h3>
      <p>
        “In my box” remembers what you own. Check “On our table” when you have
        gathered the piece for this adventure. Your helper still checks the
        exact kind and preparation.
      </p>
      <ul>
        {lesson.materials.map((m) => (
          <li key={m.part_id}>
            <label>
              <input
                type="checkbox"
                checked={gathered.includes(m.part_id)}
                onChange={(e) =>
                  editCreative((c) => ({
                    ...c,
                    gathered: {
                      ...c.gathered,
                      [lesson.id]: e.target.checked
                        ? [
                            ...new Set([
                              ...(c.gathered[lesson.id] || []),
                              m.part_id,
                            ]),
                          ]
                        : (c.gathered[lesson.id] || []).filter(
                            (id) => id !== m.part_id,
                          ),
                    },
                  }))
                }
              />
              <span>
                <strong>
                  {m.quantity} × {materialById.get(m.part_id)?.label || m.label}
                  {m.optional ? " (optional)" : ""}
                </strong>
                <small>
                  {print
                    ? "On our table"
                    : `In my box: ${state.inventory[m.part_id] || 0} · On our table`}
                </small>
              </span>
            </label>
          </li>
        ))}
      </ul>
      {!print && (
        <Link className="text-link" href="/my-parts/">
          Look in my making box
        </Link>
      )}
    </section>
  );
}
export function BuildCompanion({
  lesson,
  print = false,
}: {
  lesson: Lesson;
  print?: boolean;
}) {
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const pilot = pilots[lesson.id];
  if (!pilot) return null;
  const actions =
    lesson.helper.cards.find((c) => c.kind === "build")?.actions || [];
  const cards = print ? pilot.build : [pilot.build[step]];
  const contents = (
    <>
      <p>
        Read the complete guide together before starting. These little cards
        help you follow along; the grown-up guide has the exact connections and
        checks.
      </p>
      <GatheringList lesson={lesson} print={print} />
      <div className="build-companion-cards">
        {cards.map((card, i) => {
          const n = print ? i : step;
          return (
            <article className="build-companion-card" key={n}>
              <div className="build-card-caption">
                <span className="role-tag">{card.role}</span>
                <span>
                  Step {n + 1} of {pilot.build.length}
                </span>
              </div>
              <h3 ref={heading} tabIndex={print ? undefined : -1}>
                {card.title}
              </h3>
              {actions[n]?.diagram ? (
                <img
                  className="build-picture"
                  src={assetPath(actions[n].diagram!)}
                  alt={`Reference for ${card.title}. ${actions[n].instruction}`}
                  loading={print ? "eager" : "lazy"}
                />
              ) : (
                <MysteryPicture step={n} />
              )}
              <p>{card.text}</p>
            </article>
          );
        })}
      </div>
      {!print && (
        <div className="build-card-controls">
          <button
            className="button secondary"
            disabled={!step}
            onClick={() => {
              setStep(step - 1);
              setTimeout(() => heading.current?.focus(), 0);
            }}
          >
            Previous card
          </button>
          <span>
            {step + 1} / {pilot.build.length}
          </span>
          <button
            className="button"
            disabled={step === pilot.build.length - 1}
            onClick={() => {
              setStep(step + 1);
              setTimeout(() => heading.current?.focus(), 0);
            }}
          >
            Next little step
          </button>
        </div>
      )}
    </>
  );
  return print ? (
    <section className="print-adventure-cards">
      <ParentQuickStart lesson={lesson} />
      <h2>Our illustrated adventure cards</h2>
      {contents}
    </section>
  ) : (
    <details className="creative-card build-companion">
      <summary>
        <span className="eyebrow">MAKE IT TOGETHER</span>
        <span className="investigation-title">
          <Leaf size={22} /> Little steps for helpful hands
        </span>
        <span className="summary-hint">
          Gather your supplies, then follow one illustrated card at a time.
        </span>
      </summary>
      {contents}
    </details>
  );
}
export function ObservationChoices({
  lesson,
  p,
  change,
}: {
  lesson: Lesson;
  p: Progress;
  change: (p: Partial<Progress>) => void;
}) {
  const pilot = pilots[lesson.id];
  const [trial, setTrial] = useState(
      lesson.id === "c01"
        ? "Closed path"
        : lesson.id === "i01"
          ? "First try"
          : "Same target reached",
    ),
    [message, setMessage] = useState("");
  if (!pilot) return null;
  const options =
    lesson.id === "c01"
      ? ["Closed path", "Open return", "Restored return"]
      : lesson.id === "i01"
        ? ["First try", "Second try"]
        : [
            "Same target reached",
            "Same target not reached",
            "Target height unclear",
          ];
  return (
    <details className="creative-card observation-picker">
      <summary>
        <Pencil size={18} /> A little help describing what you saw
      </summary>
      <p>
        Choose only what happened in your real experiment. It’s fine if your
        result is surprising or hard to tell.
      </p>
      <label className="field">
        Which real try are we describing?
        <select value={trial} onChange={(e) => setTrial(e.target.value)}>
          {options.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <div className="observation-choices">
        {pilot.observations.map((text, i) => (
          <button
            className="observation-choice"
            key={text}
            onClick={() => {
              change({
                observation: [p.observation, `${trial}: ${text}`]
                  .filter(Boolean)
                  .join("\n"),
              });
              setMessage(
                "That observation was added to your real experiment notes. You can add more detail below.",
              );
            }}
          >
            <span className="observation-mark" aria-hidden="true">
              {["☀", "◌", "≈"][i]}
            </span>
            {text}
          </button>
        ))}
      </div>
      <button
        className="text-button"
        onClick={() => {
          document
            .querySelector<HTMLTextAreaElement>("[data-real-observation]")
            ?.focus();
        }}
      >
        I noticed something else, or I’m not sure
      </button>
      <p role="status" className="creative-status">
        {message}
      </p>
    </details>
  );
}
export function InventionPrompts({
  lesson,
  onChoose,
}: {
  lesson: Lesson;
  onChoose: (s: string) => void;
}) {
  const [chosen, setChosen] = useState("");
  const pilot = pilots[lesson.id];
  if (!pilot) return null;
  return (
    <section className="invention-prompts">
      <span className="eyebrow">AN INVITATION, NOT A RULE</span>
      <h3>What could your invention become?</h3>
      <div className="invention-prompt-grid">
        {pilot.remixes.map((r, i) => (
          <article key={r.title}>
            <FriendFace
              name={i ? "Rabbit" : (lesson.character as "Fox" | "Mouse")}
            />
            <h4>{r.title}</h4>
            <p>{r.text}</p>
            <button
              className="button secondary"
              onClick={() => {
                onChoose(r.text);
                setChosen(r.title);
              }}
            >
              Try this idea
            </button>
          </article>
        ))}
      </div>
      <p role="status" className="creative-status">
        {chosen
          ? `“${chosen}” is in your next-idea notes. You can change it to make it your own.`
          : ""}
      </p>
    </section>
  );
}
export function PauseCard({ lesson }: { lesson: Lesson }) {
  const [saved, setSaved] = useState(false);
  const { state, update } = useWorkshop();
  const pilot = pilots[lesson.id];
  if (!pilot) return null;
  return (
    <details className="pause-card">
      <summary>
        <Pause size={17} /> A good place to pause
      </summary>
      <p>{pilot.pause}</p>
      <button
        className="button secondary"
        onClick={() => {
          if (state.progress[lesson.id])
            update(lesson.id, { ...state.progress[lesson.id], checked: false });
          setSaved(true);
        }}
      >
        We’ve put our work away
      </button>
      {saved && (
        <p role="status">
          Your adventure will be here when you come back. Your helper can check
          the setup again before the next real test.
        </p>
      )}
      <Link className="text-link" href="/notebook/">
        Visit my notebook
      </Link>
    </details>
  );
}
export function AdventurePrintButton() {
  useEffect(() => {
    const reset = () => {
      delete document.documentElement.dataset.printAdventure;
    };
    window.addEventListener("afterprint", reset);
    return () => {
      window.removeEventListener("afterprint", reset);
      reset();
    };
  }, []);
  return (
    <button
      className="text-button"
      onClick={() => {
        document.documentElement.dataset.printAdventure = "true";
        window.print();
      }}
    >
      <Printer size={17} /> Print our adventure pack
    </button>
  );
}
