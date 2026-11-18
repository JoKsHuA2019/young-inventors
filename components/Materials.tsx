"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Leaf,
  Lightbulb,
  Minus,
  PackageOpen,
  Plus,
  Search,
  Scissors,
  Settings2,
  Upload,
  X,
} from "lucide-react";
import { projectHref } from "@/lib/catalog";
import {
  materials,
  materialById,
  materialGroups,
  materialKits,
  inventoryBackup,
  readInventoryBackup,
  projectsForInventory,
  type MaterialGroup,
} from "@/lib/materials";
import { download, useWorkshop } from "./WorkshopProvider";
import { StoryImage } from "./Shared";

const groupIcons = {
  craft: Scissors,
  circuits: Lightbulb,
  sensors: Settings2,
  motion: Settings2,
  project: BookOpen,
};

export default function Materials() {
  const { state, ready, error, inventory, applyInventory } = useWorkshop();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<MaterialGroup | "all">("craft");
  const [view, setView] = useState<"all" | "mine">("all");
  const [kit, setKit] = useState("");
  const [kitItems, setKitItems] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<Record<string, number> | null>(null);
  const [notice, setNotice] = useState("");
  const [fileError, setFileError] = useState("");
  const [ideaCount, setIdeaCount] = useState(3);
  const fileInput = useRef<HTMLInputElement>(null);
  const boxButton = useRef<HTMLButtonElement>(null);
  const kitDetails = useRef<HTMLDetailsElement>(null);
  const restoreHeading = useRef<HTMLHeadingElement>(null);
  const owned = materials.filter(
    (material) => (state.inventory[material.id] || 0) > 0,
  );
  const visible = materials.filter(
    (material) =>
      (view !== "mine" || (state.inventory[material.id] || 0) > 0) &&
      (group === "all" || group === material.group) &&
      material.search.includes(q.trim().toLowerCase()),
  );
  const ranked = projectsForInventory(state.inventory);
  const selectedKit = materialKits[kit];

  useEffect(() => {
    if (pending !== null) restoreHeading.current?.focus();
  }, [pending]);

  const showMyBox = () => {
    setView("mine");
    setGroup("all");
    setQ("");
    boxButton.current?.focus();
  };
  const addKit = () => {
    applyInventory(kitItems, "merge");
    setNotice(
      "Your kit’s materials are in the box. You can change their counts below.",
    );
    setKit("");
    if (kitDetails.current) kitDetails.current.open = false;
    showMyBox();
  };
  const openCopy = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setFileError("");
    setNotice("");
    setPending(null);
    try {
      if (file.size > 131072) throw Error("Too large");
      setPending(readInventoryBackup(await file.text()));
    } catch {
      setFileError(
        "That copy couldn’t open. Choose a making-box file saved by this workshop. Your current box is still here.",
      );
    }
  };
  const restore = (mode: "merge" | "replace") => {
    if (pending === null) return;
    applyInventory(pending, mode);
    setPending(null);
    setNotice(
      "Your saved materials are in the box. Let’s see what they could make.",
    );
    showMyBox();
  };

  return (
    <>
      <section className="making-box-banner" aria-label="Your saved materials">
        <div className="making-box-summary">
          <span className="making-box-mark">
            <PackageOpen size={30} aria-hidden="true" />
          </span>
          <div>
            <p className="box-count">
              {owned.length ? (
                <>
                  <strong>{owned.length}</strong>{" "}
                  {owned.length === 1
                    ? "kind of material"
                    : "kinds of materials"}{" "}
                  in your box
                </>
              ) : (
                "Let’s add your first few supplies."
              )}
            </p>
            <span className={`save-state ${error ? "temporary" : ""}`}>
              {error ? (
                <Leaf size={14} aria-hidden="true" />
              ) : (
                <Check size={14} aria-hidden="true" />
              )}
              {!ready
                ? "Opening your making box…"
                : error
                  ? "Keeping this list in this tab for now"
                  : "Saved automatically in this browser"}
            </span>
            {owned.length > 0 && (
              <a className="box-ideas-link" href="#material-projects">
                See project ideas <ArrowDown size={13} />
              </a>
            )}
          </div>
        </div>
        <div className="box-file-actions">
          <button
            className="button secondary"
            disabled={!ready}
            onClick={() =>
              download(
                inventoryBackup(state.inventory),
                "my-making-box.json",
                "application/json",
              )
            }
          >
            <Download size={16} /> Save a copy
          </button>
          <button
            className="button secondary"
            disabled={!ready}
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={16} /> Open a copy
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            aria-label="Open a making-box copy"
            onChange={openCopy}
            hidden
          />
        </div>
        <details className="box-save-help">
          <summary>How does saving work?</summary>
          <p>
            Your list is saved on this device as you make changes. Use the same
            browser and website address to find it next time. You don’t need an
            account. To carry your box to another device, browser, or one of our
            other website addresses, save a copy and open it there. Browser
            cleanup can erase a saved list, so a copy is handy to keep.
          </p>
        </details>
      </section>
      {fileError && (
        <p className="box-file-error" role="alert">
          {fileError}
        </p>
      )}
      <p className="box-notice" role="status">
        {notice}
      </p>
      {pending !== null && (
        <section className="box-restore" aria-labelledby="restore-title">
          <h2 id="restore-title" tabIndex={-1} ref={restoreHeading}>
            Your saved making box
          </h2>
          <p>
            This copy has {Object.keys(pending).length} kinds of materials.
            Combining keeps the larger count for each material. Using the saved
            list replaces just your materials; your notebook stays as it is.
          </p>
          <details>
            <summary>See the materials in this copy</summary>
            <ul>
              {Object.entries(pending).map(([id, n]) => (
                <li key={id}>
                  {n} × {materialById.get(id)?.label}
                </li>
              ))}
            </ul>
          </details>
          <div className="button-row">
            <button className="button" onClick={() => restore("merge")}>
              Combine with my box
            </button>
            <button
              className="button secondary"
              onClick={() => restore("replace")}
            >
              Use this saved list
            </button>
            <button
              className="text-button"
              onClick={() => {
                setPending(null);
                setNotice("Your current making box is still here.");
                showMyBox();
              }}
            >
              Keep my current box
            </button>
          </div>
        </section>
      )}
      <details className="kit-picker" ref={kitDetails}>
        <summary>
          <PackageOpen size={18} aria-hidden="true" /> Have a kit already?{" "}
          <ChevronDown size={15} aria-hidden="true" />
        </summary>
        <p>
          Choose a starting kit, then uncheck anything you haven’t found yet.
          You can change each count after adding the pieces.
        </p>
        <div className="field">
          <label htmlFor="material-kit">Choose a kit</label>
          <select
            id="material-kit"
            disabled={!ready}
            value={kit}
            onChange={(event) => {
              const id = event.target.value;
              setKit(id);
              setKitItems({ ...(materialKits[id]?.items || {}) });
            }}
          >
            <option value="">Choose a kit to look inside</option>
            {Object.entries(materialKits).map(([id, item]) => (
              <option value={id} key={id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {selectedKit && (
          <div className="kit-review">
            <fieldset>
              <legend>Which pieces do you have?</legend>
              {Object.entries(selectedKit.items).map(([id, quantity]) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={!!kitItems[id]}
                    onChange={(event) =>
                      setKitItems((previous) => {
                        const next = { ...previous };
                        if (event.target.checked) next[id] = quantity;
                        else delete next[id];
                        return next;
                      })
                    }
                  />
                  <span>{materialById.get(id)?.label}</span>
                  <span className="kit-quantity">{quantity}</span>
                </label>
              ))}
            </fieldset>
            <button
              className="button"
              disabled={!Object.keys(kitItems).length}
              onClick={addKit}
            >
              Add these to my box <Plus size={16} />
            </button>
            <p className="fine">
              Already in your box? We keep the larger count, so the same kit
              doesn’t get counted twice.
            </p>
          </div>
        )}
      </details>
      <div className="materials-layout">
        <section aria-label="Your material shelves">
          <div
            className="box-view-switch"
            role="group"
            aria-label="Material list"
          >
            <button
              aria-pressed={view === "all"}
              onClick={() => {
                setView("all");
                setGroup("craft");
                setQ("");
              }}
            >
              <Search size={16} /> Find supplies
            </button>
            <button
              ref={boxButton}
              aria-pressed={view === "mine"}
              onClick={showMyBox}
            >
              <PackageOpen size={16} /> In my box <span>{owned.length}</span>
            </button>
          </div>
          <div className="field supply-search">
            <label htmlFor="material-search">Find a material</label>
            <span>
              <Search size={18} aria-hidden="true" />
              <input
                id="material-search"
                value={q}
                placeholder="Try cardboard, light, or wire"
                onChange={(event) => {
                  setQ(event.target.value);
                  if (event.target.value) setGroup("all");
                }}
              />
              {q && (
                <button
                  aria-label="Clear material search"
                  onClick={() => setQ("")}
                >
                  <X size={16} />
                </button>
              )}
            </span>
          </div>
          <div
            className="supply-groups"
            role="group"
            aria-label="Material groups"
          >
            <button
              aria-pressed={group === "all"}
              onClick={() => setGroup("all")}
            >
              All supplies
            </button>
            {materialGroups.map((item) => (
              <button
                key={item.id}
                aria-pressed={group === item.id}
                onClick={() => setGroup(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="shelf-help">
            Use + to add something you have. Your helper will check the exact
            pieces and sizes before you build.
          </p>
          <div className="inventory-list">
            {visible.map((material) => {
              const quantity = state.inventory[material.id] || 0;
              const Icon = groupIcons[material.group];
              return (
                <article
                  className="material-row"
                  key={material.id}
                  data-packed={quantity > 0}
                >
                  <span className={`material-icon ${material.group}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div className="material-copy">
                    <h3>{material.label}</h3>
                    <p>{material.hint}</p>
                  </div>
                  <div className="quantity-control">
                    <button
                      aria-label={`Remove ${material.label.toLowerCase()}`}
                      disabled={!ready || quantity === 0}
                      onClick={() => inventory(material.id, quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={999}
                      value={quantity}
                      disabled={!ready}
                      aria-label={`${material.label} in my box`}
                      onChange={(event) =>
                        inventory(material.id, Number(event.target.value))
                      }
                    />
                    <button
                      aria-label={`Add ${material.label.toLowerCase()}`}
                      disabled={!ready || quantity >= 999}
                      onClick={() => inventory(material.id, quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
            {!visible.length && (
              <div className="empty-making-box">
                <PackageOpen size={36} aria-hidden="true" />
                <h3>
                  {view === "mine" && !owned.length
                    ? "Your making box is waiting."
                    : "Let’s look on another shelf."}
                </h3>
                <p>
                  {view === "mine" && !owned.length
                    ? "Find a few supplies you have, then add them with the + button. A piece of cardboard is a lovely start."
                    : "Try a different word or look through all the supplies."}
                </p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setQ("");
                    setGroup(
                      view === "mine" && !owned.length ? "craft" : "all",
                    );
                    setView("all");
                  }}
                >
                  {" "}
                  {view === "mine" && !owned.length
                    ? "Find some supplies"
                    : "Show all supplies"}
                </button>
              </div>
            )}
          </div>
        </section>
        <section
          id="material-projects"
          className="suggested-projects"
          aria-label="Project ideas for your materials"
        >
          <span className="eyebrow">FROM YOUR BOX TO YOUR WORKBENCH</span>
          <h2>What could we make?</h2>
          {!owned.length ? (
            <div className="box-project-empty">
              <Leaf size={35} aria-hidden="true" />
              <p>
                Add a few things to your box, and we’ll help you see what they
                could become.
              </p>
              <Link className="text-link" href="/explore/">
                Or peek at all the projects <ArrowUpRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <p className="project-match-intro">
                Here are a few ideas closest to the supplies you’ve found.
              </p>
              {ranked.slice(0, ideaCount).map(({ lesson, missing }) => (
                <article className="material-project" key={lesson.id}>
                  <Link
                    className="material-project-link"
                    href={projectHref(lesson.id)}
                  >
                    <StoryImage image={lesson.image} alt="" />
                    <h3>
                      {lesson.title}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </h3>
                  </Link>
                  <p className={missing.length ? "" : "materials-found"}>
                    {missing.length
                      ? `Still to gather: ${missing.length} ${missing.length === 1 ? "kind" : "kinds"} of material.`
                      : "The listed materials are in your box. Check the build together."}
                  </p>
                  {!!missing.length && (
                    <details>
                      <summary>What else do we need?</summary>
                      <ul>
                        {missing.map((material) => (
                          <li key={material.part_id}>
                            {material.missing} ×{" "}
                            {materialById.get(material.part_id)?.label ||
                              material.label}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </article>
              ))}
              {ideaCount < ranked.length && (
                <button
                  className="text-button more-material-ideas"
                  onClick={() => setIdeaCount(ideaCount + 3)}
                >
                  See a few more ideas <ChevronDown size={15} />
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
