import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import type { FabPresentationState } from "../state";
import { FAB_HERO_SPECIAL_SCENARIO_GROUP } from "../hero-special-ui/visualScenarios";

export type FabScenarioGroupId =
  | "usurp-preview"
  | "opening"
  | "closed"
  | "combat"
  | "edge"
  | "multiple-triggers"
  | "name-card"
  | "practice-matches"
  | "hero-special";

export type FabScenarioBotMode = "off" | "pass-only" | "hero-profile" | "heuristic" | "attack-only";

export interface FabEngineScenario {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly group: FabScenarioGroupId;
  readonly tags: readonly string[];
  /**
   * Who the tabletop viewer sits as. Prefer the seat that has priority so the
   * human can act without needing a server or dual-control UI.
   */
  readonly viewerId: "player-1" | "player-2";
  /**
   * Opponent automation on the local runtime. Default `off` freezes the board
   * for inspection; `pass-only` advances when the opponent gets priority.
   */
  readonly botMode: FabScenarioBotMode;
  /** Boot a local engine match (no network). */
  readonly boot: () => FabPracticeMatch;
  /**
   * Optional display-only state supplied by a fixture when the local engine
   * does not persist enough historical combat data for a visual regression.
   */
  readonly presentationTransform?: (state: FabPresentationState) => FabPresentationState;
}

export const FAB_SCENARIO_GROUPS: readonly {
  id: FabScenarioGroupId;
  label: string;
  description: string;
}[] = [
  {
    id: "usurp-preview",
    label: "Usurp the Shadow Throne — preview",
    description:
      "One deterministic QA setup for every revealed card and pitch variant. Final artwork is pending approval.",
  },
  {
    id: "opening",
    label: "Opening / practice",
    description: "Full practice seating from starter decks.",
  },
  {
    id: "practice-matches",
    label: "Practice matches",
    description: "Seeded real-deck QA matchups with selected equipment and private inventory.",
  },
  {
    id: "closed",
    label: "Chain closed",
    description: "Action-phase boards: gear density, arena, life totals.",
  },
  {
    id: "combat",
    label: "Combat chain",
    description: "Real combat steps reached by engine moves.",
  },
  {
    id: "multiple-triggers",
    label: "Multiple triggers",
    description:
      "Board states where two or more triggered effects fire at once and the controller orders them (CR 6.6.6b).",
  },
  {
    id: "name-card",
    label: "Name a card",
    description: "Real turns paused at card-name decisions and their privacy-safe shortcuts.",
  },
  {
    id: "edge",
    label: "Edge cases",
    description: "Low life and multi-block pressure.",
  },
  FAB_HERO_SPECIAL_SCENARIO_GROUP,
] as const;

export type FabScenarioCollection = Readonly<Record<string, FabEngineScenario>>;
