import {
  attackUnitOnlyStrategy,
  attackRivalOnlyStrategy,
  callLegendOnlyStrategy,
  defaultStrategy,
  createGreedyStrategy,
  type GreedyWeights,
  firstLegalStrategy,
  greedyStrategy,
  passOnlyStrategy,
  randomStrategy,
} from "./strategies/index.ts";
import { abilityAwareTacticalStrategy, tacticalStrategy } from "./search/tactical.ts";
import { expertOracleStrategy } from "./search/expert-oracle.ts";
import type { AIStrategy } from "./types.ts";
import type { BotInformationPolicy, BotStrategyDescriptorV1 } from "@tcg/bot-core";
import currentPromotion from "./promotions/current.json" with { type: "json" };

/** Bump whenever shipped decision behavior changes in a promotion-relevant way. */
export const CYBERPUNK_AUTOMATION_REVISION = "cyberpunk-automation-v16";

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
    label: "Recommended",
    description:
      "Runs Expert (full information). Plans action sequences and opponent replies. Sees both hands, both decks in order, and face-down Legends.",
    strategy: defaultStrategy,
    informationPolicy: "oracle",
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
    label: "Sharp",
    description:
      "Looks ahead before committing: scores the board and plans around the replies the opponent is likely to have.",
    strategy: tacticalStrategy,
    informationPolicy: "public",
  },
  {
    id: "tactical-ability-aware",
    label: "Masterful",
    description:
      "Uses public information to read card roles, timing windows, and visible board requirements when planning.",
    strategy: abilityAwareTacticalStrategy,
    informationPolicy: "public",
  },
  {
    id: "expert-oracle",
    label: "Expert (full information)",
    description:
      "Plans action sequences and opponent replies. Sees both hands, both decks in order, and face-down Legends.",
    strategy: expertOracleStrategy,
    informationPolicy: "oracle",
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
    id: "attack-rival-only",
    label: "Always attack",
    description:
      "A sparring partner that attacks the rival Gig area whenever it can and never fights Units.",
    strategy: attackRivalOnlyStrategy,
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
    id: "call-legend-only",
    label: "Call legend only",
    description: "Test strategy that calls a Legend when possible, then falls back to passing.",
    strategy: callLegendOnlyStrategy,
    informationPolicy: "public",
    testOnly: true,
  },
  {
    id: "pass-only",
    label: "Only passes",
    description:
      "A practice dummy that never plays cards — it advances phases so you can develop freely.",
    strategy: passOnlyStrategy,
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
  if (!isGreedyWeights(weights)) {
    return STATIC_AUTOMATED_ACTION_STRATEGIES;
  }

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

// Bot games explicitly permit hidden information. Keep this choice separate
// from currentPromotion, which records the older public-information lab audit.
export const DEFAULT_AUTOMATED_ACTION_STRATEGY_ID = "expert-oracle";

export function getAutomatedActionStrategyOption(
  strategyId: string,
): AutomatedActionStrategyOption | undefined {
  return AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function getSafeAutomatedActionStrategyOption(
  strategyId?: string | null,
): AutomatedActionStrategyOption {
  const requestedId =
    !strategyId || strategyId === "default" ? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID : strategyId;
  const requestedOption = getAutomatedActionStrategyOption(requestedId);
  if (requestedOption) return requestedOption;

  const defaultOption =
    getAutomatedActionStrategyOption(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID) ??
    AUTOMATED_ACTION_STRATEGIES[0];
  if (defaultOption) return defaultOption;

  throw new Error("No Cyberpunk automated action strategies are registered.");
}
