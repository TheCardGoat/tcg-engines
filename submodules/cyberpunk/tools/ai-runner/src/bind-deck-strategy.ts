import { withDeckProfile, type AIStrategy, type DeckStrategyProfile } from "@tcg/cyberpunk-engine";
import { resolveDeckProfile } from "@tcg/cyberpunk-utils";

export interface BindableDeck {
  readonly id?: string;
  readonly legends?: readonly string[];
  readonly mainDeck?: readonly string[];
}

/**
 * Bind an authored plan onto a seat. An authored fixture id wins; otherwise
 * the card bag is matched against the core-interaction signatures.
 */
export function bindStrategyToDeck(strategy: AIStrategy, deck: string | BindableDeck): AIStrategy {
  const deckId = typeof deck === "string" ? deck : deck.id;
  const cards =
    typeof deck === "string" ? undefined : [...(deck.legends ?? []), ...(deck.mainDeck ?? [])];
  const profile = resolveDeckProfile({ deckId, cards });
  return profile ? withDeckProfile(strategy, profile as DeckStrategyProfile) : strategy;
}
