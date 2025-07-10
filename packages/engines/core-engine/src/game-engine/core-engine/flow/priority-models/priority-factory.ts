import type { FlowConfiguration } from "../flow-manager";
import { createAPNAPPriorityModel } from "./apnap-priority";
import type { PriorityModel } from "./priority-model";
import { createTurnBasedPriorityModel } from "./turn-based-priority";

/**
 * Creates the appropriate priority model based on game configuration
 * @param config Flow configuration
 * @returns Priority model instance
 */
export function createPriorityModel<G = any>(
  config: FlowConfiguration,
): PriorityModel<G> {
  // Handle malformed config
  if (!config?.priority) {
    return createTurnBasedPriorityModel<G>();
  }

  // Check for custom priority model first
  if (config.priority.customPriorityModel) {
    return config.priority.customPriorityModel as PriorityModel<G>;
  }

  // Otherwise create based on configuration
  switch (config.priority.priorityModel) {
    case "apnap":
      return createAPNAPPriorityModel<G>();

    case "focus-based":
      // For focus-based, we need a determination function
      // Default to turn-based for now
      console.warn(
        "Focus-based priority model not yet implemented. " +
          "Falling back to turn-based priority.",
      );
      return createTurnBasedPriorityModel<G>();

    default:
      // Default to turn-based model
      return createTurnBasedPriorityModel<G>();
  }
}
