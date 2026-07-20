import type { BotInformationPolicy } from "@tcg/bot-core";

import currentPromotion from "./promotions/current.json" with { type: "json" };
import { combatAwareStrategy } from "./combat-aware-strategy.ts";
import { greedyLegalStrategy } from "./greedy-legal-strategy.ts";
import { passOnlyStrategy } from "./pass-only-strategy.ts";
import { strategicStrategy } from "./strategic-strategy.ts";
import { tempoStrategy } from "./tempo-strategy.ts";
import type { CandidateStrategy } from "./types.ts";
import { valueRankedStrategy } from "./value-ranked-strategy.ts";

export type GundamAutomatedActionStrategyId =
  | "combat-aware"
  | "greedy-legal"
  | "pass-only"
  | "strategic"
  | "tempo"
  | "value-ranked";

export interface GundamAutomatedActionStrategyOption {
  readonly id: GundamAutomatedActionStrategyId;
  readonly label: string;
  readonly description: string;
  readonly informationPolicy: BotInformationPolicy;
  readonly strategy: CandidateStrategy;
  readonly testOnly?: boolean;
}

export const GUNDAM_AUTOMATED_ACTION_STRATEGIES: readonly GundamAutomatedActionStrategyOption[] = [
  {
    id: "combat-aware",
    label: "Combat aware (Oracle information)",
    description:
      "Effective-stat attacks and selective Blocker decisions proven by paired evaluation.",
    informationPolicy: "oracle",
    strategy: combatAwareStrategy,
  },
  {
    id: "strategic",
    label: "Strategic (Oracle information)",
    description: "Board-development and closing-pressure strategy proven by paired evaluation.",
    informationPolicy: "oracle",
    strategy: strategicStrategy,
  },
  {
    id: "value-ranked",
    label: "Value ranked (Oracle information)",
    description: "Production value strategy with access to the authoritative strategy context.",
    informationPolicy: "oracle",
    strategy: valueRankedStrategy,
  },
  {
    id: "tempo",
    label: "Tempo (Oracle information)",
    description: "Legality-aware tempo strategy with access to the authoritative strategy context.",
    informationPolicy: "oracle",
    strategy: tempoStrategy,
  },
  {
    id: "greedy-legal",
    label: "Greedy legal (Oracle information)",
    description: "Deterministic family-priority strategy over optimistic candidates.",
    informationPolicy: "oracle",
    strategy: greedyLegalStrategy,
  },
  {
    id: "pass-only",
    label: "Pass only",
    description: "Test strategy that advances mandatory setup and pass actions.",
    informationPolicy: "public",
    strategy: passOnlyStrategy,
    testOnly: true,
  },
];

/** Semantic fingerprint for automation and strategy implementation changes. */
export const GUNDAM_AUTOMATION_REVISION = "6";

function isStrategyId(value: string): value is GundamAutomatedActionStrategyId {
  return GUNDAM_AUTOMATED_ACTION_STRATEGIES.some((option) => option.id === value);
}

export const DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID: GundamAutomatedActionStrategyId =
  isStrategyId(currentPromotion.promotedStrategyId)
    ? currentPromotion.promotedStrategyId
    : "value-ranked";

export function getGundamAutomatedActionStrategyOption(
  strategyId: string,
): GundamAutomatedActionStrategyOption | undefined {
  return GUNDAM_AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function getSafeGundamAutomatedActionStrategyOption(
  strategyId?: string | null,
): GundamAutomatedActionStrategyOption {
  return (
    (strategyId ? getGundamAutomatedActionStrategyOption(strategyId) : undefined) ??
    getGundamAutomatedActionStrategyOption(DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID) ??
    GUNDAM_AUTOMATED_ACTION_STRATEGIES[0]!
  );
}
