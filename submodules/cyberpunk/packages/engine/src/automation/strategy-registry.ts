import {
  attackUnitOnlyStrategy,
  attackRivalOnlyStrategy,
  callLegendOnlyStrategy,
  createGreedyStrategy,
  defaultStrategy,
  type GreedyWeights,
  firstLegalStrategy,
  greedyStrategy,
  passOnlyStrategy,
  randomStrategy,
} from "./strategies/index.ts";
import { abilityAwareTacticalStrategy, tacticalStrategy } from "./search/tactical.ts";
import type { AIStrategy } from "./types.ts";
import type { BotInformationPolicy, BotStrategyDescriptorV1 } from "@tcg/bot-core";
import currentPromotion from "./promotions/current.json" with { type: "json" };

/** Bump whenever shipped decision behavior changes in a promotion-relevant way. */
export const CYBERPUNK_AUTOMATION_REVISION = "cyberpunk-automation-v5";

export interface AutomatedActionStrategyOption extends Omit<
  BotStrategyDescriptorV1,
  "schemaVersion" | "game" | "strategyVersion" | "cardProfileVersion" | "productionEligible"
> {
  id: string;
  label: string;
  description: string;
  strategy: AIStrategy;
  informationPolicy: BotInformationPolicy;
  testOnly?: boolean;
}

interface AutomatedActionPromotion {
  readonly promotedStrategyId: string;
  readonly informationPolicy: BotInformationPolicy;
  readonly strategyConfig?: Readonly<Record<string, unknown>>;
}

const STATIC_AUTOMATED_ACTION_STRATEGIES: readonly AutomatedActionStrategyOption[] = [
  {
    id: "default",
    label: "Default",
    description:
      "Production-like battle heuristic that develops the board and avoids attacks that spend Units into losing fights.",
    strategy: defaultStrategy,
    informationPolicy: "public",
  },
  {
    id: "greedy",
    label: "Greedy",
    description: "Priority-list heuristic exposed for direct simulator and comparison runs.",
    strategy: greedyStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
  {
    id: "tactical",
    label: "Tactical search",
    description:
      "Bounded public-information search that scores the board and models public opponent replies.",
    strategy: tacticalStrategy,
    informationPolicy: "public",
  },
  {
    id: "tactical-ability-aware",
    label: "Ability-aware tactical search",
    description:
      "Bounded public-information search that values card roles, timing windows, and visible board requirements.",
    strategy: abilityAwareTacticalStrategy,
    informationPolicy: "public",
  },
  {
    id: "first-legal",
    label: "First legal",
    description: "Test strategy that picks the first actionable move the engine offers.",
    strategy: firstLegalStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
  {
    id: "random",
    label: "Random",
    description: "Test strategy that samples legal moves and candidates uniformly.",
    strategy: randomStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
  {
    id: "pass-only",
    label: "Pass only",
    description: "Test strategy that advances phases without making proactive plays.",
    strategy: passOnlyStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
  {
    id: "attack-unit-only",
    label: "Attack unit only",
    description: "Test strategy that forces the first available Unit fight, useful for combat QA.",
    strategy: attackUnitOnlyStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
  {
    id: "attack-rival-only",
    label: "Attack rival only",
    description:
      "Test strategy that forces direct rival attacks and passes instead of fighting Units.",
    strategy: attackRivalOnlyStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
  {
    id: "call-legend-only",
    label: "Call legend only",
    description: "Test strategy that calls a Legend when possible, then falls back to passing.",
    strategy: callLegendOnlyStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
];

export function isGreedyWeights(value: unknown): value is GreedyWeights {
  if (!value || typeof value !== "object") return false;
  const weights = value as Partial<GreedyWeights>;
  return (
    typeof weights.ownNearWinThreshold === "number" &&
    typeof weights.rivalNearWinThreshold === "number" &&
    typeof weights.mulliganMinCheapCards === "number" &&
    typeof weights.mulliganCheapCostThreshold === "number" &&
    typeof weights.mulliganMinSellable === "number" &&
    typeof weights.fightMinMargin === "number" &&
    !!weights.defaultPriority &&
    typeof weights.defaultPriority === "object" &&
    !!weights.ownNearWinPriority &&
    typeof weights.ownNearWinPriority === "object" &&
    !!weights.rivalNearWinPriority &&
    typeof weights.rivalNearWinPriority === "object"
  );
}

export function buildAutomatedActionStrategyOptions(
  promotion: AutomatedActionPromotion,
): readonly AutomatedActionStrategyOption[] {
  if (
    STATIC_AUTOMATED_ACTION_STRATEGIES.some((option) => option.id === promotion.promotedStrategyId)
  ) {
    return STATIC_AUTOMATED_ACTION_STRATEGIES;
  }

  const weights = promotion.strategyConfig?.greedyWeights;
  if (!isGreedyWeights(weights)) return STATIC_AUTOMATED_ACTION_STRATEGIES;

  return [
    {
      id: promotion.promotedStrategyId,
      label: `${promotion.promotedStrategyId} (promoted)`,
      description: "Promoted greedy strategy reconstructed from its audited bot-lab weights.",
      strategy: createGreedyStrategy(weights, promotion.promotedStrategyId),
      informationPolicy: promotion.informationPolicy,
    },
    ...STATIC_AUTOMATED_ACTION_STRATEGIES,
  ];
}

export const AUTOMATED_ACTION_STRATEGIES = buildAutomatedActionStrategyOptions(
  currentPromotion as AutomatedActionPromotion,
);

export const DEFAULT_AUTOMATED_ACTION_STRATEGY_ID = AUTOMATED_ACTION_STRATEGIES.some(
  (option) => option.id === currentPromotion.promotedStrategyId,
)
  ? currentPromotion.promotedStrategyId
  : "default";

export function getAutomatedActionStrategyOption(
  strategyId: string,
): AutomatedActionStrategyOption | undefined {
  return AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function getSafeAutomatedActionStrategyOption(
  strategyId?: string | null,
): AutomatedActionStrategyOption {
  const requestedId =
    !strategyId || (strategyId === "default" && DEFAULT_AUTOMATED_ACTION_STRATEGY_ID !== "default")
      ? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID
      : strategyId;
  const requestedOption = getAutomatedActionStrategyOption(requestedId);
  if (requestedOption) return requestedOption;

  const defaultOption =
    getAutomatedActionStrategyOption(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID) ??
    AUTOMATED_ACTION_STRATEGIES[0];
  if (defaultOption) return defaultOption;

  throw new Error("No Cyberpunk automated action strategies are registered.");
}
