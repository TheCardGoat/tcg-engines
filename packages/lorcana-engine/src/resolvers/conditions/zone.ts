import type { CardInstance, PlayerId } from "@tcg/core";
import type {
  AtLocationCondition,
  HasCharacterHereCondition,
  HasNamedLocationCondition,
  ZoneCondition,
} from "../../cards/abilities/types/condition-types";
import type { LorcanaCardMeta } from "../../types/game-state";
import { conditionRegistry } from "../condition-registry";

conditionRegistry.register<ZoneCondition>("zone", {
  complexity: 20,
  evaluate: (condition, sourceCard, { state, registry }) => {
    // Determine target controller
    const targetControllerId =
      condition.controller === "you"
        ? sourceCard.controller
        : (Object.keys(state.external.loreScores).find(
            (id) => id !== sourceCard.controller,
          ) as PlayerId);

    if (!targetControllerId) return false;

    // Filter cards
    const matchingCards = Object.values(state.internal.cards).filter((c) => {
      if (c.controller !== targetControllerId) return false;
      if (c.zone !== condition.zone) return false;

      // Registry check
      if (condition.cardType || condition.cardName) {
        const def = registry.getCard(c.definitionId);
        if (!def) return false;
        if (condition.cardType && def.cardType !== condition.cardType)
          return false;
        if (condition.cardName && def.name !== condition.cardName) return false;
      }

      return true;
    });

    if (condition.hasCards !== undefined) {
      return matchingCards.length > 0 === condition.hasCards;
    }

    return matchingCards.length > 0;
  },
});

conditionRegistry.register<AtLocationCondition>("at-location", {
  complexity: 20,
  evaluate: (_condition, sourceCard) => {
    // Check if sourceCard has attached location
    return !!sourceCard.atLocationId;
  },
});

conditionRegistry.register<HasCharacterHereCondition>("has-character-here", {
  complexity: 30,
  evaluate: (_condition, sourceCard, { state }) => {
    // Check all cards in play to see if their 'atLocationId' matches sourceCard.instanceId
    return Object.values(state.internal.cards).some((c) => {
      const card = c as CardInstance<LorcanaCardMeta>;
      return card.zone === "play" && card.atLocationId === sourceCard.id;
    });
  },
});

conditionRegistry.register<HasNamedLocationCondition>("has-named-location", {
  complexity: 40,
  evaluate: (condition, sourceCard, { state, registry }) => {
    return Object.values(state.internal.cards).some((c) => {
      if (c.zone !== "play") return false;
      const def = registry.getCard(c.definitionId);
      if (def?.cardType !== "location") return false;
      if (condition.name && def.name !== condition.name) return false;

      if (condition.controller === "you")
        return c.controller === sourceCard.controller;
      if (condition.controller === "opponent")
        return c.controller !== sourceCard.controller;
      return true;
    });
  },
});
