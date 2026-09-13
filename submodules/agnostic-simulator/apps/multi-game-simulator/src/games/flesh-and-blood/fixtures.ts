/**
 * Visual fixture catalog for the FAB simulator.
 *
 * Scenarios are **engine-backed** (see `engineScenarios.ts`). Catalog pages only
 * help humans discover ids; `/tests/:id` boots a real local runtime through the
 * practice play surface — no server connection.
 */
import type { FabMatchRuntime } from "@tcg/flesh-and-blood-engine/simulator";

import {
  FAB_ENGINE_SCENARIOS,
  FAB_SCENARIO_GROUPS,
  getFabEngineScenario,
  type FabEngineScenario,
  type FabScenarioGroupId,
} from "./engineScenarios";
import {
  FAB_PRACTICE_MATCHUP_FIXTURES,
  type FabPracticeMatchupCatalogFixture,
} from "./practice-matchup-fixtures";
import { presentRuntime } from "./projection";
import type { FabPresentationState } from "./state";

export type FabFixtureGroupId = FabScenarioGroupId;
export const FAB_FIXTURE_GROUPS = FAB_SCENARIO_GROUPS;

export type FabFixtureId = string;

export interface FabVisualFixture {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly group: FabFixtureGroupId;
  readonly tags: readonly string[];
  readonly scenario: FabEngineScenario;
  /** Presentation snapshot for pure projection unit tests. */
  readonly create: () => FabPresentationState;
}

export interface FabSurfaceFixture {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly group: FabFixtureGroupId;
  readonly tags: readonly string[];
}

function scenarioToVisual(scenario: FabEngineScenario): FabVisualFixture {
  return {
    id: scenario.id,
    label: scenario.label,
    description: scenario.description,
    group: scenario.group,
    tags: scenario.tags,
    scenario,
    create: () => {
      const match = scenario.boot();
      const state = presentRuntime(match.runtime, scenario.viewerId);
      return scenario.presentationTransform?.(state) ?? state;
    },
  };
}

export const FAB_VISUAL_FIXTURES: readonly FabVisualFixture[] =
  FAB_ENGINE_SCENARIOS.map(scenarioToVisual);

export const FAB_SURFACE_FIXTURES: readonly FabSurfaceFixture[] = [
  {
    id: "hero-banners",
    label: "Hero banners — image and video",
    description:
      "Compare every hero banner with its image on the left and video on the right, using the sideboard layout. Search heroes or browse 12 per page.",
    group: "edge",
    tags: ["hero", "banner", "sideboard", "image", "video", "premium-media"],
  },
  {
    id: "post-game-summary",
    label: "Post-game summary lab",
    description:
      "Direct post-game layout fixture with authored deck identities, long content, mocked analytics, and linkable outcome, scope, tab, and premium states.",
    group: "edge",
    tags: ["post-game", "summary", "layout", "responsive", "mock-data", "premium-media"],
  },
];

/** Every discoverable fixture route, including component labs and real-deck practice matchups. */
export const FAB_FIXTURE_CATALOG: readonly (
  | FabVisualFixture
  | FabSurfaceFixture
  | FabPracticeMatchupCatalogFixture
)[] = [...FAB_VISUAL_FIXTURES, ...FAB_SURFACE_FIXTURES, ...FAB_PRACTICE_MATCHUP_FIXTURES];

/** @deprecated Prefer FAB_VISUAL_FIXTURES; kept for older Record-style access. */
export const FAB_FIXTURES: Record<
  string,
  { id: string; label: string; description: string; create: () => FabPresentationState }
> = Object.fromEntries(
  FAB_VISUAL_FIXTURES.map((f) => [
    f.id,
    { id: f.id, label: f.label, description: f.description, create: f.create },
  ]),
);

export function getFabVisualFixture(id: string | undefined): FabVisualFixture | undefined {
  if (!id) return undefined;
  return FAB_VISUAL_FIXTURES.find((f) => f.id === id);
}

export function isFabFixtureId(value: string | undefined): value is string {
  return value != null && FAB_VISUAL_FIXTURES.some((f) => f.id === value);
}

export function getFabScenario(id: string | undefined): FabEngineScenario | undefined {
  return getFabEngineScenario(id);
}

/** Opening action-phase board from a real engine practice match. */
export function createOpeningFixtureState(): FabPresentationState {
  const scenario = getFabEngineScenario("opening");
  if (!scenario) throw new Error("Missing opening scenario");
  return scenarioToVisual(scenario).create();
}

/** Engine-backed combat-ish state for projection/unit tests. */
export function createCombatFixtureState(): FabPresentationState {
  const scenario = getFabEngineScenario("combat") ?? getFabEngineScenario("defend-declared");
  if (!scenario) throw new Error("Missing combat scenario");
  return scenarioToVisual(scenario).create();
}

export function createClosedWithPermanentsFixtureState(
  options: { bothPlayers?: boolean } = {},
): FabPresentationState {
  void options;
  const scenario = getFabEngineScenario("closed-arena");
  if (!scenario) throw new Error("Missing closed-arena scenario");
  return scenarioToVisual(scenario).create();
}

export function createBetweenLinksFixtureState(): FabPresentationState {
  const scenario = getFabEngineScenario("between-links");
  if (!scenario) throw new Error("Missing between-links scenario");
  return scenarioToVisual(scenario).create();
}

export function createMultiLinkActiveFixtureState(): FabPresentationState {
  const scenario = getFabEngineScenario("multi-block") ?? getFabEngineScenario("defend-declared");
  if (!scenario) throw new Error("Missing multi-block scenario");
  return scenarioToVisual(scenario).create();
}

export function createPracticeState(): FabPresentationState {
  return createOpeningFixtureState();
}

export function createOpeningFixtureRuntime(): FabMatchRuntime {
  const scenario = getFabEngineScenario("opening");
  if (!scenario) throw new Error("Missing opening scenario");
  return scenario.boot().runtime;
}
