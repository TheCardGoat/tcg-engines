/**
 * Effect Parser
 *
 * Parses effect text into structured Effect objects.
 */

import type {
  MoveEffect,
  RecallEffect,
} from "@tcg/riftbound-types/abilities/effect-types";
import type { Location, Target } from "@tcg/riftbound-types/targeting";
import {
  MOVE_BASIC_PATTERN,
  MOVE_FROM_TO_PATTERN,
  parseLocationString,
  RECALL_PATTERN,
} from "../patterns/effects";
import { parseQuantity, parseTarget } from "./target-parser";

/**
 * Parse a recall effect from text
 *
 * @param text - The text to parse (e.g., "Recall me.", "Recall a unit exhausted.")
 * @returns RecallEffect if matched, undefined otherwise
 *
 * @example
 * parseRecallEffect("Recall me.")
 * // Returns: { type: "recall", target: "self" }
 *
 * @example
 * parseRecallEffect("Recall me exhausted.")
 * // Returns: { type: "recall", target: "self", exhausted: true }
 */
export function parseRecallEffect(text: string): RecallEffect | undefined {
  const match = RECALL_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const targetStr = match[1];
  const exhaustedStr = match[2];

  const target = parseTarget(targetStr);
  const exhausted = exhaustedStr?.toLowerCase() === "exhausted";

  if (exhausted) {
    return {
      type: "recall",
      target,
      exhausted: true,
    };
  }

  return {
    type: "recall",
    target,
  };
}

/**
 * Parse a move effect from text
 *
 * @param text - The text to parse (e.g., "Move a friendly unit.", "Move a unit from battlefield to base.")
 * @returns MoveEffect if matched, undefined otherwise
 *
 * @example
 * parseMovEffect("Move a friendly unit.")
 * // Returns: { type: "move", target: { type: "unit", controller: "friendly" }, to: "base" }
 */
export function parseMoveEffect(text: string): MoveEffect | undefined {
  // Try from/to pattern first (more specific)
  const fromToMatch = MOVE_FROM_TO_PATTERN.exec(text);
  if (fromToMatch) {
    // fromToMatch[2] is "unit" or "units" - not used since we always target units
    const fromStr = fromToMatch[3];
    const toStr = fromToMatch[4];

    const from = parseLocationString(fromStr);
    const to = parseLocationString(toStr);

    const target: Target = {
      type: "unit",
    };

    return {
      type: "move",
      target,
      to,
      from,
    };
  }

  // Try basic pattern
  const basicMatch = MOVE_BASIC_PATTERN.exec(text);
  if (basicMatch) {
    const quantityStr = basicMatch[1]; // "a", "an", "up to 2"
    const controllerStr = basicMatch[2]?.trim(); // "friendly", "enemy", or undefined
    // basicMatch[3] is "unit" or "units" - not used since we always target units
    const destinationStr = basicMatch[4]; // "to base", "to here", etc. or undefined

    const quantity = parseQuantity(quantityStr);

    const target: Target = {
      type: "unit",
    };

    // Add controller if specified
    if (controllerStr) {
      const controller = controllerStr.toLowerCase() as "friendly" | "enemy";
      (target as { controller: "friendly" | "enemy" }).controller = controller;
    }

    // Add quantity if not 1
    if (quantity !== undefined && quantity !== 1) {
      (target as { quantity: typeof quantity }).quantity = quantity;
    }

    // Parse destination, default to "base" if not specified
    const to: Location = destinationStr
      ? parseLocationString(destinationStr.replace(/^to\s+/, ""))
      : "base";

    return {
      type: "move",
      target,
      to,
    };
  }

  return undefined;
}

/**
 * Parse any movement effect (move or recall) from text
 *
 * @param text - The text to parse
 * @returns MoveEffect or RecallEffect if matched, undefined otherwise
 */
export function parseMovementEffect(
  text: string,
): MoveEffect | RecallEffect | undefined {
  // Try recall first
  const recallEffect = parseRecallEffect(text);
  if (recallEffect) {
    return recallEffect;
  }

  // Try move
  const moveEffect = parseMoveEffect(text);
  if (moveEffect) {
    return moveEffect;
  }

  return undefined;
}
