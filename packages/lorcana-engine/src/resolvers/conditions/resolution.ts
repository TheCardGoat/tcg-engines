import type { ResolutionCondition, UsedShiftCondition } from "@tcg/lorcana-types";
import { conditionRegistry } from "../condition-registry";

// Register Used-Shift Condition
conditionRegistry.register<UsedShiftCondition>("used-shift", {
  complexity: 5,
  evaluate: (_condition, sourceCard) =>
    Boolean(sourceCard.stackPosition?.cardsUnderneath &&
      sourceCard.stackPosition.cardsUnderneath.length > 0),
});

// Register Resolution Condition (Legacy/Context)
conditionRegistry.register<ResolutionCondition>("resolution", {
  complexity: 10,
  evaluate: (condition, sourceCard, { context }) => {
    if (condition.value === "bodyguard") {
      // Check if we are currently resolving a Bodyguard trigger/check
      return context?.resolutionContext === "bodyguard";
    }

    if (condition.value === "shift") {
      // Check if the card is shifted (similar to used-shift)
      // Or if we are in "shift" resolution?
      // The old docs said "Checks sourceCard.hasShift && sourceCard.meta.shifted"
      // We'll treat it as "is currently a shifted character"
      return Boolean(
        sourceCard.stackPosition?.cardsUnderneath &&
        sourceCard.stackPosition.cardsUnderneath.length > 0,
      );
    }

    return false;
  },
});
