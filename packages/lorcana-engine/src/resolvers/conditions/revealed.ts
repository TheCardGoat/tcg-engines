import type { RevealedMatchesNamedCondition } from "@tcg/lorcana-types";
import { conditionRegistry } from "../condition-registry";

conditionRegistry.register<RevealedMatchesNamedCondition>(
  "revealed-matches-named",
  {
    complexity: 40,
    evaluate: (_condition, _sourceCard, { state, context, registry }) => {
      const namedCard = state.external.namedCard;
      if (!namedCard) return false;

      // Check revealed cards in context
      if (!context?.revealedCards || context.revealedCards.length === 0) {
        return false;
      }

      // Usually checks the "top card" or just "the revealed card"
      // We iterate all revealed cards in context. If any matches, we return true?
      // Or stricter: "If IT matches". Usually implies a single card was revealed.
      // We'll check if ANY of the revealed cards matches the name.

      return context.revealedCards.some((cardId) => {
        // We need lookup definition from registry using the card ID?
        // context.revealedCards are IDs?
        // Wait, context.revealedCards in DSL is string[]. Assuming IDs.

        // We need to look up the card in state to get definitionId?
        // Or if it's from deck, it might not be in state.cards yet?
        // In Lorcana engine, usually cards in deck are fully instantiated or just definitions?
        // If they are IDs, they should be in state.cards (even if in deck).

        const card = state.internal.cards[cardId];
        if (!card) return false;

        const def = registry.getCard(card.definitionId);
        if (!def) return false;

        return def.name === namedCard || def.fullName === namedCard;
      });
    },
  },
);
