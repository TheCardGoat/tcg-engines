/**
 * Stat Modification Effect Parser
 * Handles stat modification effects like "chosen character gets +2 strength" or "Your characters get +1 {S}"
 */

import type { CstNode, IToken } from "chevrotain";
import { logger } from "../../logging";
import type { CharacterTarget, ModifyStatEffect } from "../../types";
import type { EffectParser } from "./index";

/**
 * Helper function to parse numeric values or {d} placeholders
 * Converts {d} to -1 as a placeholder value
 */
function parseNumericValue(value: string): number {
  if (value === "{d}") {
    return -1; // Placeholder value for {d}
  }

  // Remove optional + prefix
  const cleaned = value.replace(/^\+/, "");
  const parsed = Number.parseInt(cleaned, 10);

  if (Number.isNaN(parsed)) {
    return -1; // Fallback for unparseable values
  }

  return parsed;
}

/**
 * Parse stat modification effect from CST node (grammar-based parsing)
 */
function parseFromCst(
  ctx:
    | {
        NumberToken?: IToken[];
        Identifier?: IToken[];
        [key: string]: unknown;
      }
    | null
    | undefined,
): ModifyStatEffect | null {
  logger.debug("Attempting to parse stat modification effect from CST", {
    ctx,
  });

  // Handle null/undefined context or missing expected structure
  if (!(ctx && ctx.NumberToken) || ctx.NumberToken.length === 0) {
    logger.debug("Stat mod effect CST missing NumberToken or invalid context");
    return null;
  }

  const modifier = Number.parseInt(ctx.NumberToken[0].image, 10);

  if (Number.isNaN(modifier)) {
    logger.warn("Failed to parse number from stat mod effect CST", {
      image: ctx.NumberToken[0].image,
    });
    return null;
  }

  // Default stat if not specified
  const stat: "strength" | "willpower" | "lore" = "strength";

  logger.info("Parsed stat modification effect from CST", { modifier, stat });

  return {
    type: "modify-stat",
    stat,
    modifier,
    target: "CHOSEN_CHARACTER" as CharacterTarget,
  };
}

/**
 * Parse stat modification effect from text string (regex-based parsing)
 */
function parseFromText(text: string): ModifyStatEffect | null {
  logger.debug("Attempting to parse stat modification effect from text", {
    text,
  });

  // Check for duration "this turn" clause
  const hasDuration = /this turn/i.test(text);
  const duration: "this-turn" | undefined = hasDuration
    ? "this-turn"
    : undefined;

  // Try pattern with {S}/{L}/{W} notation first (e.g., "Your characters get +1 {S}")
  let match = text.match(/get(?:s)?\s+([+-]?)(\d+|\{d\})\s+\{([SLW])\}/i);

  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const valueStr = match[2];
    const value = valueStr === "{d}" ? -1 : Number.parseInt(valueStr, 10);
    const modifier = sign * value;

    const statSymbol = match[3];
    const stat =
      statSymbol === "S"
        ? "strength"
        : statSymbol === "W"
          ? "willpower"
          : "lore";

    // Try to determine target from text
    // Order matters: check more specific patterns first
    let target: CharacterTarget = "CHOSEN_CHARACTER";
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("this character") ||
      lowerText.includes("this card")
    ) {
      target = "SELF";
    } else if (/your\s+(?:\w+\s+)?characters/.test(lowerText)) {
      // "Your characters", "Your Hero characters", "Your inkborn characters"
      target = "YOUR_CHARACTERS";
    } else if (lowerText.includes("your items")) {
      target = "YOUR_ITEMS" as CharacterTarget;
    } else if (lowerText.includes("while here")) {
      target = "CHARACTERS_HERE" as CharacterTarget;
    } else if (lowerText.includes("chosen character")) {
      // Use detailed target format for "chosen character"
      target = {
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      };
    }

    logger.info("Parsed stat modification effect from text", {
      modifier,
      stat,
      target,
      duration,
    });

    const effect: ModifyStatEffect = {
      type: "modify-stat",
      stat,
      modifier,
      target,
    };

    if (duration) {
      effect.duration = duration;
    }

    return effect;
  }

  // Try pattern with full stat name (e.g., "chosen character gets +2 strength")
  match = text.match(
    /get(?:s)?\s+([+-])(\d+|\{d\})\s+(strength|willpower|lore)/i,
  );

  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const valueStr = match[2];
    const value = valueStr === "{d}" ? -1 : Number.parseInt(valueStr, 10);
    const modifier = sign * value;
    const stat = match[3].toLowerCase() as "strength" | "willpower" | "lore";

    // Try to determine target from text
    let target: CharacterTarget = "CHOSEN_CHARACTER";
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("this character") ||
      lowerText.includes("this card")
    ) {
      target = "SELF";
    } else if (/your\s+(?:\w+\s+)?characters/.test(lowerText)) {
      // "Your characters", "Your Hero characters", "Your inkborn characters"
      target = "YOUR_CHARACTERS";
    } else if (lowerText.includes("your items")) {
      target = "YOUR_ITEMS" as CharacterTarget;
    } else if (lowerText.includes("chosen character")) {
      // Use detailed target format for "chosen character"
      target = {
        selector: "chosen",
        count: 1,
        owner: "any",
        zones: ["play"],
        cardTypes: ["character"],
      };
    }

    logger.info("Parsed stat modification effect from text", {
      modifier,
      stat,
      target,
      duration,
    });

    const effect: ModifyStatEffect = {
      type: "modify-stat",
      stat,
      modifier,
      target,
    };

    if (duration) {
      effect.duration = duration;
    }

    return effect;
  }

  logger.debug("Stat modification effect pattern did not match");
  return null;
}

/**
 * Stat modification effect parser implementation
 */
export const statModEffectParser: EffectParser = {
  pattern:
    /gets?\s+([+-]?\d+|[+-]?\{d\})\s+(?:\{([SLW])\}|(strength|willpower|lore))/i,
  description:
    "Parses stat modification effects (e.g., 'gets +2 strength', 'Your characters get +1 {S}')",

  parse: (input: CstNode | string): ModifyStatEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(
      input as
        | { NumberToken?: IToken[]; Identifier?: IToken[] }
        | null
        | undefined,
    );
  },
};
