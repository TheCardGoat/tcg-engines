import type { CardInstance } from "@tcg/core";
import type {
  ComparisonCondition,
  ComparisonValue,
} from "../../cards/abilities/types/condition-types";
import type { LorcanaCardMeta, LorcanaGameState } from "../../types/game-state";
import { conditionRegistry } from "../condition-registry";

// Rewriting register to include registry in helper
conditionRegistry.register<ComparisonCondition>("comparison", {
  complexity: 40,
  evaluate: (condition, sourceCard, { state, registry }) => {
    const resolve = (v: ComparisonValue): number => {
      if ("value" in v) return v.value;

      // Types that have controller
      let targetController: string | undefined;
      if ("controller" in v) {
        if (v.controller === "you") {
          targetController = sourceCard.controllerId;
        } else if (v.controller === "opponent") {
          const playerIds = Object.keys(state.external.loreScores);
          targetController = playerIds.find(
            (id) => id !== sourceCard.controllerId,
          );
        }
      }

      if (v.type === "damage-on-self") return sourceCard.meta.damage || 0;

      if (!targetController && v.type !== "strength-of-self") return 0;

      // Needs definitions for Strength/Willpower/Type checks
      if (v.type === "strength-of-self") {
        const def = registry.getCard(sourceCard.definitionId);
        // TODO: Add modifiers? Conditions usually check CURRENT strength.
        // This requires the whole Engine/Modifier system which we might not have access to here.
        // For now, return base strength.
        return def?.strength || 0;
      }

      return resolveValueWithState(v, state, targetController || "", registry);
    };

    const left = resolve(condition.left);
    const right = resolve(condition.right);

    // console.log("Comparison:", { left, right, op: condition.comparison, sourceCtrl: sourceCard.controllerId, keys: Object.keys(sourceCard) });

    switch (condition.comparison) {
      // @ts-expect-error - comparison operators mismatch
      case "eq":
        return left === right;
      // @ts-expect-error - comparison operators mismatch
      case "ne":
        return left !== right;
      // @ts-expect-error - comparison operators mismatch
      case "gt":
        return left > right;
      // @ts-expect-error - comparison operators mismatch
      case "gte":
        return left >= right;
      // @ts-expect-error - comparison operators mismatch
      case "lt":
        return left < right;
      // @ts-expect-error - comparison operators mismatch
      case "lte":
        return left <= right;
      default:
        return false;
    }
  },
});

function resolveValueWithState(
  v: ComparisonValue,
  state: LorcanaGameState,
  targetOwnerId: string,
  registry: any, // Typing as any to avoid circular deps or complex type logic for now
): number {
  if ("value" in v) return v.value;
  if (v.type === "lore") {
    return state.external.loreScores[targetOwnerId as any] || 0;
  }

  // Zone counts
  if (v.type === "cards-in-hand") {
    return Object.values(state.internal.cards).filter(
      (c) => c.zoneId === "hand" && c.controllerId === targetOwnerId,
    ).length;
  }
  if (v.type === "cards-in-inkwell") {
    return Object.values(state.internal.cards).filter(
      (c) => c.zoneId === "inkwell" && c.controllerId === targetOwnerId,
    ).length;
  }
  if (v.type === "character-count") {
    return Object.values(state.internal.cards).filter((c) => {
      if (c.zoneId !== "play" || c.controllerId !== targetOwnerId) return false;
      const def = registry.getCard(c.definitionId);
      return def?.cardType === "character";
    }).length;
  }
  return 0;
}
