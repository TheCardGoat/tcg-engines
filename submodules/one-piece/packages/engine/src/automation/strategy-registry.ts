import type { BotInformationPolicy } from "@tcg/bot-core";
import currentPromotion from "./promotions/current.json" with { type: "json" };

import {
  firstLegalStrategy,
  greedyStrategy,
  passOnlyStrategy,
  randomStrategy,
  valueRankedStrategy,
  type OnePieceBotPromptResolver,
  type OnePieceBotStrategy,
} from "./bot-strategies.ts";
import { aggressiveAgent, heuristicAgent } from "./heuristic-strategy.ts";

export interface OnePieceAutomatedActionStrategyOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly informationPolicy: BotInformationPolicy;
  readonly strategy: OnePieceBotStrategy;
  readonly resolvePrompt?: OnePieceBotPromptResolver;
  readonly testOnly?: boolean;
}

export const DEFAULT_ONE_PIECE_AUTOMATED_ACTION_STRATEGY_ID = currentPromotion.promotedStrategyId;

export const ONE_PIECE_AUTOMATED_ACTION_STRATEGIES: readonly OnePieceAutomatedActionStrategyOption[] =
  [
    {
      id: "heuristic",
      label: "Heuristic (Oracle information)",
      description:
        "Rules-aware balanced heuristic: on-curve development, DON!! planning, counter/blocker defense, and effect target heuristics.",
      informationPolicy: "oracle",
      strategy: heuristicAgent.choose,
      resolvePrompt: heuristicAgent.resolvePrompt,
    },
    {
      id: "aggressive",
      label: "Aggressive life-race (Oracle information)",
      description:
        "Rules-aware aggressive heuristic: leader pressure, Rush prioritization, offensive DON!! attachment, and early life defense.",
      informationPolicy: "oracle",
      strategy: aggressiveAgent.choose,
      resolvePrompt: aggressiveAgent.resolvePrompt,
    },
    {
      id: "value-ranked",
      label: "Value ranked (Oracle information)",
      description: "Production baseline using full engine state and value-ranked action scoring.",
      informationPolicy: "oracle",
      strategy: valueRankedStrategy,
    },
    {
      id: "greedy",
      label: "Greedy (Oracle information)",
      description: "Priority-weighted full-state baseline.",
      informationPolicy: "oracle",
      strategy: greedyStrategy,
    },
    {
      id: "first-legal",
      label: "First legal (Oracle information)",
      description: "Deterministic test strategy that submits the first representable command.",
      informationPolicy: "oracle",
      strategy: firstLegalStrategy,
      testOnly: true,
    },
    {
      id: "random",
      label: "Seeded random (Oracle information)",
      description: "Deterministic seeded random test strategy.",
      informationPolicy: "oracle",
      strategy: randomStrategy,
      testOnly: true,
    },
    {
      id: "pass-only",
      label: "Pass only (Oracle information)",
      description: "Setup-and-pass test strategy.",
      informationPolicy: "oracle",
      strategy: passOnlyStrategy,
      testOnly: true,
    },
  ];

export function getOnePieceAutomatedActionStrategyOption(
  strategyId: string,
): OnePieceAutomatedActionStrategyOption | undefined {
  return ONE_PIECE_AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function getSafeOnePieceAutomatedActionStrategyOption(
  strategyId?: string | null,
): OnePieceAutomatedActionStrategyOption {
  return resolveOnePieceAutomatedActionStrategyOption(
    strategyId,
    DEFAULT_ONE_PIECE_AUTOMATED_ACTION_STRATEGY_ID,
  );
}

export function resolveOnePieceAutomatedActionStrategyOption(
  strategyId: string | null | undefined,
  defaultStrategyId: string,
): OnePieceAutomatedActionStrategyOption {
  return (
    (strategyId ? getOnePieceAutomatedActionStrategyOption(strategyId) : undefined) ??
    getOnePieceAutomatedActionStrategyOption(defaultStrategyId) ??
    ONE_PIECE_AUTOMATED_ACTION_STRATEGIES[0]!
  );
}
