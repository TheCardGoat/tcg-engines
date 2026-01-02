import type {
  AndCondition,
  NotCondition,
  OrCondition,
} from "../../cards/abilities/types/condition-types";
import { conditionRegistry } from "../condition-registry";
import { isConditionMet } from "../condition-resolver";

// Register AND Condition
conditionRegistry.register<AndCondition>("and", {
  complexity: 25, // Higher than simple, depends on children
  evaluate: (condition, sourceCard, context) => {
    // Short-circuit: if any is false, return false
    return condition.conditions.every((subCondition) =>
      isConditionMet(
        subCondition,
        sourceCard,
        context.state,
        context.registry,
        context.context,
      ),
    );
  },
});

// Register OR Condition
conditionRegistry.register<OrCondition>("or", {
  complexity: 25,
  evaluate: (condition, sourceCard, context) => {
    // Short-circuit: if any is true, return true
    return condition.conditions.some((subCondition) =>
      isConditionMet(
        subCondition,
        sourceCard,
        context.state,
        context.registry,
        context.context,
      ),
    );
  },
});

// Register NOT Condition
conditionRegistry.register<NotCondition>("not", {
  complexity: 15,
  evaluate: (condition, sourceCard, context) => {
    return !isConditionMet(
      condition.condition,
      sourceCard,
      context.state,
      context.registry,
      context.context,
    );
  },
});
