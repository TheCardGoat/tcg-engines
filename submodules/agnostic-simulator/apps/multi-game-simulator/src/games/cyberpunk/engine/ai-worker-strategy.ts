import {
  AUTOMATED_ACTION_STRATEGIES,
  getSafeAutomatedActionStrategyOption,
  withDeckProfile,
  type AIStrategy,
  type DeckStrategyProfile,
} from "@tcg/cyberpunk-engine";

export interface WorkerStrategy {
  id: string;
  profile?: DeckStrategyProfile;
}

const configuredStrategies = new WeakMap<AIStrategy, WorkerStrategy>();

/** Track configuration explicitly: a custom strategy may reuse a registry name. */
export function workerStrategyFor(strategy: AIStrategy): WorkerStrategy | null {
  const configured = configuredStrategies.get(strategy);
  if (configured) return configured;
  const registered = AUTOMATED_ACTION_STRATEGIES.find((entry) => entry.strategy === strategy);
  return registered ? { id: registered.id } : null;
}

export function createBrowserAiStrategy(id: string, profile?: DeckStrategyProfile): AIStrategy {
  const option = getSafeAutomatedActionStrategyOption(id);
  const bound = profile ? withDeckProfile(option.strategy, profile) : option.strategy;
  const strategy = id === "default" ? { ...bound, name: "default" } : bound;
  configuredStrategies.set(strategy, { id: option.id, ...(profile ? { profile } : {}) });
  return strategy;
}
