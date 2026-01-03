/**
 * Repeat Effect Parser
 * Handles repeat effects like "X, Y times" or "do X Y times"
 * Parses effects that are executed multiple times
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { RepeatEffect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";

/**
 * Parse repeat effect from text string.
 * Identifies patterns where an effect is repeated N times.
 */
function parseFromText(text: string): RepeatEffect | null {
  logger.debug("Attempting to parse repeat effect from text", { text });

  // Match "X, Y times" pattern - effect followed by count
  const repeatPattern1 = /(.+),\s*(\d+)\s+times?/i;
  const match1 = text.match(repeatPattern1);

  if (match1) {
    const effectText = match1[1].trim();
    const timesStr = match1[2];
    const times = Number.parseInt(timesStr, 10);

    if (Number.isNaN(times)) {
      logger.warn("Failed to parse repeat count", { timesStr });
      return null;
    }

    logger.debug("Found repeat pattern (X, Y times)", { effectText, times });

    // Parse the effect part
    const effect = parseAtomicEffect(effectText);

    if (!effect) {
      logger.warn("Failed to parse repeat effect", { effectText });
      return null;
    }

    logger.info("Parsed repeat effect", { effect, times });

    return {
      type: "repeat",
      times,
      effect,
    };
  }

  // Match "repeat this/that Y times" pattern (with optional "up to")
  const repeatPattern2 =
    /(?:you may\s+)?repeat\s+(?:this|that|the above effect)(?:\s+up\s+to\s+(\d+)\s+times|(?:\s+(\d+)\s+times?))?/i;
  const match2 = text.match(repeatPattern2);

  if (match2) {
    // Match group 1 is for "up to X times", group 2 is for "X times"
    const timesStr = match2[1] || match2[2];
    const times = timesStr ? Number.parseInt(timesStr, 10) : undefined;

    if (times !== undefined && Number.isNaN(times)) {
      logger.warn("Failed to parse repeat count", { timesStr });
      return null;
    }

    logger.debug("Found repeat pattern (repeat this/that Y times)", { times });

    // For "repeat this/that", we need the previous effect which isn't available here
    // Return null to indicate this pattern needs to be handled at a higher level
    logger.debug(
      "Repeat this/that pattern requires context - not handling at this level",
    );
    return null;
  }

  // Match "do X Y times" pattern - explicit "do" keyword
  const repeatPattern3 = /do\s+(.+)\s+(\d+)\s+times?/i;
  const match3 = text.match(repeatPattern3);

  if (match3) {
    const effectText = match3[1].trim();
    const timesStr = match3[2];
    const times = Number.parseInt(timesStr, 10);

    if (Number.isNaN(times)) {
      logger.warn("Failed to parse repeat count", { timesStr });
      return null;
    }

    logger.debug("Found repeat pattern (do X Y times)", { effectText, times });

    // Parse the effect part
    const effect = parseAtomicEffect(effectText);

    if (!effect) {
      logger.warn("Failed to parse repeat effect", { effectText });
      return null;
    }

    logger.info("Parsed repeat effect", { effect, times });

    return {
      type: "repeat",
      times,
      effect,
    };
  }

  logger.debug("Repeat effect pattern did not match");
  return null;
}

/**
 * Parse repeat effect from CST node (grammar-based parsing).
 * For now, returns null as repeat effects are better handled via text parsing.
 */
function parseFromCst(_ctx: CstNode): RepeatEffect | null {
  logger.debug("CST-based repeat parsing not yet implemented");
  return null;
}

/**
 * Repeat effect parser implementation
 */
export const repeatEffectParser: EffectParser = {
  pattern: /(.+),\s*\d+\s+times?/i,
  description:
    "Parses repeat effects that execute multiple times (e.g., 'draw 1 card, 3 times')",

  parse: (input: CstNode | string): RepeatEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
