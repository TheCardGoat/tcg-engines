import type { HasCardUnderCondition } from "../../cards/abilities/types/condition-types";
import { conditionRegistry } from "../condition-registry";

conditionRegistry.register<HasCardUnderCondition>("has-card-under", {
  complexity: 20,
  evaluate: (_condition, sourceCard) => {
    const stack = sourceCard.stackPosition;
    if (!stack) return false;
    // Check if there are cards underneath
    return !!(stack.cardsUnderneath && stack.cardsUnderneath.length > 0);
  },
});
