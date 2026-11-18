"use client";
import { useState } from "react";
import type { Lesson } from "@/lib/types";
import { projectHref, byId } from "@/lib/catalog";
import Link from "next/link";
import { assetPath } from "@/lib/assets";
import { Check, Copy, Download } from "lucide-react";
export default function HelperGuide({
  lesson,
  code = "",
  printMode = false,
}: {
  lesson: Lesson;
  code?: string;
  printMode?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const h = lesson.helper;
  const actions = h.cards.find((c) => c.kind === "build")?.actions || [];
  return (
    <div className="helper-guide">
      <div className="helper-status">
        <span className="eyebrow">
          FOR GROWN-UPS · {lesson.id.toUpperCase()}
        </span>
        <h2>Prepare the real experiment</h2>
        <p>
          Complete manuscript. Exact-kit physical review, human accessibility
          review, and child pilots are pending.{" "}
          {h.code_path
            ? "Arduino-core compilation and device upload are also pending."
            : ""}{" "}
          A checked box in this app does not constitute curriculum sign-off.
        </p>
      </div>
      <p>{h.mentor_note}</p>
      <p>
        <strong>Reference build:</strong>{" "}
        {lesson.board === "none"
          ? "Prepared mechanical materials, no electricity"
          : lesson.board === "3V_2xAA"
            ? "Isolated 3 V supply using two matched alkaline AA cells"
            : "Arduino Uno R3 with 5 V logic; no automatic cross-board compatibility"}
        .
      </p>
      {lesson.prerequisites.length > 0 && (
        <p>
          <strong>Readiness:</strong>{" "}
          {lesson.prerequisites.map((id) => (
            <Link key={id} href={projectHref(id)}>
              {byId(id).title}{" "}
            </Link>
          ))}
        </p>
      )}
      <h3>Materials and preparation</h3>
      <p className="fine">
        Ownership does not establish preparation or compatibility. Follow these
        exact lesson-specific notes. Optional parts are marked.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Qty</th>
              <th>Material</th>
              <th>Preparation / compatibility</th>
            </tr>
          </thead>
          <tbody>
            {lesson.materials.map((m) => (
              <tr key={m.part_id}>
                <td>{m.quantity}</td>
                <td>
                  {m.label}
                  {m.optional ? " (optional)" : ""}
                </td>
                <td>{m.compatibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Complete connection table</h3>
      <p className="fine">
        Use the full table alongside the diagram. Some original maps summarize
        only the first connections. Illustrations are not wiring instructions.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Check</th>
            </tr>
          </thead>
          <tbody>
            {h.connections.map((c, i) => (
              <tr key={i}>
                <td>{c.source}</td>
                <td>{c.destination}</td>
                <td>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="diagram-disclosure" open={printMode || undefined}>
        <summary>View the original reference diagram</summary>
        <img
          loading={printMode ? "eager" : "lazy"}
          src={assetPath(`assets/${lesson.id}-connection-map.png`)}
          alt={`${lesson.title}: original reference map. Use the complete connection table above for every endpoint.`}
        />
      </details>
      <h3>Build, one checked step at a time</h3>
      <ol className="build-actions">
        {actions.map((a) => (
          <li key={a.number}>
            <h4>{a.title}</h4>
            <p>{a.instruction}</p>
            {a.diagram && (
              <details open={printMode || undefined}>
                <summary>Reference for step {a.number}</summary>
                <img
                  loading={printMode ? "eager" : "lazy"}
                  src={assetPath(a.diagram)}
                  alt={`${lesson.id.toUpperCase()} step ${a.number}: ${a.title}. ${a.instruction}`}
                />
              </details>
            )}
          </li>
        ))}
      </ol>
      {h.code_path && (
        <section className="code-section">
          <h3>The matching sketch</h3>
          <p>
            Use this exact sketch with its specified board and connections.
            Host-mock logic checks are separate from actual board compilation
            and physical review.
          </p>
          <a
            className="button secondary"
            download
            href={assetPath(h.code_path)}
          >
            <Download size={17} /> Download sketch
          </a>
          {code && (
            <>
              <button
                className="button secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(code);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
                {copied ? "Copied" : "Copy code"}
              </button>
              <pre tabIndex={0}>
                <code>{code}</code>
              </pre>
            </>
          )}
        </section>
      )}
      <h3>Experiment and evidence</h3>
      <p>{lesson.experiment.starter}</p>
      <dl>
        <dt>Change only</dt>
        <dd>{lesson.experiment.variable}</dd>
        <dt>Keep the same</dt>
        <dd>{lesson.experiment.keep_constant}</dd>
        <dt>Observe</dt>
        <dd>{lesson.success.observable_check}</dd>
        <dt>Ask</dt>
        <dd>{lesson.success.explanation_check}</dd>
      </dl>
      <h3>After the experiment</h3>
      <p>{h.cleanup}</p>
      <details open={printMode || undefined}>
        <summary>Workshop pacing and support</summary>
        <p>
          Allow 5 minutes for the mystery, 5 for preparation, 17 for building,
          10 for experiments, 6 for explanation, 9 for hints or a remix, 5 for
          reflection, and 3 for cleanup. This is a flexible planning aid; stop
          earlier or return another day.
        </p>
        {Object.entries(h.support_modes).map(([k, v]) => (
          <p key={k}>
            <strong>{k}:</strong> {v}
          </p>
        ))}
      </details>
      <details open={printMode || undefined}>
        <summary>Physical review record</summary>
        <dl>
          <dt>Bench result</dt>
          <dd>{h.safety_review.bench_result}</dd>
          <dt>Reviewer and date</dt>
          <dd>Not recorded</dd>
          <dt>Release</dt>
          <dd>Blocked pending human reviews</dd>
        </dl>
        <p>
          Record exact board, supply, parts, sketch hash, toolchain, actual
          outcomes, source-to-diagram parity, accessibility findings, and
          reviewer/date before changing the release status.
        </p>
      </details>
    </div>
  );
}
