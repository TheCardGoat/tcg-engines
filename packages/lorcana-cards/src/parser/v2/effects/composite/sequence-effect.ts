/**
 * Sequence Effect Parser
 * Handles sequential effects like "Do X, then Y, then Z"
 * Parses effects that occur in order using "then", "and then", ". Then", ". " (period), or " and " separators
 */

import type { CstNode } from "chevrotain";
import { logger } from "../../logging";
import type { Effect, SequenceEffect } from "../../types";
import type { EffectParser } from "../atomic";
import { parseAtomicEffect } from "../atomic";
import { parseCompositeEffect } from "./index";

/**
 * Sequence separators used in Lorcana ability text.
 * These patterns separate sequential effects like "Do X, then Y".
 *
 * All separator literals are stored in lowercase and matched case-insensitively
 * during parsing (e.g., handles both ", then " and ", Then ").
 *
 * Priority order:
 * 1. ", then" / ". then" / ", and then" - explicit sequence markers
 * 2. ". " - period-separated sentences (as fallback, with validation)
 *
 * KNOWN LIMITATION: The period separator ". " is intentionally generic and may
 * incorrectly split text like "Draw 2 cards. Gain 1 lore" that could represent
 * separate ability sentences rather than sequential steps. To mitigate false positives:
 * - It's tried LAST, only after more specific patterns fail
 * - All resulting parts must parse successfully as effects
 * - It's skipped for "or" format choices (handled by choice parser)
 * - Future improvement: Add validation to ensure period-separated parts are
 *   genuinely sequential (e.g., check for temporal language, verify causality)
 *
 * Note: " and " is NOT a sequence separator - it's used within atomic effects
 * like "draw 2 cards and discard 1 card" which should be parsed as a single effect.
 */
const SEQUENCE_SEPARATORS = [
  ", then ",
  ", and then ",
  ". then ",
  ". then, ", // Same pattern with comma (case-insensitive matching handles capitalization)
  ". ",
] as const;

/**
 * Parse sequence effect from text string.
 * Splits the text on sequence separators and parses each step as an atomic effect.
 * Also handles special patterns like "Effect. Repeat this/that N times" which convert to repeat effects.
 */
function parseFromText(text: string): SequenceEffect | null {
  logger.debug("Attempting to parse sequence effect from text", { text });

  // Check for "repeat this/that N times" pattern first (without "You may" - that's handled by optional parser)
  // This should be converted to a repeat effect instead of a sequence
  // "up to X times" patterns are implicitly optional
  const repeatPattern =
    /^(.+)\.\s+repeat\s+(?:this|that|the above effect)(?:\s+up\s+to\s+(\d+)\s+times|(?:\s+(\d+)\s+times?))?$/i;
  const repeatMatch = text.match(repeatPattern);

  if (repeatMatch) {
    const effectText = repeatMatch[1].trim();
    // Match group 1 is for "up to X times", group 2 is for "X times"
    const timesStr = repeatMatch[2] || repeatMatch[3];
    const times = timesStr ? Number.parseInt(timesStr, 10) : undefined;
    const hasUpTo = repeatMatch[2] !== undefined; // Matched the "up to X times" group

    if (times !== undefined && !Number.isNaN(times)) {
      logger.debug("Found repeat pattern in sequence parser", {
        effectText,
        times,
      });

      // Parse the effect part
      const effect = parseAtomicEffect(effectText);

      if (effect) {
        // Create a repeat effect
        const repeatEffectResult = {
          type: "repeat",
          times,
          effect,
        };

        // "up to X times" patterns are implicitly optional
        const finalEffect = hasUpTo
          ? {
              type: "optional",
              effect: repeatEffectResult,
              chooser: "CONTROLLER",
            }
          : repeatEffectResult;

        logger.info("Parsed repeat effect from sequence pattern", {
          finalEffect,
        });

        // Return the result (repeat or optional) instead of a sequence
        return finalEffect as unknown as SequenceEffect;
      }
    }
  }

  let stepTexts: string[] = [];
  let separatorUsed: string | undefined;

  // First, try the standard separators
  for (const separator of SEQUENCE_SEPARATORS) {
    if (text.toLowerCase().includes(separator.toLowerCase())) {
      // Escape special regex characters in the separator
      // This is needed because "." in the separator would match any character
      const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Split while preserving case-insensitive matching
      const regex = new RegExp(escapedSeparator, "gi");
      stepTexts = text.split(regex).map((s) => s.trim());
      separatorUsed = separator;
      logger.debug("Found sequence separator", {
        separator,
        stepCount: stepTexts.length,
      });
      break;
    }
  }

  // If no standard separator found, check for " and " as a special case
  // Only split on "and" if both parts are valid independent effects
  if (stepTexts.length < 2 && /\s+and\s+/i.test(text)) {
    const parts = text.split(/\s+and\s+/i).map((s) => s.trim());
    if (parts.length === 2) {
      // Check if both parts can be parsed as independent effects
      const part1Effect = parseAtomicEffect(parts[0]);
      const part2Effect = parseAtomicEffect(parts[1]);

      // Only treat as sequence if both parts parse successfully
      // AND the text doesn't match patterns that should stay together
      const shouldStayTogether =
        /choose\s+and\s+(?:discard|draw|gain)/i.test(text) ||
        /draw\s+.+\s+and\s+discard/i.test(text) ||
        /gain\s+.+\s+and\s+lose/i.test(text);

      if (part1Effect && part2Effect && !shouldStayTogether) {
        stepTexts = parts;
        separatorUsed = " and ";
        logger.debug("Found 'and' separator - both parts are valid effects", {
          parts,
        });
      }
    }
  }

  // Check for special case: "Effect. (You may) repeat this/that up to X times"
  // This should be converted to an optional repeat effect, not a sequence
  if (stepTexts.length === 2) {
    const step1 = stepTexts[0];
    const step2 = stepTexts[1];

    // Check if step 2 is "(You may) repeat this/that (up to X times)"
    if (
      /^(?:you may\s+)?repeat\s+(?:this|that|the above effect)(?:\s+up\s+to\s+(\d+)\s+times|(?:\s+(\d+)\s+times?))?$/i.test(
        step2,
      )
    ) {
      const repeatMatch = step2.match(
        /^(?:you may\s+)?repeat\s+(?:this|that|the above effect)(?:\s+up\s+to\s+(\d+)\s+times|(?:\s+(\d+)\s+times?))?$/i,
      );
      if (repeatMatch) {
        const timesStr = repeatMatch[1] || repeatMatch[2];
        const times = timesStr ? Number.parseInt(timesStr, 10) : undefined;
        const hasYouMay = /^you may/i.test(step2);
        const hasUpTo = repeatMatch[1] !== undefined; // Matched the "up to X times" group

        // "up to X times" patterns are implicitly optional even without "You may"
        const isOptional = hasYouMay || hasUpTo;

        if (times !== undefined && !Number.isNaN(times)) {
          logger.debug("Found optional repeat pattern", {
            step1,
            step2,
            times,
            isOptional,
          });

          // Parse the first effect
          const firstEffect = parseAtomicEffect(step1);

          if (firstEffect) {
            // Create a repeat effect that links to the first effect
            const repeatEffect = {
              type: "repeat",
              times,
              effect: firstEffect,
            };

            // If "You may" is present OR "up to" is present, wrap in optional effect
            const finalEffect = isOptional
              ? {
                  type: "optional",
                  effect: repeatEffect,
                  chooser: "CONTROLLER",
                }
              : repeatEffect;

            logger.info("Parsed optional repeat effect", { finalEffect });
            return finalEffect as unknown as SequenceEffect;
          }
        }
      }
    }
  }

  // No sequence pattern found
  if (stepTexts.length < 2) {
    logger.debug("No sequence pattern found - requires at least 2 steps");
    return null;
  }

  // Parse each step - try composite parsers first (for for-each, optional, etc.), then atomic
  const steps: Effect[] = [];
  for (let i = 0; i < stepTexts.length; i++) {
    const stepText = stepTexts[i];
    logger.debug("Parsing sequence step", { stepIndex: i, stepText });

    // Special handling for "You may repeat this/that (up to X times)" pattern
    // This needs to link to the previous effect in the sequence
    if (
      i > 0 &&
      /^(?:you may\s+)?repeat\s+(?:this|that|the above effect)(?:\s+up\s+to\s+(\d+)\s+times|(?:\s+(\d+)\s+times?))?$/i.test(
        stepText,
      )
    ) {
      const repeatMatch = stepText.match(
        /^(?:you may\s+)?repeat\s+(?:this|that|the above effect)(?:\s+up\s+to\s+(\d+)\s+times|(?:\s+(\d+)\s+times?))?$/i,
      );
      if (repeatMatch) {
        const timesStr = repeatMatch[1] || repeatMatch[2];
        const times = timesStr ? Number.parseInt(timesStr, 10) : undefined;
        const isOptional = /^you may/i.test(stepText);

        if (times !== undefined && !Number.isNaN(times) && steps.length > 0) {
          // Create a repeat effect that links to the previous effect
          const repeatEffect = {
            type: "repeat",
            times,
            effect: steps[i - 1], // Link to previous effect
          };

          // If "You may" is present, wrap in optional effect
          const finalEffect = isOptional
            ? { type: "optional", effect: repeatEffect, chooser: "CONTROLLER" }
            : repeatEffect;

          // Replace the previous step with the repeat-enhanced version
          steps[i] = finalEffect as any; // Union type of repeat/optional effects
          logger.debug("Successfully parsed repeat-this step", {
            stepIndex: i,
            finalEffect,
          });
          continue;
        }
      }
    }

    // Try composite parsers first (for for-each, optional, etc.)
    let effect = parseCompositeEffect(stepText);

    // If composite parsing fails, try atomic parsing
    if (!effect) {
      effect = parseAtomicEffect(stepText);
    }

    if (effect) {
      steps.push(effect);
      logger.debug("Successfully parsed sequence step", {
        stepIndex: i,
        effect,
      });
    } else {
      // If any step fails to parse, the entire sequence is invalid
      logger.warn("Failed to parse sequence step - sequence invalid", {
        stepIndex: i,
        stepText,
      });
      return null;
    }
  }

  // All steps must parse successfully
  if (steps.length !== stepTexts.length) {
    logger.warn("Sequence parsing produced incomplete effects");
    return null;
  }

  logger.info("Parsed sequence effect", {
    totalSteps: stepTexts.length,
    parsedSteps: steps.length,
    separator: separatorUsed,
  });

  return {
    type: "sequence",
    steps,
  };
}

/**
 * Parse sequence effect from CST node (grammar-based parsing).
 * For now, returns null as sequence effects are better handled via text parsing.
 */
function parseFromCst(_ctx: CstNode): SequenceEffect | null {
  logger.debug("CST-based sequence parsing not yet implemented");
  return null;
}

/**
 * Sequence effect parser implementation
 */
export const sequenceEffectParser: EffectParser = {
  pattern: /(.+),\s*then\s+(.+)/i,
  description:
    "Parses sequence effects where multiple effects occur in order (e.g., 'draw 2 cards, then discard 1 card')",

  parse: (input: CstNode | string): SequenceEffect | null => {
    if (typeof input === "string") {
      return parseFromText(input);
    }
    return parseFromCst(input);
  },
};
