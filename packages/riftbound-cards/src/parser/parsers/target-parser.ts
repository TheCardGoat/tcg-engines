/**
 * Target Parser
 *
 * Parses target descriptions into structured Target objects.
 */

import type {
  AnyTarget,
  Location,
  Quantity,
  Target,
  TargetController,
} from "@tcg/riftbound-types/targeting";

/**
 * Parse a target string into an AnyTarget object
 *
 * @param text - The target string to parse (e.g., "me", "a friendly unit", "an enemy unit")
 * @returns AnyTarget object
 *
 * @example
 * parseTarget("me")
 * // Returns: "self"
 *
 * @example
 * parseTarget("a friendly unit")
 * // Returns: { type: "unit", controller: "friendly" }
 *
 * @example
 * parseTarget("an enemy unit")
 * // Returns: { type: "unit", controller: "enemy" }
 */
export function parseTarget(text: string): AnyTarget {
  const normalized = text.toLowerCase().trim();

  // Self reference
  if (normalized === "me" || normalized === "it" || normalized === "itself") {
    return "self";
  }

  // Parse "a/an [controller] unit" patterns
  const unitPattern =
    /^(?:a|an|that|the)?\s*(friendly\s+|enemy\s+)?(unit|units?)$/i;
  const match = normalized.match(unitPattern);

  if (match) {
    const controllerStr = match[1]?.trim();
    const controller = parseController(controllerStr);

    const target: Target = {
      type: "unit",
    };

    if (controller) {
      return { ...target, controller };
    }

    return target;
  }

  // Default to unit target
  return { type: "unit" };
}

/**
 * Parse controller string to TargetController
 */
function parseController(
  controllerStr: string | undefined,
): TargetController | undefined {
  if (!controllerStr) {
    return undefined;
  }

  const normalized = controllerStr.toLowerCase().trim();

  if (normalized === "friendly") {
    return "friendly";
  }
  if (normalized === "enemy") {
    return "enemy";
  }

  return undefined;
}

/**
 * Parse quantity string to Quantity
 *
 * @param text - The quantity string (e.g., "a", "an", "up to 2", "all")
 * @returns Quantity value
 */
export function parseQuantity(text: string): Quantity | undefined {
  const normalized = text.toLowerCase().trim();

  // "a" or "an" means exactly 1
  if (normalized === "a" || normalized === "an") {
    return 1;
  }

  // "all" means all matching
  if (normalized === "all") {
    return "all";
  }

  // "up to N" pattern
  const upToMatch = normalized.match(/^up to (\d+)$/);
  if (upToMatch) {
    return { upTo: Number.parseInt(upToMatch[1], 10) };
  }

  // Exact number
  const exactMatch = normalized.match(/^(\d+)$/);
  if (exactMatch) {
    return Number.parseInt(exactMatch[1], 10);
  }

  return undefined;
}

/**
 * Parse a target string with quantity into a Target object
 *
 * @param quantityStr - The quantity string (e.g., "a", "up to 2")
 * @param targetStr - The target description (e.g., "friendly unit", "enemy units")
 * @returns Target object with quantity
 */
export function parseTargetWithQuantity(
  quantityStr: string,
  targetStr: string,
): Target {
  const quantity = parseQuantity(quantityStr);
  const baseTarget = parseTarget(targetStr);

  // If baseTarget is a string (like "self"), convert to Target
  if (typeof baseTarget === "string") {
    return { type: "unit" };
  }

  // If baseTarget is not a card target, return as-is
  if (!("type" in baseTarget) || baseTarget.type === "player") {
    return { type: "unit" };
  }

  const target: Target = { ...baseTarget } as Target;

  if (quantity !== undefined && quantity !== 1) {
    return { ...target, quantity };
  }

  return target;
}
