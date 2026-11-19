"use client";
import { useEffect, useRef, useState } from "react";
import { Pencil, Eraser, Undo2, Redo2, Circle, Trash2 } from "lucide-react";
import { palette, type Drawing, type Stroke } from "@/lib/creative";
import { readDrawing, writeDrawing } from "@/lib/drawings";
import { useWorkshop } from "./WorkshopProvider";

export function DrawingView({
  drawing,
  label = "A saved invention drawing",
}: {
  drawing: Drawing;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 600 360"
      role="img"
      aria-label={label}
      className="drawing-paper"
    >
      <rect width="600" height="360" fill="#fffdf7" />
      {drawing.strokes.map((s, i) => (
        <polyline
          key={i}
          points={s.points.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={s.color}
          strokeWidth={s.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
export function SavedDrawing({ id }: { id: string }) {
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setDrawing(null);
    setFailed(false);
    readDrawing(id)
      .then((d) => {
        if (active) {
          setDrawing(d);
          setFailed(!d);
        }
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [id]);
  return drawing ? (
    <DrawingView drawing={drawing} />
  ) : (
    <p className="fine">
      {failed
        ? "This drawing couldn’t open here. Your written idea is still below."
        : "Opening your drawing…"}
    </p>
  );
}
export default function DrawingPad({ lessonId }: { lessonId: string }) {
  const { creative, editCreative, ready, error } = useWorkshop();
  const [strokes, setStrokes] = useState<Stroke[]>([]),
    [redo, setRedo] = useState<Stroke[]>([]);
  const [color, setColor] = useState(palette[0]),
    [width, setWidth] = useState(7),
    [eraser, setEraser] = useState(false);
  const [loaded, setLoaded] = useState(false),
    [failed, setFailed] = useState(false),
    [message, setMessage] = useState("Opening your drawing…"),
    [confirm, setConfirm] = useState(false);
  const [x, setX] = useState(300),
    [y, setY] = useState(180);
  const svg = useRef<SVGSVGElement>(null),
    active = useRef<Stroke | null>(null),
    pointer = useRef<number | null>(null),
    revision = useRef(0);
  const target = useRef(creative.drafts[lessonId] || `draft-${lessonId}`);
  const [ink, setInk] = useState<Stroke | null>(null);
  useEffect(() => {
    if (!ready) return;
    let live = true;
    target.current = creative.drafts[lessonId] || `draft-${lessonId}`;
    readDrawing(target.current)
      .then((d) => {
        if (live) {
          setStrokes(d?.strokes || []);
          setLoaded(true);
          setMessage(
            d
              ? "Your drawing is ready for another idea."
              : "A fresh page. What might you invent?",
          );
        }
      })
      .catch(() => {
        if (live) {
          setFailed(true);
          setMessage(
            "Your drawing storage couldn’t open. Keep any other workshop tabs open while you check your copies.",
          );
        }
      });
    return () => {
      live = false;
    };
    // The mounted pad owns its draft; a saved attempt is a separate snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, lessonId]);
  const save = (next: Stroke[]) => {
    if (
      next.length > 300 ||
      next.reduce((sum, s) => sum + s.points.length, 0) > 20000
    ) {
      setMessage(
        "This page has lots of lovely marks. Save it to your shelf, then clear the pad for a new idea.",
      );
      return;
    }
    setStrokes(next);
    const version = ++revision.current;
    setMessage("Putting your drawing away…");
    void writeDrawing(target.current, { version: 1, strokes: next })
      .then(() => {
        if (version === revision.current)
          setMessage("Drawing saved on this device.");
      })
      .catch(() => {
        if (version === revision.current)
          setMessage(
            "This drawing is staying in this tab for now. Save a complete workshop copy before leaving.",
          );
      });
    editCreative((c) => ({
      ...c,
      drafts: { ...c.drafts, [lessonId]: target.current },
    }));
  };
  const point = (
    event: React.PointerEvent<SVGSVGElement>,
  ): [number, number] => {
    const rect = svg.current!.getBoundingClientRect();
    return [
      Math.round(
        Math.max(
          0,
          Math.min(600, ((event.clientX - rect.left) / rect.width) * 600),
        ),
      ),
      Math.round(
        Math.max(
          0,
          Math.min(360, ((event.clientY - rect.top) / rect.height) * 360),
        ),
      ),
    ];
  };
  const finish = (event: React.PointerEvent<SVGSVGElement>) => {
    if (pointer.current !== event.pointerId || !active.current) return;
    const s = active.current;
    active.current = null;
    pointer.current = null;
    setInk(null);
    setRedo([]);
    save([...strokes, s]);
  };
  const addShape = (circle: boolean) => {
    const points: [number, number][] = circle
      ? Array.from({ length: 33 }, (_, i) => [
          Math.round(x + 30 * Math.cos((i / 32) * Math.PI * 2)),
          Math.round(y + 30 * Math.sin((i / 32) * Math.PI * 2)),
        ])
      : [
          [x - 30, y],
          [x + 30, y],
        ];
    setRedo([]);
    save([...strokes, { color, width, points }]);
  };
  return (
    <section className="creative-card drawing-pad" aria-label="My drawing pad">
      <div className="creative-heading">
        <Pencil size={23} />
        <div>
          <span className="eyebrow">A LITTLE ROOM FOR YOUR IDEAS</span>
          <h3>Draw what you’re imagining</h3>
        </div>
      </div>
      <p>
        A tiny sketch, a big question, or a creature with a very unusual hat.
        You can draw here, on paper, or describe your idea in the notebook.
      </p>
      {failed && !loaded && (
        <button
          className="button secondary"
          onClick={() => {
            target.current = `drawing-${crypto.randomUUID()}`;
            setLoaded(true);
            setMessage(
              "A fresh page for this tab. Save a workshop copy to keep it.",
            );
          }}
        >
          Draw on a fresh page in this tab
        </button>
      )}
      <div className="drawing-tools" role="group" aria-label="Drawing tools">
        <button
          className="small-control"
          aria-pressed={!eraser}
          onClick={() => setEraser(false)}
        >
          <Pencil size={17} /> Pencil
        </button>
        <button
          className="small-control"
          aria-pressed={eraser}
          onClick={() => setEraser(true)}
        >
          <Eraser size={17} /> Eraser
        </button>
        <div className="pencil-colors" role="group" aria-label="Pencil colors">
          {palette.slice(0, -1).map((c, i) => (
            <button
              key={c}
              style={{ "--pencil-color": c } as React.CSSProperties}
              aria-label={
                [
                  "Forest green",
                  "Rust red",
                  "Golden brown",
                  "Pond blue",
                  "Berry purple",
                ][i]
              }
              aria-pressed={c === color && !eraser}
              onClick={() => {
                setColor(c);
                setEraser(false);
              }}
            />
          ))}
        </div>
        <label>
          Line size{" "}
          <select
            aria-label="Pencil line size"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
          >
            <option value={3}>Fine</option>
            <option value={7}>Medium</option>
            <option value={13}>Chunky</option>
          </select>
        </label>
      </div>
      <svg
        ref={svg}
        viewBox="0 0 600 360"
        role="img"
        aria-label="Drawing surface. Use a pointer to draw, or use the shape buttons below."
        className="drawing-paper drawing-surface"
        aria-disabled={!loaded}
        onPointerDown={(e) => {
          if (!loaded || pointer.current !== null || e.button !== 0) return;
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          pointer.current = e.pointerId;
          const p = point(e);
          active.current = {
            color: eraser ? palette[5] : color,
            width: eraser ? 24 : width,
            points: [p, [Math.min(600, p[0] + 0.01), p[1]]],
          };
          setInk({ ...active.current });
        }}
        onPointerMove={(e) => {
          if (
            pointer.current !== e.pointerId ||
            !active.current ||
            active.current.points.length >= 4000
          )
            return;
          active.current.points.push(point(e));
          setInk({ ...active.current, points: [...active.current.points] });
        }}
        onPointerUp={finish}
        onPointerCancel={finish}
      >
        <rect width="600" height="360" fill="#fffdf7" />
        {[...strokes, ...(ink ? [ink] : [])].map((s, i) => (
          <polyline
            key={i}
            points={s.points.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="drawing-tools">
        <button
          className="small-control"
          disabled={!loaded || !strokes.length}
          onClick={() => {
            setRedo([...redo, strokes.at(-1)!]);
            save(strokes.slice(0, -1));
          }}
        >
          <Undo2 size={17} /> Undo
        </button>
        <button
          className="small-control"
          disabled={!loaded || !redo.length}
          onClick={() => {
            save([...strokes, redo.at(-1)!]);
            setRedo(redo.slice(0, -1));
          }}
        >
          <Redo2 size={17} /> Redo
        </button>
        <button
          className="text-button"
          disabled={!strokes.length}
          onClick={() => setConfirm(true)}
        >
          <Trash2 size={16} /> Clear this drawing
        </button>
      </div>
      {confirm && (
        <div className="gentle-confirm">
          <p>
            Start with a fresh page? Drawings already saved on your shelf will
            stay.
          </p>
          <button
            className="button secondary"
            onClick={() => {
              setRedo(strokes);
              save([]);
              setConfirm(false);
            }}
          >
            Clear the drawing pad
          </button>
          <button className="text-button" onClick={() => setConfirm(false)}>
            Keep drawing
          </button>
        </div>
      )}
      <details>
        <summary>Make a picture with shape buttons</summary>
        <p>
          Move the spot, then add a circle or line. These controls also work
          with a keyboard.
        </p>
        <label className="field">
          Across the page
          <input
            type="range"
            min={35}
            max={565}
            value={x}
            onChange={(e) => setX(+e.target.value)}
          />
        </label>
        <label className="field">
          Down the page
          <input
            type="range"
            min={35}
            max={325}
            value={y}
            onChange={(e) => setY(+e.target.value)}
          />
        </label>
        <div className="button-row">
          <button
            className="button secondary"
            disabled={!loaded}
            onClick={() => addShape(true)}
          >
            <Circle size={17} /> Add a circle
          </button>
          <button
            className="button secondary"
            disabled={!loaded}
            onClick={() => addShape(false)}
          >
            Add a line
          </button>
        </div>
      </details>
      <p className="creative-status" role="status">
        {message}
        {error && loaded
          ? " Your notebook links are staying in this tab; save a workshop copy before leaving."
          : ""}
      </p>
    </section>
  );
}
