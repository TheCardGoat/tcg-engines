import type {
  ThisTurnCountCondition,
  ThisTurnHappenedCondition,
} from "@tcg/lorcana-types";
import { conditionRegistry } from "../condition-registry";

conditionRegistry.register<ThisTurnHappenedCondition>("this-turn-happened", {
  complexity: 60,
  evaluate: (condition, sourceCard, { state }) => {
    const events = state.external.turnHistory || [];
    // We need to filter by controller
    const matchedEvents = events.filter((e) => {
      if (e.type !== condition.event) return false;

      if (condition.who === "you") {
        return e.controllerId === sourceCard.controller;
      }

      return e.controllerId !== sourceCard.controller;
    });

    return matchedEvents.length > 0;
  },
});

conditionRegistry.register<ThisTurnCountCondition>("this-turn-count", {
  complexity: 70,
  evaluate: (condition, sourceCard, { state }) => {
    const events = state.external.turnHistory || [];

    const count = events.reduce((acc, e) => {
      if (e.type !== condition.event) return acc;

      let matchesWho = false;
      if (condition.who === "you") {
        matchesWho = e.controllerId === sourceCard.controller;
      } else {
        matchesWho = e.controllerId !== sourceCard.controller;
      }

      if (matchesWho) return acc + e.count;
      return acc;
    }, 0);

    switch (condition.comparison) {
      // @ts-expect-error - comparison operators mismatch
      case "eq":
        return count === condition.count;
      // @ts-expect-error - comparison operators mismatch
      case "ne":
        return count !== condition.count;
      // @ts-expect-error - comparison operators mismatch
      case "gt":
        return count > condition.count;
      // @ts-expect-error - comparison operators mismatch
      case "gte":
        return count >= condition.count;
      // @ts-expect-error - comparison operators mismatch in shared types
      case "lt":
        return count < condition.count;
      // @ts-expect-error - comparison operators mismatch in shared types
      case "lte":
        return count <= condition.count;
      default:
        return false;
    }
  },
});
