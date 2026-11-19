"use client";
import { useState } from "react";
import { Search, Leaf, RotateCcw, Lightbulb } from "lucide-react";
import { pilots } from "@/lib/pilots";
import { newInvestigation } from "@/lib/creative";
import { useWorkshop } from "./WorkshopProvider";
import { FriendNote } from "./CreativeWorkshop";
const circuitClues = [
  "The battery supplies the little circuit. Both ends need a connection in the loop.",
  "The 220 Ω resistor stays in the path to limit current. We don’t remove it for this test.",
  "This LED keeps the same direction in every try. Its light tells us something about the complete path.",
  "Opening just the return leaves a gap. Restoring that connection completes this model’s path again.",
];

export default function InvestigationScene({ lessonId }: { lessonId: string }) {
  const { creative, investigate, editCreative } = useWorkshop();
  const pilot = pilots[lessonId];
  const saved = creative.investigations[lessonId] || newInvestigation();
  const [connection, setConnection] = useState<"closed" | "open" | "restored">(
    "closed",
  );
  const [push, setPush] = useState<"near" | "far">("near"),
    [lift, setLift] = useState(false),
    [pressed, setPressed] = useState(false);
  const [clue, setClue] = useState(""),
    [message, setMessage] = useState(""),
    [reset, setReset] = useState(false);
  if (!pilot) return null;
  const circuit = lessonId === "c01",
    lever = lessonId === "m01";
  const choices = circuit
    ? [
        "The light will go dark.",
        "The light will keep shining.",
        "I’m not sure yet.",
      ]
    : lever
      ? [
          "The near spot will feel easier.",
          "The far spot will feel easier.",
          "I’m not sure yet.",
        ]
      : [
          "The tab will come back.",
          "The tab will stay where I leave it.",
          "I’m not sure yet.",
        ];
  const notice = (text: string) => {
    setClue(text);
    investigate(lessonId, {
      clues: [...new Set([...saved.clues, text])].slice(-20),
    });
  };
  const record = (text: string) => {
    investigate(lessonId, { trials: [...saved.trials, text].slice(-20) });
    setMessage(
      "A screen clue is tucked into this investigation. Your real experiment gets its own notes.",
    );
    if (saved.trials.length)
      editCreative((c) => ({
        ...c,
        keepsakes: {
          ...c.keepsakes,
          [lessonId]: [
            ...new Set([
              ...(c.keepsakes[lessonId] || []),
              "Two tries compared",
            ]),
          ],
        },
      }));
  };
  return (
    <details className="creative-card investigation">
      <summary>
        <span className="eyebrow">A LITTLE MYSTERY TO TRY</span>
        <span className="investigation-title">
          <Search size={22} />
          {pilot.title}
        </span>
        <span className="summary-hint">
          Open a scene, try an idea, and look for a clue.
        </span>
      </summary>
      <div className="investigation-body">
        <p>
          {circuit
            ? "Mouse’s tent needs a light. What happens if its path has a gap?"
            : lever
              ? "Fox has two places to push. Let’s lift the same paper load to the same little mark."
              : "Fox’s box has a tab on the outside and a secret on the inside. What can we discover before peeking?"}
        </p>
        <fieldset className="scene-guess">
          <legend>What do you think will happen?</legend>
          {choices.map((v) => (
            <label key={v}>
              <input
                type="radio"
                name={`scene-guess-${lessonId}`}
                checked={saved.guess === v}
                onChange={() => {
                  if (saved.guess && saved.guess !== v)
                    editCreative((c) => ({
                      ...c,
                      keepsakes: {
                        ...c.keepsakes,
                        [lessonId]: [
                          ...new Set([
                            ...(c.keepsakes[lessonId] || []),
                            "An idea revised",
                          ]),
                        ],
                      },
                    }));
                  investigate(lessonId, { guess: v });
                }}
              />
              {v}
            </label>
          ))}
        </fieldset>
        <div className="woodland-scene">
          {circuit ? (
            <svg
              viewBox="0 0 600 330"
              role="img"
              aria-label={`Mouse’s conceptual light circuit, return ${connection}; light ${connection === "open" ? "off" : "on"}. Resistor remains in series.`}
            >
              <rect
                x="1"
                y="1"
                width="598"
                height="328"
                rx="22"
                fill="#eff0df"
              />
              <path
                d="M372 218L464 55l90 163z"
                fill="#dfbd86"
                stroke="#876d45"
                strokeWidth="3"
              />
              <path d="M464 55v163h-65z" fill="#faf1d8" />
              <path
                d="M105 225V90H420V245H350M250 245H105V225"
                fill="none"
                stroke="#52755c"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {connection !== "open" ? (
                <path d="M250 245H350" stroke="#52755c" strokeWidth="7" />
              ) : (
                <>
                  <circle cx="250" cy="245" r="7" fill="#b26846" />
                  <circle cx="350" cy="245" r="7" fill="#b26846" />
                </>
              )}
              <rect
                x="75"
                y="138"
                width="60"
                height="70"
                rx="9"
                fill="#c0cfaa"
                stroke="#52755c"
                strokeWidth="3"
              />
              <text x="105" y="165" textAnchor="middle">
                +
              </text>
              <text x="105" y="193" textAnchor="middle">
                −
              </text>
              <rect
                x="210"
                y="78"
                width="70"
                height="24"
                rx="7"
                fill="#eac68c"
                stroke="#86623e"
                strokeWidth="3"
              />
              <path
                d="M230 79v22m13-22v22m13-22v22"
                stroke="#8e4d35"
                strokeWidth="4"
              />
              {connection !== "open" && (
                <circle cx="420" cy="148" r="43" fill="#f3d578" opacity=".5" />
              )}
              <circle
                cx="420"
                cy="148"
                r="19"
                fill={connection === "open" ? "#c6baaa" : "#ebbe4f"}
                stroke="#75603f"
                strokeWidth="3"
              />
              <text x="107" y="284" textAnchor="middle">
                battery
              </text>
              <text x="245" y="59" textAnchor="middle">
                220 Ω resistor
              </text>
              <text x="300" y="283" textAnchor="middle">
                {connection === "open" ? "a gap in the return" : "a way back"}
              </text>
              <text x="477" y="154">
                LED
              </text>
            </svg>
          ) : lever ? (
            <svg
              viewBox="0 0 600 330"
              role="img"
              aria-label={`Fixed pivot with ${push} push ${push === "near" ? 6 : 14} centimeters away. ${lift ? "Load reaches the same target; far hand travels farther." : "Load at the starting position."}`}
            >
              <rect width="600" height="330" rx="22" fill="#eff0df" />
              <rect
                x="65"
                y="260"
                width="470"
                height="20"
                rx="8"
                fill="#c4b78f"
              />
              <path
                d="M220 190l-36 70h72z"
                fill="#b0c49e"
                stroke="#638063"
                strokeWidth="3"
              />
              <path
                d="M65 153h90"
                stroke="#87632a"
                strokeWidth="3"
                strokeDasharray="7 6"
              />
              <text x="75" y="125">
                same lift target
              </text>
              <g transform={`rotate(${lift ? 18 : 0} 220 190)`}>
                <rect
                  x="100"
                  y="181"
                  width="400"
                  height="18"
                  rx="7"
                  fill="#ce9f70"
                  stroke="#926f48"
                  strokeWidth="3"
                />
                <path d="M80 180l-6-35 27 16 26-16-7 35" fill="#d79b6d" />
                <circle cx="90" cy="173" r="2.5" fill="#293e33" />
                <circle cx="110" cy="173" r="2.5" fill="#293e33" />
                <circle cx="100" cy="190" r="5" fill="#355b46" />
                <circle
                  cx="340"
                  cy="190"
                  r="9"
                  fill={push === "near" ? "#b14c32" : "#fff4dd"}
                />
                <circle
                  cx="500"
                  cy="190"
                  r="9"
                  fill={push === "far" ? "#b14c32" : "#fff4dd"}
                />
              </g>
              <circle cx="220" cy="190" r="9" fill="#587655" />
              <text x="220" y="310" textAnchor="middle">
                fixed pivot
              </text>
              <text x="340" y="90" textAnchor="middle">
                near · 6 cm
              </text>
              <text x="500" y="90" textAnchor="middle">
                far · 14 cm
              </text>
              <path
                d={`M${push === "near" ? 340 : 500} 110v40m-7-8l7 8 7-8`}
                fill="none"
                stroke="#b14c32"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 600 330"
              role="img"
              aria-label={
                saved.revealed
                  ? "One possible inside: a lever and a flexible return strip, an illustrative model only."
                  : `Closed cardboard mystery box, tab ${pressed ? "pushed in" : "at rest"}.`
              }
            >
              <rect width="600" height="330" rx="22" fill="#eff0df" />
              <ellipse cx="310" cy="283" rx="155" ry="14" fill="#dce2ca" />
              <path
                d="M155 105l70-37h218l-65 37z"
                fill="#e8cd9b"
                stroke="#9c7b4a"
                strokeWidth="3"
              />
              <path
                d="M378 105l65-37v165l-65 40z"
                fill="#b88e60"
                stroke="#9c7b4a"
                strokeWidth="3"
              />
              <rect
                x="155"
                y="105"
                width="223"
                height="168"
                rx="7"
                fill={saved.revealed ? "#fcf3dd" : "#d7b383"}
                stroke="#9c7b4a"
                strokeWidth="3"
              />
              {saved.revealed ? (
                <>
                  <path
                    d="M230 215l45-75 75 50"
                    stroke="#b98456"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="275" cy="140" r="8" fill="#668761" />
                  <path
                    d="M230 215q-35-65-20-95"
                    stroke="#805e8a"
                    strokeWidth="5"
                    fill="none"
                  />
                  <text x="265" y="252" textAnchor="middle">
                    lever + return strip
                  </text>
                </>
              ) : (
                <>
                  <text
                    x="265"
                    y="183"
                    textAnchor="middle"
                    fontSize="50"
                    fill="#805b3e"
                  >
                    ?
                  </text>
                  <text x="267" y="226" textAnchor="middle">
                    what’s inside?
                  </text>
                </>
              )}
              <rect
                x={pressed ? 130 : 95}
                y="189"
                width="93"
                height="21"
                rx="5"
                fill="#98b4a7"
                stroke="#52755c"
                strokeWidth="3"
              />
              <path
                d="M135 180v43"
                stroke="#b14c32"
                strokeDasharray="4 4"
                strokeWidth="2"
              />
              <text x="90" y="163">
                push tab
              </text>
            </svg>
          )}
          {circuit && (
            <div className="scene-hotspots">
              {["battery", "resistor", "light", "return path"].map(
                (part, i) => (
                  <button
                    key={part}
                    className={`scene-hotspot spot-${i}`}
                    aria-label={`Inspect the ${part}`}
                    onClick={() => notice(circuitClues[i])}
                  />
                ),
              )}
            </div>
          )}
        </div>
        <div
          className="scene-controls"
          role="group"
          aria-label="Investigation controls"
        >
          {circuit ? (
            <>
              <button
                className="button secondary"
                aria-pressed={connection === "closed"}
                onClick={() => setConnection("closed")}
              >
                Close the path
              </button>
              <button
                className="button secondary"
                aria-pressed={connection === "open"}
                onClick={() => setConnection("open")}
              >
                Open the return
              </button>
              <button
                className="button secondary"
                aria-pressed={connection === "restored"}
                onClick={() => setConnection("restored")}
              >
                Restore the return
              </button>
            </>
          ) : lever ? (
            <>
              <button
                className="button secondary"
                aria-pressed={push === "near"}
                onClick={() => {
                  setPush("near");
                  setLift(false);
                }}
              >
                Choose the near spot
              </button>
              <button
                className="button secondary"
                aria-pressed={push === "far"}
                onClick={() => {
                  setPush("far");
                  setLift(false);
                }}
              >
                Choose the far spot
              </button>
              <button
                className="button"
                aria-pressed={lift}
                onClick={() => setLift(!lift)}
              >
                {lift ? "Lower to the start" : "Push to the target"}
              </button>
            </>
          ) : (
            <>
              <button
                className="button secondary"
                disabled={pressed}
                onClick={() => setPressed(true)}
              >
                Push the tab gently
              </button>
              <button
                className="button"
                disabled={!pressed}
                onClick={() => {
                  setPressed(false);
                  record(
                    "I pushed and released the screen tab. It came back to its starting place.",
                  );
                }}
              >
                Let go and watch
              </button>
            </>
          )}
        </div>
        {lever && lift && (
          <p className="scene-result">
            The load reaches the same target. At the far spot, the hand travels
            farther. In this simple model, the farther push needs less force; a
            real cardboard pivot may have friction.
          </p>
        )}
        {circuit && (
          <div className="scene-part-buttons">
            <span>Look a little closer:</span>
            {["Battery", "Resistor", "Light", "Return path"].map((part, i) => (
              <button
                className="small-control"
                key={part}
                onClick={() => notice(circuitClues[i])}
              >
                {part}
              </button>
            ))}
          </div>
        )}
        {clue && (
          <p className="scene-clue" role="status">
            <Lightbulb size={20} />
            {clue}
          </p>
        )}
        {(circuit || lever) && (
          <button
            className="text-button"
            disabled={lever && !lift}
            onClick={() =>
              record(
                circuit
                  ? `Return ${connection}: the screen light was ${connection === "open" ? "dark" : "shining"}.`
                  : `I used the ${push} push spot to reach the same target. ${push === "far" ? "The hand travelled farther; the ideal model needed less force." : "The hand travelled a shorter distance."}`,
              )
            }
          >
            <Leaf size={17} /> Keep this screen clue
          </button>
        )}
        {!circuit && !lever && (
          <>
            <p>
              Try the same push and release twice before looking inside. Your
              guess can change whenever you find a new clue.
            </p>
            <button
              className="button secondary"
              disabled={saved.trials.length < 2 || pressed}
              onClick={() =>
                investigate(lessonId, { revealed: !saved.revealed })
              }
            >
              {saved.revealed
                ? "Close the little model"
                : "Peek inside the screen model"}
            </button>
            {saved.revealed && (
              <FriendNote>
                This is one possible inside for our screen box. A different
                mechanism could also bring a tab back. It doesn’t tell us what
                is inside your real box.
              </FriendNote>
            )}
          </>
        )}
        <p className="creative-status" role="status">
          {message}
        </p>
        {!!saved.trials.length && (
          <div className="clue-pocket">
            <h4>Clues we kept from the screen</h4>
            <ol>
              {saved.trials.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ol>
          </div>
        )}
        <div className="workbench-invitation">
          <Leaf size={22} />
          <div>
            <h4>Try it at your workbench</h4>
            <p>
              {pilot.concept} Open “Make it” with your helper when you’re ready.
              Keep your real observations on the “Test & notice” page.
            </p>
          </div>
        </div>
        <button className="text-button" onClick={() => setReset(true)}>
          <RotateCcw size={15} /> Start this screen mystery again
        </button>
        {reset && (
          <div className="gentle-confirm">
            <p>
              Clear this screen guess and its clues? Saved shelf cards and real
              experiment notes will stay.
            </p>
            <button
              className="button secondary"
              onClick={() => {
                investigate(lessonId, newInvestigation());
                setConnection("closed");
                setPush("near");
                setLift(false);
                setPressed(false);
                setClue("");
                setMessage("");
                setReset(false);
              }}
            >
              Start the mystery again
            </button>
            <button className="text-button" onClick={() => setReset(false)}>
              Keep these clues
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
