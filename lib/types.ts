export type ImageRef = {
  path: string;
  cell: number;
  columns: number;
  rows: number;
};
export type Material = {
  part_id: string;
  quantity: number;
  label: string;
  compatibility: string;
  reusable: boolean;
  optional: boolean;
};
export type Card = {
  kind: string;
  actions?: {
    number: number;
    title: string;
    instruction: string;
    diagram?: string;
  }[];
  [key: string]: unknown;
};
export type CatalogLesson = {
  id: string;
  title: string;
  slug: string;
  track: string;
  character: string;
  minutes: number;
  prerequisites: string[];
  board: string;
  image: ImageRef;
  materials: Material[];
  intro: string;
  preview: string;
};
export type Lesson = CatalogLesson & {
  version: string;
  question: string;
  choices: string[];
  discovery: string;
  invitation: string;
  actionImage: ImageRef;
  buildText: string;
  exploreText: string;
  experiment: {
    starter: string;
    variable: string;
    keep_constant: string;
    observation_prompt: string;
  };
  success: {
    observable_check: string;
    explanation_check: string;
    unresolved_route: string;
  };
  debug: {
    faults: { symptom: string; hints: string[] }[];
    before_physical_changes: string;
  };
  remix: { type: string; prompt: string }[];
  helper: {
    title: string;
    materials: Material[];
    connections: { source: string; destination: string; note: string }[];
    cards: Card[];
    code_path: string | null;
    mentor_note: string;
    cleanup: string;
    learning_objective: string;
    hardware_review_status: string;
    release_status: string;
    safety_review: {
      reviewer: string | null;
      review_date: string | null;
      bench_result: string;
      release_gate: string;
    };
    support_modes: Record<string, string>;
  };
};
export type Progress = {
  version: string;
  step: number;
  prediction: string;
  reason: string;
  observation: string;
  change: string;
  reflection: string;
  spoken: boolean;
  checked: boolean;
  outcome: string;
  finished: boolean;
  updated: string;
};
export type WorkshopState = {
  version: 1;
  progress: Record<string, Progress>;
  inventory: Record<string, number>;
  creative?: import("./creative").CreativeState;
};
export const steps = [
  "The story",
  "Your guess",
  "Try the model",
  "Make it",
  "Test & notice",
  "What’s happening?",
  "Find a clue",
  "Make it yours",
  "Your notebook",
];
