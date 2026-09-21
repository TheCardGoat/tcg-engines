import { SHIFT_TIDE_SCENARIOS } from "./shift-tide";
import { MATCH_CYCLE_REGRESSION_SCENARIOS } from "./match-cycle-regressions";
import { USURP_PREVIEW_SCENARIOS } from "./usurp-preview";
import { applyFabVisualFixtureAutomation } from "../fixture-automation";
import { FAB_HERO_SPECIAL_SCENARIOS } from "../hero-special-ui/visualScenarios";
import { FORSAKEN_STRIKE_SCENARIOS } from "./forsaken-strike";
import { USURP_BOARD_LAB_SCENARIOS } from "./usurp-board-labs";
import { MALICE_ZOMBIE_BOARD_SCENARIOS } from "./malice-zombie-board";
import { MARK_BINDINGS_BOARD_SCENARIOS } from "./mark-bindings-board";
import { MARKED_HERO_SCENARIOS } from "./marked-hero";
import { DECAY_SCENARIOS } from "./decay";
import { BOARDS_SCENARIOS } from "./boards";
import { INTERACTIONS_SCENARIOS } from "./interactions";
import { ANIMATIONS_SCENARIOS } from "./animations";
import { TRIGGERS_SCENARIOS } from "./triggers";
import { COMBAT_SCENARIOS } from "./combat";
import { EDGE_SCENARIOS } from "./edge";
import { NAME_CARD_SCENARIOS } from "./name-card";
import { EFFECT_DISCLOSURE_SCENARIOS } from "./effect-disclosure";
import { BOLTYN_COMBO_SCENARIOS } from "./boltyn-combo";
import { COURAGE_REGRESSION_SCENARIOS } from "./courage-regression";
import { FLURRY_SCENARIOS } from "./flurry";
import { UNDO_DECLINE_OPTIONAL_SCENARIOS } from "./undo-decline-optional";
import { PERMANENT_ACTION_SCENARIOS } from "./permanent-actions";
import { TRAVERSE_SCENARIOS } from "./traverse";
import { WARMONGERS_DIPLOMACY_SCENARIOS } from "./warmongers-diplomacy";
import type { FabEngineScenario, FabScenarioCollection } from "./types";

export { FAB_KEYWORD_ANIMATION_FIXTURE_IDS } from "./animations";
export { FAB_SCENARIO_GROUPS } from "./types";
export type { FabEngineScenario, FabScenarioBotMode, FabScenarioGroupId } from "./types";

const SCENARIO_COLLECTIONS: readonly FabScenarioCollection[] = [
  MATCH_CYCLE_REGRESSION_SCENARIOS,
  FORSAKEN_STRIKE_SCENARIOS,
  USURP_BOARD_LAB_SCENARIOS,
  MALICE_ZOMBIE_BOARD_SCENARIOS,
  MARK_BINDINGS_BOARD_SCENARIOS,
  MARKED_HERO_SCENARIOS,
  DECAY_SCENARIOS,
  BOARDS_SCENARIOS,
  INTERACTIONS_SCENARIOS,
  PERMANENT_ACTION_SCENARIOS,
  SHIFT_TIDE_SCENARIOS,
  ANIMATIONS_SCENARIOS,
  TRIGGERS_SCENARIOS,
  COMBAT_SCENARIOS,
  EDGE_SCENARIOS,
  NAME_CARD_SCENARIOS,
  EFFECT_DISCLOSURE_SCENARIOS,
  BOLTYN_COMBO_SCENARIOS,
  COURAGE_REGRESSION_SCENARIOS,
  FLURRY_SCENARIOS,
  UNDO_DECLINE_OPTIONAL_SCENARIOS,
  TRAVERSE_SCENARIOS,
  WARMONGERS_DIPLOMACY_SCENARIOS,
];

export const FAB_ENGINE_SCENARIO_IDS = [
  "money-where-go-again",
  "courage-consumption-and-logs",
  "undo-decline-danse-macabre",
  "viserai-traverse-threshold",
  "warmongers-diplomacy-choice",
  "warmongers-diplomacy-resolved",
  "enlightened-strike-modes",
  "codex-graveyard-choice",
  "authority-effect-owner",
  "authority-effect-opponent",
  "authority-effect-hidden-source",
  "decay-ability",
  "forsaken-strike-six-rewards",
  "forsaken-strike-malice",
  "usurp-zombie-choice-board",
  "malice-zombie-allies-board",
  "mark-bindings-zombie-board",
  "usurp-corpse-cover-defense-board",
  "usurp-gloomblade-usurp-board",
  "usurp-gloomblade-pitch-board",
  "opening",
  "multiple-playable-banished-cards",
  "playable-graveyard-zombie",
  "dynamic-property-values",
  "both-players-zones",
  "active-effects-lab",
  "pitch-stack-four-cards",
  "song-of-sinew-reorder",
  "tuffnut-song-rip-rok",
  "hero-signal-boltyn-bottom",
  "hero-signal-boltyn-top",
  "boltyn-sabers-combo",
  "sutcliffe-research-notes-reorder",
  "spire-sniping-reorder",
  "opt-ability-lab",
  "dual-target-open",
  "hand-play-or-activate",
  "permanent-actions-allies",
  "permanent-actions-items-and-tokens",
  "ninja-become-the-bottle-name",
  "ninja-retrace-the-past-name",
  "name-card-blessing-of-themis",
  "name-card-censor",
  "name-card-chains-of-eminence",
  "name-card-head-leads-the-tail",
  "name-card-imperial-edict",
  "name-card-leave-em-speechless",
  "name-card-null-time-zone",
  "name-card-phantasmal-symbiosis",
  "name-card-pick-a-card-any-card",
  "name-card-retrace-the-past",
  "name-card-shapeless-form",
  "name-card-shifting-winds-of-the-mystic-beast",
  "name-card-talisman-of-cremation",
  "name-card-hunter-or-hunted",
  "name-card-mask-of-many-faces",
  "name-card-embody-greatness",
  "ninja-tigrine-reflex-reaction",
  "poison-sigil-damage",
  "reveal-and-shuffle",
  "clash-sequence-lab",
  "crowd-reaction-lab",
  "wager-outcome-lab",
  "boost-fusion-lab",
  "phantasm-ward-lab",
  "contract-completion-lab",
  "additional-cost-keyword-lab",
  "optional-additional-cost-choice",
  "keyword-counter-lab",
  "pilfer-legal-targets",
  "pilfer-invalid-targets",
  "shift-tide-arsenal-feedback",
  "flurry-durendal-blocked-remaining",
  "deck-search",
  "permanent-token-generation",
  "damage-prevention",
  "trigger-decision-lab",
  "multiple-trigger-open",
  "dorinthea-bolters",
  "closed-sparse",
  "weapon-and-double-arsenal",
  "closed-geared",
  "closed-arena",
  "attack-only-head-jab",
  "defend-open",
  "defend-open-attacker",
  "defender-zone-exit",
  "ally-attack-target-choice",
  "ally-attack-target",
  "defend-declared",
  "dig-in-defense",
  "no-hero-stands-alone-defense-target",
  "active-effects-combat-lab",
  "compact-stack-one",
  "compact-stack-two",
  "compact-stack-three",
  "combat-stack-responses",
  "resolution-stack-priority",
  "damage-step",
  "multi-link-history",
  "multi-block",
  "between-links",
  "endgame",
  "marked-hero-signal",
  "phase-turn-announcement-lab",
  "attack-action-lethal",
  "weapon-lethal",
  "landscape-meld-preview",
  "double-faced-card-preview",
  "combat",
] as const;

type FabEngineCatalogId = (typeof FAB_ENGINE_SCENARIO_IDS)[number];

/**
 * Fail `tsc` when a `satisfies` collection adds an id that is not in
 * `FAB_ENGINE_SCENARIO_IDS`. Catalog order is still a test concern; production
 * must keep serving every collected scenario even if the ordered list drifts.
 */
type AssertCatalogued<C extends Record<string, FabEngineScenario>> =
  Exclude<keyof C, FabEngineCatalogId> extends never
    ? C
    : { missingFromCatalog: Exclude<keyof C, FabEngineCatalogId> };

const _cataloguedCollections: readonly [
  AssertCatalogued<typeof COURAGE_REGRESSION_SCENARIOS>,
  AssertCatalogued<typeof UNDO_DECLINE_OPTIONAL_SCENARIOS>,
  AssertCatalogued<typeof TRAVERSE_SCENARIOS>,
  AssertCatalogued<typeof WARMONGERS_DIPLOMACY_SCENARIOS>,
  AssertCatalogued<typeof BOARDS_SCENARIOS>,
  AssertCatalogued<typeof INTERACTIONS_SCENARIOS>,
  AssertCatalogued<typeof PERMANENT_ACTION_SCENARIOS>,
  AssertCatalogued<typeof SHIFT_TIDE_SCENARIOS>,
  AssertCatalogued<typeof ANIMATIONS_SCENARIOS>,
  AssertCatalogued<typeof TRIGGERS_SCENARIOS>,
  AssertCatalogued<typeof COMBAT_SCENARIOS>,
  AssertCatalogued<typeof MARKED_HERO_SCENARIOS>,
  AssertCatalogued<typeof EDGE_SCENARIOS>,
  AssertCatalogued<typeof BOLTYN_COMBO_SCENARIOS>,
  AssertCatalogued<typeof FLURRY_SCENARIOS>,
] = [
  COURAGE_REGRESSION_SCENARIOS,
  UNDO_DECLINE_OPTIONAL_SCENARIOS,
  TRAVERSE_SCENARIOS,
  WARMONGERS_DIPLOMACY_SCENARIOS,
  BOARDS_SCENARIOS,
  INTERACTIONS_SCENARIOS,
  PERMANENT_ACTION_SCENARIOS,
  SHIFT_TIDE_SCENARIOS,
  ANIMATIONS_SCENARIOS,
  TRIGGERS_SCENARIOS,
  COMBAT_SCENARIOS,
  MARKED_HERO_SCENARIOS,
  EDGE_SCENARIOS,
  BOLTYN_COMBO_SCENARIOS,
  FLURRY_SCENARIOS,
];
void _cataloguedCollections;

/** Prefer catalog order, then leftover collection ids. Never drop a collected scenario. */
export function orderCataloguedScenarios(
  catalogIds: readonly string[],
  collected: ReadonlyMap<string, FabEngineScenario>,
): readonly FabEngineScenario[] {
  const remaining = new Map(collected);
  const seen = new Set<string>();
  const ordered: FabEngineScenario[] = [];
  for (const id of catalogIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const scenario = remaining.get(id);
    if (!scenario) continue;
    remaining.delete(id);
    ordered.push(scenario);
  }
  const leftovers = [...remaining.values()].sort((left, right) => left.id.localeCompare(right.id));
  return [...ordered, ...leftovers];
}

function collectScenarios(): readonly FabEngineScenario[] {
  const byId = new Map<string, FabEngineScenario>();
  for (const collection of SCENARIO_COLLECTIONS) {
    for (const [key, scenario] of Object.entries(collection)) {
      if (key !== scenario.id)
        throw new Error(`FAB scenario key ${key} does not match id ${scenario.id}`);
      if (byId.has(scenario.id))
        throw new Error(`Duplicate FAB engine scenario id: ${scenario.id}`);
      byId.set(scenario.id, scenario);
    }
  }

  return [
    ...orderCataloguedScenarios(FAB_ENGINE_SCENARIO_IDS, byId),
    ...FAB_HERO_SPECIAL_SCENARIOS,
    ...USURP_PREVIEW_SCENARIOS,
  ];
}

const RAW_FAB_ENGINE_SCENARIOS = collectScenarios();

/** Install the fixture-only automation profile after each board is prepared. */
export const FAB_ENGINE_SCENARIOS: readonly FabEngineScenario[] = RAW_FAB_ENGINE_SCENARIOS.map(
  (scenario) => ({
    ...scenario,
    boot: () => {
      const match = scenario.boot();
      applyFabVisualFixtureAutomation(match.engine, match.player1Id, match.player2Id);
      return match;
    },
  }),
);

export function getFabEngineScenario(id: string | undefined): FabEngineScenario | undefined {
  if (!id) return undefined;
  return FAB_ENGINE_SCENARIOS.find((scenario) => scenario.id === id);
}

export function isFabEngineScenarioId(id: string | undefined): boolean {
  return id != null && FAB_ENGINE_SCENARIOS.some((scenario) => scenario.id === id);
}
