"use client";
import { useState } from "react";
import Link from "next/link";
import { catalog, missingParts, projectHref } from "@/lib/catalog";
import { useWorkshop } from "./WorkshopProvider";
const all = Array.from(
  new Map(catalog.flatMap((l) => l.materials).map((m) => [m.part_id, m])),
).sort((a, b) => a[1].label.localeCompare(b[1].label));
const kits: Record<string, Record<string, number>> = {
  "Household basics": {
    cardboard: 1,
    paper: 1,
    tape: 1,
    marker: 1,
    ruler: 1,
    string: 1,
  },
  "First circuit": {
    aa_cells: 2,
    holder_2aa: 1,
    red_led: 1,
    resistor_220: 1,
    breadboard: 1,
    jumpers: 4,
  },
  "Arduino basics": {
    uno_r3: 1,
    usb_data: 1,
    breadboard: 1,
    red_led: 1,
    resistor_220: 1,
    button: 1,
    jumpers: 6,
  },
  "Sensing add-on": {
    ldr: 1,
    resistor_10k: 1,
    shade: 1,
    hc_sr04: 1,
    ntc_10k: 1,
  },
  "Motion add-on": { servo_5v: 1, servo_supply: 1, pot_10k: 1, paper_arm: 1 },
};
export default function Materials() {
  const { state, inventory } = useWorkshop();
  const [q, setQ] = useState("");
  const ranked = [...catalog].sort(
    (a, b) =>
      missingParts(a, state.inventory).length -
      missingParts(b, state.inventory).length,
  );
  return (
    <>
      <div className="paper-note">
        <p>
          Tell us what’s in your making box. Your helper will still check the
          exact parts, sizes, and preparation for each project.
        </p>
      </div>
      <fieldset className="kit-presets">
        <legend>Add a kit’s starting quantities</legend>
        {Object.entries(kits).map(([name, items]) => (
          <button
            className="button secondary"
            key={name}
            onClick={() =>
              Object.entries(items).forEach(([id, n]) =>
                inventory(id, Math.max(n, state.inventory[id] || 0)),
              )
            }
          >
            {name}
          </button>
        ))}
      </fieldset>
      <div className="materials-layout">
        <section>
          <label className="field">
            Find a material
            <input
              placeholder="Try cardboard, LED, or a button"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <div className="inventory-list">
            {all
              .filter(([, m]) =>
                m.label.toLowerCase().includes(q.toLowerCase()),
              )
              .map(([id, m]) => (
                <label key={id}>
                  <span>
                    {m.label}
                    <small>
                      {id.replaceAll("_", " ")} · helper checks the exact
                      variant
                    </small>
                  </span>
                  <input
                    aria-label={`Quantity: ${id}`}
                    type="number"
                    min={0}
                    max={999}
                    value={state.inventory[id] || 0}
                    onChange={(e) => inventory(id, +e.target.value)}
                  />
                </label>
              ))}
          </div>
        </section>
        <section className="suggested-projects">
          <span className="eyebrow">WHAT COULD THESE BECOME?</span>
          <h2>Your next little possibility</h2>
          {ranked.map((l) => {
            const missing = missingParts(l, state.inventory);
            return (
              <article key={l.id}>
                <Link href={projectHref(l.id)}>
                  <h3>{l.title} ↗</h3>
                </Link>
                <p>
                  {missing.length
                    ? `${missing.length} kinds of material to find`
                    : "Listed quantities are here. Check preparation together."}
                </p>
                {missing.length > 0 && (
                  <details>
                    <summary>What’s missing?</summary>
                    <ul>
                      {missing.map((m) => (
                        <li key={m.part_id}>
                          {m.missing} × {m.label}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </>
  );
}
