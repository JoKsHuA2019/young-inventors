"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { RotateCcw, Lightbulb, ArrowRight } from "lucide-react";
import {
  sensorReading,
  echoDistance,
  lampForThreshold,
  linkagePoints,
} from "@/lib/models";
function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <strong>
          {value}
          {unit}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </label>
  );
}
function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="preview-choice">
      <legend>{label}</legend>
      <div>
        {options.map((o) => (
          <button
            key={o}
            aria-pressed={value === o}
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Circuit({
  lit,
  open = false,
  parallel = false,
  second = true,
  reversed = false,
}: {
  lit: boolean;
  open?: boolean;
  parallel?: boolean;
  second?: boolean;
  reversed?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 500 230"
      role="img"
      aria-label={`Conceptual circuit: ${lit ? "light on" : "light off"}${parallel ? `, second branch ${second ? "on" : "off"}` : ""}. Each light has its own resistor.`}
    >
      <path
        d={`M80 145V65H390V170H80V155`}
        fill="none"
        stroke="#5b7162"
        strokeWidth="5"
      />
      <path d="M67 145H93M72 155H88" stroke="#31483d" strokeWidth="5" />
      <text x="40" y="138">
        +
      </text>
      <text x="20" y="205">
        battery
      </text>
      <rect
        x="180"
        y="51"
        width="48"
        height="28"
        rx="6"
        fill="#e6c487"
        stroke="#6d583a"
        strokeWidth="2"
      />
      <text x="160" y="35">
        resistor
      </text>
      <g transform={reversed ? "rotate(180 310 65)" : undefined}>
        <circle
          cx="310"
          cy="65"
          r="22"
          fill={lit ? "#ffd665" : "#e1ddcf"}
          stroke="#b28437"
          strokeWidth="3"
        />
        <path
          d="M302 60L316 65L302 70ZM316 55V75"
          fill="#735e37"
          stroke="#735e37"
          strokeWidth="2"
        />
      </g>
      {lit && (
        <circle
          cx="310"
          cy="65"
          r="34"
          fill="none"
          stroke="#f0c34e"
          strokeWidth="2"
          strokeDasharray="3 10"
        />
      )}
      {open && (
        <>
          <path d="M110 170H158" stroke="#faf6e9" strokeWidth="10" />
          <path d="M110 170L153 145" stroke="#5b7162" strokeWidth="5" />
          <text x="104" y="205">
            gap
          </text>
        </>
      )}
      {parallel && !lit && (
        <path d="M110 65H155" stroke="#faf6e9" strokeWidth="10" />
      )}
      {parallel && (
        <>
          <path d="M80 115H390" stroke="#5b7162" strokeWidth="5" />
          <rect
            x="180"
            y="101"
            width="48"
            height="28"
            rx="6"
            fill="#e6c487"
            stroke="#6d583a"
            strokeWidth="2"
          />
          <circle
            cx="310"
            cy="115"
            r="19"
            fill={second ? "#ffd665" : "#e1ddcf"}
            stroke="#b28437"
            strokeWidth="3"
          />
          {!second && (
            <path d="M110 115H155" stroke="#faf6e9" strokeWidth="10" />
          )}
          <text x="170" y="205">
            one resistor per branch
          </text>
        </>
      )}
    </svg>
  );
}
function Lever({ distance, angle = 12 }: { distance: number; angle?: number }) {
  return (
    <svg
      viewBox="0 0 500 230"
      role="img"
      aria-label={`Lever with push ${distance} cm from pivot and paper load 6 cm away.`}
    >
      <path d="M40 192H460" stroke="#d6cbb5" strokeWidth="3" />
      <path
        d="M172 185L200 115L228 185Z"
        fill="#acb58a"
        stroke="#536848"
        strokeWidth="2"
      />
      <g transform={`rotate(${-angle} 200 115)`}>
        <rect x="80" y="105" width="350" height="20" rx="7" fill="#c79864" />
        <rect x="85" y="76" width="32" height="29" fill="#f3ca75" />
        <path
          d={`M${200 + distance * 14} 45v42m-7-8l7 8 7-8`}
          fill="none"
          stroke="#355e4b"
          strokeWidth="4"
        />
      </g>
      <circle cx="200" cy="115" r="9" fill="#f9e8b6" stroke="#6a6447" />
      <text x="168" y="216">
        pivot
      </text>
      <text x="58" y="40">
        same paper load
      </text>
      <text x="300" y="205">
        push point: {distance} cm
      </text>
    </svg>
  );
}
function Linkage({ angle, short }: { angle: number; short: boolean }) {
  const p = linkagePoints(angle, short);
  const point = (a: number[]) => `${100 + a[0] * 21},${205 - a[1] * 16}`;
  return (
    <svg
      viewBox="0 0 500 260"
      role="img"
      aria-label="Conceptual four-bar linkage in a limited 30-degree input arc. The marker sits on the connecting link."
    >
      <path
        d={`M${point(p.A)}L${point(p.D)}`}
        stroke="#acb58a"
        strokeWidth="18"
      />
      {[
        ["A", "B"],
        ["B", "C"],
        ["C", "D"],
      ].map(([a, b], i) => (
        <path
          key={a}
          d={`M${point(p[a as keyof typeof p])}L${point(p[b as keyof typeof p])}`}
          stroke={["#d2a16e", "#8ba9a1", "#d6b252"][i]}
          strokeWidth="13"
          strokeLinecap="round"
        />
      ))}
      {["A", "B", "C", "D"].map((k) => (
        <circle
          key={k}
          cx={100 + p[k as keyof typeof p][0] * 21}
          cy={205 - p[k as keyof typeof p][1] * 16}
          r="7"
          fill="#fff9e9"
          stroke="#536848"
          strokeWidth="2"
        />
      ))}
      <circle
        cx={100 + p.M[0] * 21}
        cy={205 - p.M[1] * 16}
        r="5"
        fill="#bb644c"
      />
      <text x="20" y="30">
        small handle arc
      </text>
      <text x="220" y="30">
        red dot = marker
      </text>
      <text x="155" y="245">
        two fixed pivots
      </text>
    </svg>
  );
}
function Servo({ angle, bridge = false }: { angle: number; bridge?: boolean }) {
  return (
    <svg
      viewBox="0 0 500 230"
      role="img"
      aria-label={`Conceptual ${bridge ? "bridge" : "paper arm"} at ${angle} degrees, within the example 60–100 degree range.`}
    >
      <rect
        x="50"
        y="176"
        width="400"
        height="22"
        rx="5"
        fill={bridge ? "#a9c9cf" : "#dfd5be"}
      />
      <rect x="188" y="120" width="65" height="60" rx="8" fill="#80a09b" />
      <g transform={`rotate(${60 - angle} 220 120)`}>
        <rect x="215" y="106" width="160" height="22" rx="10" fill="#c99e6c" />
        {!bridge && (
          <path d="M340 110Q340 25 410 55Q405 108 340 110" fill="#92ad76" />
        )}
      </g>
      <circle cx="220" cy="120" r="12" fill="#f5d887" />
      <text x="40" y="37">
        command: {angle}°
      </text>
      <text x="266" y="217">
        adult-checked range
      </text>
    </svg>
  );
}
function Signal({
  lit,
  caption,
  period = 0,
}: {
  lit: boolean;
  caption: string;
  period?: number;
}) {
  return (
    <div className="signal-scene">
      <div
        className={`paper-lamp ${lit ? "lit" : ""} ${period ? "pulsing" : ""}`}
        style={period ? { animationDuration: `${period}ms` } : undefined}
      >
        <Lightbulb size={68} strokeWidth={1.4} />
      </div>
      <span>{caption}</span>
    </div>
  );
}
function Sensor({
  value,
  label,
  missing = false,
}: {
  value: number;
  label: string;
  missing?: boolean;
}) {
  return (
    <div className="sensor-scene">
      <div className="sensor-card">
        <span>EXAMPLE READING</span>
        <strong>{missing ? "?" : value}</strong>
        <small>{missing ? "No usable reading" : label}</small>
      </div>
      <div className="reading-bars" aria-hidden="true">
        {[0.82, 1, 0.93, 0.97, 0.86, 0.95].map((n, i) => (
          <i
            key={i}
            style={{
              height: missing
                ? "8%"
                : `${Math.max(8, Math.min(100, (value / 10) * n))}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
function Reaction() {
  const [phase, setPhase] = useState<
      "idle" | "waiting" | "cue" | "early" | "result"
    >("idle"),
    [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    start = useRef(0);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setPhase("idle");
  };
  const begin = () => {
    reset();
    setPhase("waiting");
    timer.current = setTimeout(
      () => {
        start.current = performance.now();
        setPhase("cue");
      },
      2000 + Math.random() * 3000,
    );
  };
  const press = () => {
    if (phase === "waiting") {
      if (timer.current) clearTimeout(timer.current);
      setPhase("early");
    } else if (phase === "cue") {
      setElapsed(Math.round(performance.now() - start.current));
      setPhase("result");
    }
  };
  return (
    <>
      <Signal
        lit={phase === "cue"}
        caption={
          phase === "waiting"
            ? "Wait for the light…"
            : phase === "cue"
              ? "Now!"
              : phase === "early"
                ? "An early press is a clue, too. Try waiting for the light."
                : phase === "result"
                  ? `${elapsed} ms in this browser. This is only an estimate.`
                  : "Ready to investigate a fair start?"
        }
      />
      <div className="preview-controls">
        <button
          className="button"
          onClick={
            phase === "idle" || phase === "early" || phase === "result"
              ? begin
              : press
          }
        >
          {phase === "waiting" || phase === "cue"
            ? "Press the button"
            : "Start a turn"}
        </button>
        <button className="button secondary" onClick={reset}>
          Reset game
        </button>
      </div>
      <p className="fine">
        Click or use Enter/Space after releasing the key. The physical board has
        its own timing and debounce behavior.
      </p>
    </>
  );
}
export default function Preview({ kind }: { kind: string }) {
  const [v, setV] = useState(50),
    [n, setN] = useState(500),
    [on, setOn] = useState(false),
    [other, setOther] = useState(false),
    [choice, setChoice] = useState(""),
    [text, setText] = useState(""),
    [pattern, setPattern] = useState<string[]>([]),
    [playing, setPlaying] = useState(false),
    [flash, setFlash] = useState(false),
    [auto, setAuto] = useState(false);
  useEffect(() => {
    if (!playing || !pattern.length) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = 0;
    for (const part of pattern) {
      timers.push(setTimeout(() => setFlash(true), at));
      at += part === "long" ? 900 : 300;
      timers.push(setTimeout(() => setFlash(false), at));
      at += 300;
    }
    timers.push(setTimeout(() => setPlaying(false), at));
    return () => timers.forEach(clearTimeout);
  }, [playing, pattern]);
  useEffect(() => {
    if (!auto || kind !== "creature") return;
    const t = setInterval(() => setOn((x) => !x), n);
    return () => clearInterval(t);
  }, [auto, kind, n]);
  let scene: ReactNode = null,
    controls: ReactNode = null,
    notice = "";
  const reset = () => {
    setV(50);
    setN(500);
    setOn(false);
    setOther(false);
    setChoice("");
    setText("");
    setPattern([]);
    setPlaying(false);
    setFlash(false);
    setAuto(false);
  };
  if (
    [
      "circuit",
      "flap",
      "polarity",
      "materials",
      "parallel",
      "picture",
      "repair",
    ].includes(kind)
  ) {
    let lit = on;
    if (kind === "polarity") lit = !on;
    if (kind === "materials") lit = ["Paperclip", "Foil"].includes(choice);
    if (kind === "parallel") lit = !on;
    if (kind === "repair") lit = choice === "Restore the loose return";
    if (kind === "picture") lit = true;
    scene = (
      <Circuit
        lit={lit}
        open={["circuit", "flap"].includes(kind) && !on}
        reversed={kind === "polarity" && on}
        parallel={kind === "parallel"}
        second={!other}
      />
    );
    if (kind === "circuit" || kind === "flap") {
      controls = (
        <button className="button" onClick={() => setOn(!on)}>
          {on
            ? kind === "flap"
              ? "Open the flap"
              : "Open one wire"
            : kind === "flap"
              ? "Close the flap"
              : "Close the path"}
        </button>
      );
      notice = on
        ? "The path is complete in this model. Follow it all the way around."
        : "There is a gap. Where would the path need to continue?";
    }
    if (kind === "polarity") {
      controls = (
        <button className="button" onClick={() => setOn(!on)}>
          Turn the LED around
        </button>
      );
      notice = on
        ? "This orientation leaves the light dark in our 3 V example."
        : "This orientation lights the LED. The resistor stays in place.";
    }
    if (kind === "materials") {
      controls = (
        <Choice
          label="Choose a test object"
          value={choice}
          options={["Paperclip", "Plastic lid", "Foil", "Dry wood"]}
          onChange={setChoice}
        />
      );
      notice = choice
        ? `${choice}: ${lit ? "the model shows a conducting path" : "the model stays dark"}. Your actual tester and connections still need checking.`
        : "Predict first, then choose an object. These are illustrative outcomes.";
    }
    if (kind === "parallel") {
      controls = (
        <>
          <button className="button" onClick={() => setOn(!on)}>
            {on ? "Restore" : "Open"} the first branch
          </button>
          <button className="button secondary" onClick={() => setOther(!other)}>
            {other ? "Restore" : "Open"} the second branch
          </button>
        </>
      );
      notice =
        "Each branch has its own resistor. One can work while the other is open.";
    }
    if (kind === "picture") {
      controls = (
        <Choice
          label="Where will your light belong?"
          value={choice}
          options={["A cabin window", "A star", "A cave entrance"]}
          onChange={setChoice}
        />
      );
      notice = choice
        ? `Your light will belong in ${choice.toLowerCase()}. Sketch how the paper can sit around it without pulling the wires.`
        : "Choose a setting, then sketch the picture around a complete circuit.";
    }
    if (kind === "repair") {
      controls = (
        <Choice
          label="Investigate the example fault"
          value={choice}
          options={[
            "Inspect the resistor",
            "Inspect LED direction",
            "Inspect the return",
            "Restore the loose return",
          ]}
          onChange={setChoice}
        />
      );
      notice =
        choice === "Inspect the resistor"
          ? "The 220 Ω resistor is still in series. Keep it there."
          : choice === "Inspect LED direction"
            ? "The marked anode faces the resistor. This example’s LED direction matches the reference."
            : choice === "Inspect the return"
              ? "You find a loose return lead. Predict what restoring only that lead would do."
              : lit
                ? "Restoring only the return lights this example. What evidence supports your diagnosis?"
                : "This example contains one open return lead. Inspect before choosing a repair; the real fault may differ.";
    }
  } else if (kind === "lever") {
    const distance = on ? 14 : 6;
    scene = <Lever distance={distance} />;
    controls = (
      <Choice
        label="Choose a push spot"
        value={on ? "14 cm from pivot" : "6 cm from pivot"}
        options={["6 cm from pivot", "14 cm from pivot"]}
        onChange={(s) => setOn(s.startsWith("14"))}
      />
    );
    notice = on
      ? "Farther out, the ideal lever needs less effort but more hand travel for the same lift."
      : "With equal 6 cm arms, ideal effort and load forces are similar. Real friction and bending matter.";
  } else if (kind === "linkage" || kind === "copy") {
    scene = <Linkage angle={35 + v * 0.3} short={on} />;
    controls = (
      <>
        <Range
          label="Handle position within a 30° arc"
          value={v}
          onChange={setV}
        />
        <button className="button secondary" onClick={() => setOn(!on)}>
          {on ? "Restore reference" : "Try alternate"} link geometry
        </button>
      </>
    );
    notice = `${on ? "Alternate" : "Reference"} geometry. Compare the marker position at the same handle setting. This conceptual model does not establish physical clearance.`;
  } else if (["servo", "dial", "bridge", "creature"].includes(kind)) {
    const angle = kind === "dial" ? Math.round(60 + v * 0.4) : on ? 100 : 60;
    scene = <Servo angle={angle} bridge={kind === "bridge"} />;
    controls =
      kind === "dial" ? (
        <Range label="Dial position" value={v} onChange={setV} />
      ) : (
        <>
          <button className="button" onClick={() => setOn(!on)}>
            {kind === "bridge"
              ? on
                ? "Release button"
                : "Press button"
              : "Try the other position"}
          </button>
          {kind === "creature" && (
            <>
              <Range
                label="Pause between moves"
                value={n}
                min={250}
                max={1500}
                step={250}
                unit=" ms"
                onChange={setN}
              />
              <button
                className="button secondary"
                onClick={() => setAuto(!auto)}
              >
                {auto ? "Pause the gesture" : "Watch this gesture"}
              </button>
            </>
          )}
        </>
      );
    notice =
      kind === "creature"
        ? `Try waiting ${n} ms between the two positions. Act out the gesture before changing the physical code.`
        : "The example uses 60° and 100° limits. Your helper must check the real mechanism and external servo supply.";
  } else if (["blink", "traffic", "button", "pwm", "signal"].includes(kind)) {
    if (kind === "blink") {
      scene = <Signal lit caption={`${n} ms on, ${n} ms off`} period={n * 2} />;
      controls = (
        <Range
          label="Each wait"
          value={n}
          min={250}
          max={1500}
          step={250}
          unit=" ms"
          onChange={setN}
        />
      );
      notice =
        "Shorter waits make the whole repeating pattern quicker. With reduced motion, use the timing labels.";
    }
    if (kind === "traffic") {
      scene = (
        <div className="traffic-scene">
          {["red", "green", "yellow"].map((c, i) => (
            <div key={c}>
              <i style={{ background: ["#b95d4b", "#507959", "#d7ad35"][i] }} />
              <span>{c}</span>
              <strong>{[2000, n, 1000][i]} ms</strong>
            </div>
          ))}
        </div>
      );
      controls = (
        <Range
          label="Green wait"
          value={n}
          min={500}
          max={4000}
          step={500}
          unit=" ms"
          onChange={setN}
        />
      );
      notice = `The order stays red, green, yellow. This example cycle takes ${3000 + n} ms.`;
    }
    if (kind === "button") {
      scene = (
        <Signal
          lit={on}
          caption={`Input D2: ${on ? "LOW" : "HIGH"} → output D9: ${on ? "HIGH" : "LOW"}`}
        />
      );
      controls = (
        <button className="button" aria-pressed={on} onClick={() => setOn(!on)}>
          {on ? "Release the button" : "Press the button"}
        </button>
      );
      notice =
        "INPUT_PULLUP holds the released input HIGH. Pressing connects it to GND. Code maps LOW to light on.";
    }
    if (kind === "pwm") {
      scene = (
        <div className="pwm-scene">
          <div style={{ opacity: 0.25 + (v / 255) * 0.75 }}>
            <Signal lit={v > 0} caption={`${v} of 255`} />
          </div>
          <div className="pulse-bar">
            <i style={{ width: `${(v / 255) * 100}%` }} />
          </div>
        </div>
      );
      controls = (
        <Range label="PWM value" value={v} min={0} max={255} onChange={setV} />
      );
      notice = `Approximately ${Math.round((v / 255) * 100)}% on-time. The bar shows the fraction; actual perceived brightness varies.`;
    }
    if (kind === "signal") {
      scene = (
        <div>
          <Signal
            lit={flash}
            caption={
              playing
                ? "Watch the short and long flashes."
                : "Give your pattern a try."
            }
          />
          <div
            className="message-pattern"
            aria-label={pattern.length ? pattern.join(", ") : "No signals yet"}
          >
            {pattern.length ? (
              pattern.map((s, i) => (
                <span key={i} className={s === "long" ? "long" : ""} />
              ))
            ) : (
              <p>Your message starts with a flash.</p>
            )}
          </div>
        </div>
      );
      controls = (
        <>
          <button
            className="button"
            disabled={pattern.length >= 8}
            onClick={() => setPattern([...pattern, "short"])}
          >
            Add a short flash
          </button>
          <button
            className="button secondary"
            disabled={pattern.length >= 8}
            onClick={() => setPattern([...pattern, "long"])}
          >
            Add a long flash
          </button>
          <button
            className="text-button"
            disabled={!pattern.length}
            onClick={() => {
              setPlaying(false);
              setFlash(false);
              setPattern(pattern.slice(0, -1));
            }}
          >
            Undo last flash
          </button>
          <button
            className="button"
            disabled={!pattern.length || playing}
            onClick={() => setPlaying(true)}
          >
            {playing ? "Playing your message…" : "Play my message"}
          </button>
        </>
      );
      notice = pattern.length
        ? `${pattern.map((s) => (s === "long" ? "long" : "short")).join(", ")}. Agree what this means, then ask a partner to repeat it.`
        : "Use up to eight flashes. Different patterns can carry different messages.";
    }
  } else if (kind === "reaction") {
    return (
      <div className="preview-box">
        <div className="preview-heading">
          <span>TRY A LITTLE MODEL</span>
          <span>Screen experiment</span>
        </div>
        <Reaction />
        <p className="model-note">
          Learning illustration, not a physical test. Your real observation
          belongs in the next experiment.
        </p>
      </div>
    );
  } else if (
    [
      "shade",
      "threshold",
      "distance",
      "parking",
      "temperature",
      "box",
    ].includes(kind)
  ) {
    let reading = sensorReading(v),
      unknown = false,
      label = "relative sensor units";
    if (kind === "distance" || kind === "parking") {
      const distance = echoDistance(v, on);
      unknown = distance === null;
      reading = distance || 0;
      label = "cm (example)";
      scene = (
        <Sensor
          value={reading}
          label={unknown ? "unknown" : "cm (example)"}
          missing={unknown}
        />
      );
      controls = (
        <>
          <Range
            label="Target distance"
            min={5}
            max={100}
            value={v}
            unit=" cm"
            onChange={setV}
          />
          <button
            className="button secondary"
            aria-pressed={on}
            onClick={() => setOn(!on)}
          >
            {on ? "Return a usable echo" : "Try a missing echo"}
          </button>
        </>
      );
      notice = unknown
        ? "Unknown distance. A missing echo is not zero and an off light cannot mean “all clear”."
        : kind === "parking"
          ? `${v} cm: LED changes state every ${v < 25 ? 150 : v < 50 ? 400 : 800} ms in this example. Closer targets give faster flashes.`
          : `An echo returns from ${v} cm away. The sound travels there and back.`;
    } else if (kind === "temperature") {
      reading =
        choice === "A tiny, unclear change"
          ? 502
          : choice === "After letting go"
            ? 515
            : choice === "Gentle warming"
              ? 540
              : 500;
      scene = <Sensor value={reading} label="relative units, not degrees" />;
      controls = (
        <Choice
          label="Look at an example sequence"
          value={choice || "Room readings"}
          options={[
            "Room readings",
            "Gentle warming",
            "After letting go",
            "A tiny, unclear change",
          ]}
          onChange={setChoice}
        />
      );
      notice =
        choice === "A tiny, unclear change"
          ? "500, 503, 501, 502: this change may overlap normal variation. It is fine to report “too small to tell”."
          : `${reading - 3}, ${reading}, ${reading + 2}: sample readings only. Gently touch only the helper-verified dry, insulated bead; no heating devices.`;
    } else {
      if (kind === "box")
        reading = on ? (other ? 180 : 800) : other ? 120 : 200;
      scene = <Sensor value={reading} label={label} />;
      controls = (
        <>
          {kind === "box" ? (
            <>
              <button className="button" onClick={() => setOn(!on)}>
                {on ? "Close" : "Open"} the box
              </button>
              <button
                className="button secondary"
                onClick={() => setOther(!other)}
              >
                {other ? "Try a bright room" : "Try a dark room"}
              </button>
            </>
          ) : (
            <Range
              label="Paper cloud coverage"
              value={v}
              onChange={setV}
              unit="%"
            />
          )}
          {kind !== "shade" && (
            <Range
              label="Decision threshold"
              value={n}
              min={100}
              max={900}
              step={50}
              onChange={setN}
            />
          )}
        </>
      );
      notice =
        kind === "shade"
          ? "More shade usually means a lower reading for this divider orientation. Compare groups of real readings."
          : `${kind === "box" ? "Box alert" : "Night-light"} is ${lampForThreshold(reading, n, kind === "box") ? "ON" : "OFF"}: ${reading} ${kind === "box" ? ">" : "<"} ${n} is ${lampForThreshold(reading, n, kind === "box") ? "true" : "false"}. ${kind === "box" ? "The sensor follows light, not the lid." : "Choose a threshold between your actual light and shade readings."}`;
    }
  } else if (kind === "mystery") {
    scene = (
      <div className="mystery-scene">
        <div className="paper-box">
          <span>?</span>
          <div className={`paper-tab ${on ? "pushed" : ""}`} />
        </div>
      </div>
    );
    controls = (
      <>
        <button className="button" aria-pressed={on} onClick={() => setOn(!on)}>
          {on ? "Let go of the tab" : "Push the tab gently"}
        </button>
        <Choice
          label="Which explanation would you investigate?"
          value={choice}
          options={["A return mechanism", "A tab that stays put"]}
          onChange={setChoice}
        />
      </>
    );
    notice = on
      ? "The tab moves inward. Predict what will happen when you let go."
      : "In this example, the tab returns. That supports a return mechanism, but does not prove exactly which parts are inside.";
  } else if (kind === "handles") {
    scene = (
      <div className="handle-scene">
        <div
          className={`paper-handle ${choice === "A loop" ? "loop" : choice === "A wide tab" ? "wide" : ""}`}
        />
        <span>A paper flap waiting for a comfortable grip</span>
      </div>
    );
    controls = (
      <Choice
        label="Choose a handle to prototype"
        value={choice}
        options={["A small tab", "A wide tab", "A loop"]}
        onChange={setChoice}
      />
    );
    notice = choice
      ? `Try ${choice.toLowerCase()} on your real flap. Ask a partner for three gentle openings and their feedback. The screen cannot decide what is comfortable for them.`
      : "There can be more than one useful design. Pick two to compare with a partner.";
  } else if (kind === "invention") {
    scene = (
      <div className="kit-scene">
        {[
          "Cardboard",
          "Paper",
          "Tape",
          "String",
          "Covered fastener",
          "Marker",
        ].map((m, i) => (
          <span key={m}>
            <b>0{i + 1}</b>
            {m}
          </span>
        ))}
      </div>
    );
    controls = (
      <>
        <Choice
          label="What will your prototype do?"
          value={choice}
          options={[
            "Hold a paper flag",
            "Support a card",
            "Move a paper creature",
          ]}
          onChange={setChoice}
        />
        <label className="field">
          What would count as a successful test?
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="For example: stay standing for ten seconds"
          />
        </label>
      </>
    );
    notice = text
      ? `Your test: ${text}. Keep this test the same when comparing two real versions.`
      : "Choose a function, then a result you can actually observe. Drawing a plan on paper works too.";
  } else if (kind === "expo") {
    scene = (
      <div className="expo-scene">
        {(on
          ? ["My first idea", "What happened", "What I changed"]
          : ["What I changed", "My first idea", "What happened"]
        ).map((s, i) => (
          <div key={s}>
            <span>{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
    );
    controls = (
      <>
        <button className="button" onClick={() => setOn(!on)}>
          Try another story order
        </button>
        <label className="field">
          What would you like your listener to notice?
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="A change, a mechanism, or an unexpected result"
          />
        </label>
      </>
    );
    notice =
      "Try explaining your invention in either order. Choose the one that helps your listener follow the evidence. No public post is needed.";
  }
  return (
    <div className="preview-box" data-preview={kind}>
      <div className="preview-heading">
        <span>TRY A LITTLE MODEL</span>
        <button onClick={reset} className="reset-button">
          <RotateCcw size={15} /> Reset
        </button>
      </div>
      <div className="preview-scene">{scene}</div>
      <div className="preview-controls">{controls}</div>
      <p className="preview-notice" aria-live="polite">
        <ArrowRight size={18} />
        <span>{notice}</span>
      </p>
      <p className="model-note">
        Learning illustration, not an electrical simulator or physical test.
        Record your own build’s results separately.
      </p>
    </div>
  );
}
