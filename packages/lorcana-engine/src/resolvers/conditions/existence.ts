import type { CardInstance } from "@tcg/core";
import type {
  HasCharacterCountCondition,
  HasCharacterWithClassificationCondition,
  HasNamedCharacterCondition,
  ResourceCountCondition,
} from "@tcg/lorcana-types";
import type { LorcanaFilter } from "../../targeting/lorcana-target-dsl";
import type { LorcanaCardMeta, LorcanaGameState } from "../../types/game-state";
import { conditionRegistry } from "../condition-registry";

/**
 * Helper to count cards matching a predicate
 */
function countCards(
  state: LorcanaGameState,
  predicate: (card: CardInstance<LorcanaCardMeta>) => boolean,
): number {
  let count = 0;
  for (const card of Object.values(state.internal.cards)) {
    if (predicate(card as CardInstance<LorcanaCardMeta>)) {
      count++;
    }
  }
  return count;
}

/**
 * Helper to compare numbers
 */
function compare(val: number, op: string, target: number): boolean {
  switch (op) {
    case "eq":
      return val === target;
    case "ne":
      return val !== target;
    case "gt":
      return val > target;
    case "gte":
      return val >= target;
    case "lt":
      return val < target;
    case "lte":
      return val <= target;
    default:
      return false;
  }
}

/**
 * Helper to get zone filter for "in play" (default for "have a character")
 */
function getPlayZoneFilter(
  controller: "you" | "opponent" | "any",
  sourceCard: CardInstance<LorcanaCardMeta>,
): (card: CardInstance<LorcanaCardMeta>) => boolean {
  return (card) => {
    // Check Zone (must be in play)
    if (card.zone !== "play") return false;

    // Check Controller
    if (controller === "you") {
      return card.controller === sourceCard.controller;
    }
    if (controller === "opponent") {
      return card.controller !== sourceCard.controller;
    }
    return true; // any
  };
}

// Register HasNamedCharacterCondition
conditionRegistry.register<HasNamedCharacterCondition>("has-named-character", {
  complexity: 40,
  evaluate: (condition, sourceCard, { state, registry }) => {
    const zoneFilter = getPlayZoneFilter(
      condition.controller ?? "you",
      sourceCard,
    );

    // Check if ANY card matches
    return Object.values(state.internal.cards).some((c) => {
      const card = c as CardInstance<LorcanaCardMeta>;
      if (!zoneFilter(card)) return false;
      if (card.definitionId === undefined) return false;

      const def = registry.getCard(card.definitionId);
      // Usually "named X" implies the name property.
      return (
        def && (def.name === condition.name || def.fullName === condition.name)
      );
    });
  },
});

// Register HasCharacterWithClassificationCondition
conditionRegistry.register<HasCharacterWithClassificationCondition>(
  "has-character-with-classification",
  {
    complexity: 45,
    evaluate: (condition, sourceCard, { state, registry }) => {
      const zoneFilter = getPlayZoneFilter(condition.controller, sourceCard);

      return Object.values(state.internal.cards).some((c) => {
        const card = c as CardInstance<LorcanaCardMeta>;
        if (!zoneFilter(card)) return false;

        // This condition doesn't seem to have a dedicated filterResolver helper in DSL?
        // But we can construct one or manually check.
        const def = registry.getCard(card.definitionId);
        if (def?.cardType !== "character") return false;

        return def.classifications?.includes(condition.classification as any);
      });
    },
  },
);

// Register HasCharacterCountCondition
conditionRegistry.register<HasCharacterCountCondition>("has-character-count", {
  complexity: 50,
  evaluate: (condition, sourceCard, { state, registry }) => {
    const zoneFilter = getPlayZoneFilter(
      condition.controller ?? "you",
      sourceCard,
    );

    let count = 0;

    // Check if there are generic filters?
    // The condition usually implies "Has X characters"
    // Usually no extra filters unless specified.

    count = countCards(state, (c) => {
      if (!zoneFilter(c)) return false;
      const def = registry.getCard(c.definitionId);
      return def?.cardType === "character";
    });

    return compare(count, condition.comparison ?? "gte", condition.count ?? 1);
  },
});

// Register ResourceCountCondition (Ink, Cards in Hand, etc.)
conditionRegistry.register<ResourceCountCondition>("resource-count", {
  complexity: 40,
  evaluate: (condition, sourceCard, { state, registry }) => {
    // Check controller
    const targetOwnerId =
      condition.controller === "you"
        ? sourceCard.controller
        : Object.keys(state.external.loreScores).find(
            (id) => id !== sourceCard.controller,
          );

    if (!targetOwnerId) return false;

    // Helper for specific resource type
    const isTargetController = (cId: string) => cId === targetOwnerId;

    let count = 0;
    switch (condition.what) {
      case "cards-in-hand":
        count = countCards(state, (c) => {
          return c.zone === "hand" && isTargetController(c.controller);
        });
        break;

      case "cards-in-inkwell":
        count = countCards(state, (c) => {
          return c.zone === "inkwell" && isTargetController(c.controller);
        });
        break;

      case "characters":
        // This duplicates has-character-count but under resource-count umbrella
        count = countCards(state, (c) => {
          if (c.zone !== "play" || !isTargetController(c.controller))
            return false;
          const def = registry.getCard(c.definitionId);
          return def?.cardType === "character";
        });
        break;

      case "items":
        count = countCards(state, (c) => {
          if (c.zone !== "play" || !isTargetController(c.controller))
            return false;
          const def = registry.getCard(c.definitionId);
          return def?.cardType === "item";
        });
        break;

      case "locations":
        count = countCards(state, (c) => {
          if (c.zone !== "play" || !isTargetController(c.controller))
            return false;
          const def = registry.getCard(c.definitionId);
          return def?.cardType === "location";
        });
        break;

      case "damage-on-characters" as any:
        // Special case: Total damage on ALL characters?
        // Condition usually is "damage-on-self".
        // If "resource-count" type "damage-on-characters" exists?
        // I don't think it's robustly defined yet.
        break;

      default:
        console.warn(
          `Resource counting for ${condition.what} not fully implemented in existence.ts`,
        );
        return false;
    }

    return compare(count, condition.comparison, condition.value);
  },
});
