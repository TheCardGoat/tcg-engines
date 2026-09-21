import type { DeckStrategyProfile } from "./deck-profile.ts";
import { createTacticalStrategy, isTacticalAIStrategy } from "./search/tactical.ts";
import { bindGreedyDeckProfile, greedyStrategy, isGreedyAIStrategy } from "./strategies/greedy.ts";
import type { AIStrategy } from "./types.ts";

export { isTacticalAIStrategy } from "./search/tactical.ts";
export type { TacticalAIStrategy } from "./search/tactical.ts";

/**
 * Bind a deck strategy profile onto a strategy.
 *
 * Greedy-family strategies get a new instance with the profile applied.
 * Tactical-family strategies keep their search settings and use a profiled
 * greedy fallback for mulligan, combat safety, and hidden-information
 * choices, plus deck-aware action priors for Gear hosts and core cards.
 * Any other strategy is returned unchanged.
 */
export function withDeckProfile(strategy: AIStrategy, profile: DeckStrategyProfile): AIStrategy {
  if (isTacticalAIStrategy(strategy)) {
    if (strategy.deckProfile === profile) return strategy;
    const previous = strategy.tacticalOptions;
    return createTacticalStrategy({
      ...previous,
      name: strategy.name,
      deckProfile: profile,
      fallbackStrategy: bindGreedyDeckProfile(previous.fallbackStrategy ?? greedyStrategy, profile),
    });
  }
  if (isGreedyAIStrategy(strategy)) return bindGreedyDeckProfile(strategy, profile);
  return strategy;
}

/**
 * The deck profile a strategy was bound with, if any. Greedy- and
 * tactical-family strategies carry the profile they were constructed with;
 * every other strategy is unbound by construction.
 */
export function boundDeckProfile(
  strategy: AIStrategy | null | undefined,
): DeckStrategyProfile | undefined {
  if (!strategy) return undefined;
  if (isTacticalAIStrategy(strategy)) return strategy.deckProfile;
  if (isGreedyAIStrategy(strategy)) return strategy.deckProfile;
  return undefined;
}
