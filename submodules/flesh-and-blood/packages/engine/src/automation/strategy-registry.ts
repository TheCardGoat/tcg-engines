import {
  attackOnlyStrategy,
  firstLegalStrategy,
  heuristicStrategy,
  passOnlyStrategy,
  randomStrategy,
  type FabBotStrategy,
} from "./bot-strategies.ts";
import {
  defendOnlyStrategy,
  neverDefendStrategy,
  valueExtractStrategy,
} from "./heuristic/goldfish.ts";
import {
  FAB_HERO_PROFILE_BINDINGS,
  heroProfileStrategy,
  type FabHeroMatcher,
} from "./heuristic/profiles/index.ts";

/**
 * Scope of an automated-action strategy.
 *
 * In Flesh and Blood a strategy is either bound to a hero or hero-agnostic:
 * - `hero` — bound to a single hero (declared via
 *   {@link FabAutomatedActionStrategyOption.heroMatch}); only meaningful seated
 *   with that hero. These are internal building blocks — production picks the
 *   `hero-profile` dispatcher, which routes by the seated hero.
 * - `dispatcher` — routes to a hero-bound strategy by seated hero, else a
 *   generic fallback. Valid on any hero.
 * - `generic` — hero-agnostic goldfish / utility bot. Valid on any hero.
 *
 * FAB-local: other games model their automated seats differently and should
 * not share this abstraction.
 */
export type FabStrategyScope = "hero" | "dispatcher" | "generic";

export interface FabAutomatedActionStrategyOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly strategy: FabBotStrategy;
  readonly scope: FabStrategyScope;
  /** Required when `scope === "hero"`: the hero this strategy is bound to. */
  readonly heroMatch?: FabHeroMatcher;
  /** Hidden from casual practice pickers when true. */
  readonly testOnly?: boolean;
}

export const DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID = "hero-profile";

/** Hero-bound entries derived from the single source of truth. */
const heroStrategyOptions: readonly FabAutomatedActionStrategyOption[] =
  FAB_HERO_PROFILE_BINDINGS.map((binding) => ({
    id: binding.id,
    label: binding.label,
    description: binding.description,
    strategy: binding.strategy,
    scope: "hero",
    heroMatch: binding.heroMatch,
    // Hero-specific ids are test/bench affordances; production reaches them via
    // the "hero-profile" dispatcher, which routes by the seated hero.
    testOnly: true,
  }));

const HERO_PROFILE_DESCRIPTION = `Dispatches a seated-hero guide when one exists (${FAB_HERO_PROFILE_BINDINGS.map(
  (binding) => binding.label,
).join(", ")}); otherwise the value-extract goldfish.`;

export const FAB_AUTOMATED_ACTION_STRATEGIES: readonly FabAutomatedActionStrategyOption[] = [
  {
    id: "hero-profile",
    label: "Hero profile",
    description: HERO_PROFILE_DESCRIPTION,
    strategy: heroProfileStrategy,
    scope: "dispatcher",
  },
  ...heroStrategyOptions,
  {
    id: "value-extract",
    label: "Value extract",
    description:
      "Unknown-hero goldfish: compile a play/pitch/arsenal line from the current hand and extract the most value.",
    strategy: valueExtractStrategy,
    scope: "generic",
  },
  {
    id: "defend-only",
    label: "Defend only",
    description:
      "Goldfish that only blocks or passes; never opens an attack when a pass or end-turn exists.",
    strategy: defendOnlyStrategy,
    scope: "generic",
  },
  {
    id: "never-defend",
    label: "Never defend",
    description: "Goldfish that never spends cards on defense and otherwise extracts value.",
    strategy: neverDefendStrategy,
    scope: "generic",
  },
  {
    id: "heuristic",
    label: "Heuristic",
    description:
      "Rules-light priority bot: resolves prompts, blocks with high defense, plays on-curve attacks, pitches when short on resources.",
    strategy: heuristicStrategy,
    scope: "generic",
  },
  {
    id: "attack-only",
    label: "Attack only",
    description:
      "Deterministic fixture strategy that opens attack actions and otherwise passes without blocking.",
    strategy: attackOnlyStrategy,
    scope: "generic",
    testOnly: true,
  },
  {
    id: "first-legal",
    label: "First legal",
    description: "Deterministic test strategy that submits the first legal command.",
    strategy: firstLegalStrategy,
    scope: "generic",
    testOnly: true,
  },
  {
    id: "random",
    label: "Random",
    description: "Picks uniformly among legal non-concede commands (seedable via practice seed).",
    strategy: randomStrategy,
    scope: "generic",
    testOnly: true,
  },
  {
    id: "pass-only",
    label: "Pass only",
    description: "Prefers pass / end-turn; avoids initiating plays when possible.",
    strategy: passOnlyStrategy,
    scope: "generic",
    testOnly: true,
  },
];

export function getFabAutomatedActionStrategyOption(
  strategyId: string,
): FabAutomatedActionStrategyOption | undefined {
  return FAB_AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function resolveFabAutomatedActionStrategyOption(
  strategyId: string | null | undefined,
  defaultStrategyId: string = DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID,
): FabAutomatedActionStrategyOption {
  return (
    (strategyId ? getFabAutomatedActionStrategyOption(strategyId) : undefined) ??
    getFabAutomatedActionStrategyOption(defaultStrategyId) ??
    FAB_AUTOMATED_ACTION_STRATEGIES[0]!
  );
}

export function getSafeFabAutomatedActionStrategyOption(
  strategyId?: string | null,
): FabAutomatedActionStrategyOption {
  return resolveFabAutomatedActionStrategyOption(
    strategyId,
    DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID,
  );
}
