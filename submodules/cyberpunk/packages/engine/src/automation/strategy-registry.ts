import {
  attackUnitOnlyStrategy,
  callLegendOnlyStrategy,
  defaultStrategy,
  firstLegalStrategy,
  greedyStrategy,
  passOnlyStrategy,
  randomStrategy,
} from "./strategies/index.ts";
import type { AIStrategy } from "./types.ts";

export interface AutomatedActionStrategyOption {
  id: string;
  label: string;
  description: string;
  strategy: AIStrategy;
  testOnly?: boolean;
}

export const DEFAULT_AUTOMATED_ACTION_STRATEGY_ID = "default";

export const AUTOMATED_ACTION_STRATEGIES: readonly AutomatedActionStrategyOption[] = [
  {
    id: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    label: "Default",
    description:
      "Production-like battle heuristic that develops the board and avoids attacks that spend Units into losing fights.",
    strategy: defaultStrategy,
  },
  {
    id: "greedy",
    label: "Greedy",
    description: "Priority-list heuristic exposed for direct simulator and comparison runs.",
    strategy: greedyStrategy,
    testOnly: true,
  },
  {
    id: "first-legal",
    label: "First legal",
    description: "Test strategy that picks the first actionable move the engine offers.",
    strategy: firstLegalStrategy,
    testOnly: true,
  },
  {
    id: "random",
    label: "Random",
    description: "Test strategy that samples legal moves and candidates uniformly.",
    strategy: randomStrategy,
    testOnly: true,
  },
  {
    id: "pass-only",
    label: "Pass only",
    description: "Test strategy that advances phases without making proactive plays.",
    strategy: passOnlyStrategy,
    testOnly: true,
  },
  {
    id: "attack-unit-only",
    label: "Attack unit only",
    description: "Test strategy that forces the first available Unit fight, useful for combat QA.",
    strategy: attackUnitOnlyStrategy,
    testOnly: true,
  },
  {
    id: "call-legend-only",
    label: "Call legend only",
    description: "Test strategy that calls a Legend when possible, then falls back to passing.",
    strategy: callLegendOnlyStrategy,
    testOnly: true,
  },
];

export function getAutomatedActionStrategyOption(
  strategyId: string,
): AutomatedActionStrategyOption | undefined {
  return AUTOMATED_ACTION_STRATEGIES.find((option) => option.id === strategyId);
}

export function getSafeAutomatedActionStrategyOption(
  strategyId?: string | null,
): AutomatedActionStrategyOption {
  const requestedOption = strategyId ? getAutomatedActionStrategyOption(strategyId) : undefined;
  if (requestedOption) return requestedOption;

  const defaultOption =
    getAutomatedActionStrategyOption(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID) ??
    AUTOMATED_ACTION_STRATEGIES[0];
  if (defaultOption) return defaultOption;

  throw new Error("No Cyberpunk automated action strategies are registered.");
}
