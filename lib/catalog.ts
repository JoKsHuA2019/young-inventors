import data from "@/content/catalog.json";
import type { CatalogLesson } from "./types";
export const catalog = data as CatalogLesson[];
export const tracks = [
  {
    id: "circuit-detectives",
    title: "Little lights, big discoveries",
    original: "Circuit Detectives",
    symbol: "◉",
    color: "gold",
    description:
      "Follow a light’s path, make a secret switch, and bring a cardboard world to life.",
    prefix: "c",
  },
  {
    id: "code-your-world",
    title: "Teach a tiny computer",
    original: "Code Your World",
    symbol: "⌘",
    color: "pink",
    description:
      "Give a light a rhythm, send a secret message, and make a machine follow your rules.",
    prefix: "p",
  },
  {
    id: "machines-in-motion",
    title: "Cardboard comes alive",
    original: "Machines in Motion",
    symbol: "↗",
    color: "green",
    description:
      "Peek beneath a waving puppet and discover the links, levers, and signals that move it.",
    prefix: "m",
  },
  {
    id: "sensor-sleuths",
    title: "Clues from the world",
    original: "Sensor Sleuths",
    symbol: "☀",
    color: "blue",
    description:
      "Investigate shadows, echoes, and tiny changes that help inventions notice their surroundings.",
    prefix: "s",
  },
  {
    id: "inventor-league",
    title: "Inside the invention",
    original: "The Inventor League",
    symbol: "✧",
    color: "peach",
    description:
      "Uncover a mystery, repair a little machine, and make an invention with a story of its own.",
    prefix: "i",
  },
];
export const byId = (id: string) => catalog.find((l) => l.id === id)!;
export const projectHref = (id: string) => `/projects/${byId(id).slug}/`;
export const trackFor = (id: string) => tracks.find((t) => t.id === id)!;
export function missingParts(
  lesson: CatalogLesson,
  inventory: Record<string, number>,
) {
  return lesson.materials
    .filter((m) => !m.optional && (inventory[m.part_id] || 0) < m.quantity)
    .map((m) => ({ ...m, missing: m.quantity - (inventory[m.part_id] || 0) }));
}
export type Filters = {
  query: string;
  track: string;
  time: number;
  board: string;
  owned: boolean;
  part: string;
  help: string;
  support: string;
};
export function filterLessons(
  lessons: CatalogLesson[],
  filters: Filters,
  inventory: Record<string, number> = {},
) {
  return lessons.filter(
    (l) =>
      (!filters.query ||
        `${l.title} ${l.intro} ${l.id} ${l.materials.map((m) => m.label).join(" ")}`
          .toLowerCase()
          .includes(filters.query.toLowerCase())) &&
      (!filters.track || l.track === filters.track) &&
      l.minutes <= filters.time &&
      (!filters.board ||
        (filters.board === "none"
          ? l.board === "none"
          : filters.board === "no-arduino"
            ? l.board !== "uno_r3_5v"
            : l.board === filters.board)) &&
      (!filters.owned || missingParts(l, inventory).length === 0) &&
      (!filters.part || l.materials.some((m) => m.part_id === filters.part)) &&
      (!filters.help ||
        (filters.help === "craft" ? l.board === "none" : l.board !== "none")) &&
      (!filters.support ||
        (filters.support === "first"
          ? l.prerequisites.length === 0
          : l.prerequisites.length > 0)),
  );
}
