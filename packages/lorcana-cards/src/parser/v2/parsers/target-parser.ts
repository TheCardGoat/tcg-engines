/**
 * Target parser stub for v2 tests.
 */

import { parseAtomicEffect } from "../effects/atomic";

/**
 * Target DSL interface.
 */
export interface TargetDSL {
  selector: "chosen" | "all" | "each" | "another" | "other" | "this";
  count: number | "all";
  owner: "you" | "opponent" | "any";
  zones: string[];
  cardTypes: string[];
}

/**
 * Parse target from effect text.
 * This is a simplified stub that extracts target information.
 */
export function parseTarget(text: string) {
  const effect = parseAtomicEffect(text);
  if (effect && "target" in effect) {
    return (effect as { target: unknown }).target;
  }
  return null;
}

/**
 * Parse target with optional modifier.
 */
export function parseTargetWithModifier(text: string) {
  return parseTarget(text);
}

/**
 * Parse character target from text.
 * Returns a Target DSL object for character targets.
 */
export function parseCharacterTarget(text: string): TargetDSL | null {
  const lowerText = text.toLowerCase();

  // Map target string to DSL format
  const result: TargetDSL = {
    selector: "chosen",
    count: 1,
    owner: "any",
    zones: ["play"],
    cardTypes: ["character"],
  };

  // Parse modifier from text
  if (
    lowerText.includes("chosen opposing") ||
    lowerText.includes("opponent's chosen") ||
    lowerText.includes("chosen opposing character")
  ) {
    result.owner = "opponent";
  } else if (
    lowerText.includes("chosen character of yours") ||
    lowerText.includes("your chosen character")
  ) {
    result.owner = "you";
  } else if (lowerText.includes("your characters")) {
    result.owner = "you";
    result.selector = "all";
    result.count = "all";
  } else if (lowerText.includes("this character")) {
    result.owner = "you";
    result.selector = "this";
  }

  if (
    lowerText.includes("all characters") ||
    lowerText.includes("all opposing characters")
  ) {
    result.selector = "all";
    result.count = "all";
    if (lowerText.includes("opposing")) {
      result.owner = "opponent";
    }
  } else if (
    lowerText.includes("each character") ||
    lowerText.includes("each opposing character")
  ) {
    result.selector = "each";
    result.count = 1; // each means count per target
    if (lowerText.includes("opposing")) {
      result.owner = "opponent";
    }
  } else if (lowerText.includes("another character")) {
    result.selector = "another";
  } else if (lowerText.includes("other characters")) {
    result.selector = "other";
  }

  return result;
}

/**
 * Parse item target from text.
 * Returns a Target DSL object for item targets.
 */
export function parseItemTarget(text: string): TargetDSL | null {
  const effect = parseAtomicEffect(text);
  if (!(effect && "target" in effect)) {
    return null;
  }

  const result: TargetDSL = {
    selector: "chosen",
    count: 1,
    owner: "any",
    zones: ["play"],
    cardTypes: ["item"],
  };

  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("chosen opposing") ||
    lowerText.includes("opponent's chosen")
  ) {
    result.owner = "opponent";
  } else if (
    lowerText.includes("chosen item of yours") ||
    lowerText.includes("your chosen")
  ) {
    result.owner = "you";
  }

  if (lowerText.includes("all items")) {
    result.selector = "all";
  } else if (lowerText.includes("each item")) {
    result.selector = "each";
  }

  return result;
}

/**
 * Parse location target from text.
 * Returns a Target DSL object for location targets.
 */
export function parseLocationTarget(text: string): TargetDSL | null {
  const effect = parseAtomicEffect(text);
  if (!(effect && "target" in effect)) {
    return null;
  }

  const result: TargetDSL = {
    selector: "chosen",
    count: 1,
    owner: "any",
    zones: ["play"],
    cardTypes: ["location"],
  };

  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("chosen opposing") ||
    lowerText.includes("opponent's chosen")
  ) {
    result.owner = "opponent";
  } else if (
    lowerText.includes("chosen location of yours") ||
    lowerText.includes("your chosen")
  ) {
    result.owner = "you";
  }

  if (lowerText.includes("all locations")) {
    result.selector = "all";
  }

  return result;
}

/**
 * Parse player target from text.
 * Returns a target string ("CONTROLLER", "OPPONENT", "EACH_PLAYER", "EACH_OPPONENT").
 */
export function parsePlayerTarget(text: string): string | null {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("you draw") ||
    lowerText.includes("you gain") ||
    lowerText.includes("you lose") ||
    lowerText.startsWith("you ")
  ) {
    return "CONTROLLER";
  }
  if (
    lowerText.includes("opponent draw") ||
    lowerText.includes("opponent gain") ||
    lowerText.includes("opponent lose") ||
    lowerText.startsWith("opponent ")
  ) {
    return "OPPONENT";
  }
  if (lowerText.includes("each player")) {
    return "EACH_PLAYER";
  }
  if (lowerText.includes("each opponent")) {
    return "EACH_OPPONENT";
  }

  return null;
}
