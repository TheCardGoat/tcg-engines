/**
 * Effect Parser
 *
 * Parses effect phrases from ability text into Effect types.
 * Handles:
 * - Draw/discard effects
 * - Damage effects
 * - Lore effects
 * - Exert/ready effects
 * - Banish/return effects
 * - Stat modification effects
 * - Keyword grant effects
 * - Play card effects
 * - Reveal effects
 * - Search/look at cards effects
 * - Inkwell effects
 * - Location movement effects
 * - Composite effects (sequences, optional, choice, conditional, for-each, repeat)
 */

import type {
  CardType,
  CharacterTarget,
  Effect,
  ForEachCounter,
  PlayerTarget,
} from "@tcg/lorcana";
import {
  hasConditionalEffect,
  splitConditionalEffect,
} from "../patterns/conditions";
import {
  BANISH_ALL_PATTERN,
  BANISH_PATTERN,
  CANT_SING_PATTERN,
  CHOOSE_AND_DISCARD_PATTERN,
  DEAL_DAMAGE_PATTERN,
  DISCARD_HAND_PATTERN,
  DISCARD_PATTERN,
  DRAW_AMOUNT_PATTERN,
  EXERT_PATTERN,
  FOR_EACH_CARD_IN_DISCARD_PATTERN,
  FOR_EACH_CARD_IN_HAND_PATTERN,
  FOR_EACH_CARD_UNDER_SELF_PATTERN,
  FOR_EACH_CHARACTER_PATTERN,
  FOR_EACH_CHARACTER_THAT_SANG_PATTERN,
  FOR_EACH_DAMAGE_ON_SELF_PATTERN,
  FOR_EACH_DAMAGE_ON_TARGET_PATTERN,
  FOR_EACH_DAMAGE_REMOVED_PATTERN,
  FOR_EACH_DAMAGED_CHARACTER_PATTERN,
  FOR_EACH_ITEM_PATTERN,
  FOR_EACH_LOCATION_PATTERN,
  GAIN_LORE_PATTERN,
  GRANT_KEYWORD_PATTERN,
  hasChoiceEffect,
  hasForEachEffect,
  hasIfYouDoPattern,
  hasOptionalEffect,
  hasRepeatEffect,
  hasSequenceEffect,
  LOOK_AT_CARDS_FULL_PATTERN,
  LOOK_AT_TOP_PATTERN,
  LOSE_LORE_PATTERN,
  MOVE_TO_LOCATION_PATTERN,
  PAY_LESS_TO_PLAY_PATTERN,
  PLAY_COST_X_OR_LESS_FREE_PATTERN,
  PLAY_FROM_DISCARD_PATTERN,
  PUT_BACK_ON_TOP_PATTERN,
  PUT_DAMAGE_PATTERN,
  PUT_INTO_INKWELL_FACEDOWN_PATTERN,
  PUT_INTO_INKWELL_PATTERN,
  PUT_ONE_IN_HAND_AND_BOTTOM_PATTERN,
  PUT_ONE_ON_TOP_AND_BOTTOM_PATTERN,
  PUT_REST_ON_BOTTOM_PATTERN,
  PUT_TOP_OR_BOTTOM_PATTERN,
  PUT_UNDER_PATTERN,
  READY_PATTERN,
  REMOVE_DAMAGE_PATTERN,
  REPEAT_PATTERN,
  REPEAT_UP_TO_PATTERN,
  RETURN_COST_X_OR_LESS_PATTERN,
  RETURN_FROM_DISCARD_PATTERN,
  RETURN_TO_HAND_PATTERN,
  REVEAL_AND_PUT_IN_HAND_PATTERN,
  REVEAL_HAND_PATTERN,
  SEARCH_AND_SHUFFLE_PATTERN,
  SEARCH_DECK_PATTERN,
  SEARCH_DECK_PUT_PATTERN,
  SHUFFLE_INTO_DECK_PATTERN,
  STAT_MODIFIER_PATTERN,
  splitChoiceOptions,
  splitOnForEach,
  splitOnIfYouDo,
  splitSequenceSteps,
  THIS_CHARACTER_GETS_STAT_PATTERN,
  YOU_MAY_PUT_INTO_INKWELL_PATTERN,
} from "../patterns/effects";
import { parseCondition } from "./condition-parser";
import { parseCharacterTarget, parsePlayerTarget } from "./target-parser";

/**
 * Helper function to parse numeric values or {d} placeholders
 * Converts {d} to -1 as a placeholder value
 *
 * @param value - String that might be a number or "{d}"
 * @returns Parsed number or -1 for {d} placeholder
 */
function parseNumericValue(value: string): number {
  if (value === "{d}") {
    return -1; // Placeholder value for {d}
  }
  return Number.parseInt(value, 10);
}

/**
 * Parse effect from text
 *
 * @param text - Text containing effect phrase
 * @returns Effect object or undefined if not parsable
 */
export function parseEffect(text: string): Effect | undefined {
  if (!text) return undefined;

  // Handle conditional effects first ("if X, Y" or "if X, Y instead")
  // Must be checked before choice and sequence effects
  if (hasConditionalEffect(text)) {
    const conditionalEffect = parseConditionalEffect(text);
    if (conditionalEffect) return conditionalEffect;
  }

  // Handle choice effects ("Choose one:" or "X or Y")
  if (hasChoiceEffect(text)) {
    return parseChoiceEffect(text);
  }

  // Handle "if you do" patterns (optional with follow-up)
  // Must be checked before general optional and sequence checks
  if (hasIfYouDoPattern(text) && hasOptionalEffect(text)) {
    return parseOptionalWithFollowUp(text);
  }

  // Handle for-each effects (before sequence to avoid splitting on periods in "for each")
  if (hasForEachEffect(text)) {
    return parseForEachEffect(text);
  }

  // Handle repeat effects (before sequence to handle "X. Repeat this Y times")
  if (hasRepeatEffect(text)) {
    return parseRepeatEffect(text);
  }

  // Handle sequence effects ("X, then Y" or "X. Y" or "X and Y")
  // Check this after for-each and repeat to handle those patterns correctly
  if (hasSequenceEffect(text) && !hasOptionalEffect(text)) {
    return parseSequenceEffect(text);
  }

  // Handle optional effects ("you may")
  if (hasOptionalEffect(text)) {
    return parseOptionalEffect(text);
  }

  // Parse as single atomic effect
  return parseAtomicEffect(text);
}

/**
 * Parse a for-each effect
 * Example: "Gain 1 lore for each character you have in play"
 *
 * @param text - Text containing for-each effect
 * @returns ForEachEffect or undefined if not parsable
 */
function parseForEachEffect(text: string): Effect | undefined {
  const parts = splitOnForEach(text);
  if (!parts) return undefined;

  const [effectText, counterText] = parts;

  // Parse the inner effect
  const effect = parseAtomicEffect(effectText);
  if (!effect) return undefined;

  // Parse the counter type
  const counter = parseForEachCounter(counterText);
  if (!counter) return undefined;

  return {
    type: "for-each",
    counter,
    effect,
  };
}

/**
 * Parse a for-each counter from text
 *
 * @param text - Text describing the counter (e.g., "character you have", "card in your hand")
 * @returns ForEachCounter or undefined if not parsable
 */
function parseForEachCounter(text: string): ForEachCounter | undefined {
  // Check characters pattern
  if (FOR_EACH_CHARACTER_PATTERN.test(text)) {
    const match = text.match(FOR_EACH_CHARACTER_PATTERN);
    if (match) {
      const ownership = match[1]?.toLowerCase();
      // Determine controller based on ownership or presence of "you have" / "they have"
      const controller =
        ownership === "your"
          ? ("you" as const)
          : ownership === "opponent's"
            ? ("opponent" as const)
            : text.includes("you have")
              ? ("you" as const)
              : text.includes("they have")
                ? ("opponent" as const)
                : ("any" as const);
      return { type: "characters", controller };
    }
  }

  // Check damaged characters pattern
  if (FOR_EACH_DAMAGED_CHARACTER_PATTERN.test(text)) {
    return { type: "damaged-characters", controller: "any" };
  }

  // Check items pattern
  if (FOR_EACH_ITEM_PATTERN.test(text)) {
    const match = text.match(FOR_EACH_ITEM_PATTERN);
    if (match) {
      const ownership = match[1]?.toLowerCase();
      const controller =
        ownership === "your"
          ? ("you" as const)
          : ownership === "opponent's"
            ? ("opponent" as const)
            : text.includes("you have")
              ? ("you" as const)
              : text.includes("they have")
                ? ("opponent" as const)
                : ("you" as const); // Default to "you" for items
      return { type: "items", controller };
    }
  }

  // Check locations pattern
  if (FOR_EACH_LOCATION_PATTERN.test(text)) {
    const match = text.match(FOR_EACH_LOCATION_PATTERN);
    if (match) {
      const ownership = match[1]?.toLowerCase();
      const controller =
        ownership === "your"
          ? ("you" as const)
          : ownership === "opponent's"
            ? ("opponent" as const)
            : text.includes("you have")
              ? ("you" as const)
              : text.includes("they have")
                ? ("opponent" as const)
                : ("you" as const);
      return { type: "locations", controller };
    }
  }

  // Check cards in hand pattern
  if (FOR_EACH_CARD_IN_HAND_PATTERN.test(text)) {
    const match = text.match(FOR_EACH_CARD_IN_HAND_PATTERN);
    if (match) {
      const ownership = match[1]?.toLowerCase();
      const controller =
        ownership === "their" || ownership === "opponent's"
          ? ("opponent" as const)
          : ("you" as const);
      return { type: "cards-in-hand", controller };
    }
  }

  // Check cards in discard pattern
  if (FOR_EACH_CARD_IN_DISCARD_PATTERN.test(text)) {
    const match = text.match(FOR_EACH_CARD_IN_DISCARD_PATTERN);
    if (match) {
      const ownership = match[1]?.toLowerCase();
      const controller =
        ownership === "their" || ownership === "opponent's"
          ? ("opponent" as const)
          : ("you" as const);
      return { type: "cards-in-discard", controller };
    }
  }

  // Check damage on self pattern
  if (FOR_EACH_DAMAGE_ON_SELF_PATTERN.test(text)) {
    return { type: "damage-on-self" };
  }

  // Check damage on target pattern
  if (FOR_EACH_DAMAGE_ON_TARGET_PATTERN.test(text)) {
    return { type: "damage-on-target" };
  }

  // Check cards under self pattern
  if (FOR_EACH_CARD_UNDER_SELF_PATTERN.test(text)) {
    return { type: "cards-under-self" };
  }

  // Check characters that sang pattern
  if (FOR_EACH_CHARACTER_THAT_SANG_PATTERN.test(text)) {
    const thisTurn = text.includes("this turn");
    return { type: "characters-that-sang", thisTurn };
  }

  // Check damage removed pattern (Rapunzel)
  if (FOR_EACH_DAMAGE_REMOVED_PATTERN.test(text)) {
    const match = text.match(FOR_EACH_DAMAGE_REMOVED_PATTERN);
    const amount = match && match[1] ? Number.parseInt(match[1], 10) : 1;
    return { type: "damage-removed", amount } as any;
  }

  return undefined;
}

/**
 * Parse a repeat effect
 * Example: "Deal 1 damage to chosen character. Repeat this 3 times"
 *
 * @param text - Text containing repeat effect
 * @returns RepeatEffect or undefined if not parsable
 */
function parseRepeatEffect(text: string): Effect | undefined {
  // Check for "Repeat this X times" pattern
  let match = text.match(REPEAT_PATTERN);
  if (match) {
    const times = Number.parseInt(match[1], 10);
    // Extract the effect part (before "Repeat this")
    const effectText = text.replace(REPEAT_PATTERN, "").trim();
    // Remove trailing period if present
    const cleanEffectText = effectText.replace(/\.\s*$/, "");

    const effect = parseAtomicEffect(cleanEffectText);
    if (!effect) return undefined;

    return {
      type: "repeat",
      times,
      effect,
    };
  }

  // Check for "You may repeat this up to X times" pattern
  match = text.match(REPEAT_UP_TO_PATTERN);
  if (match) {
    const times = Number.parseInt(match[1], 10);
    // Extract the effect part (before "Repeat this")
    const effectText = text.replace(REPEAT_UP_TO_PATTERN, "").trim();
    const cleanEffectText = effectText.replace(/\.\s*$/, "");

    const effect = parseAtomicEffect(cleanEffectText);
    if (!effect) return undefined;

    // Wrap in optional since it's "you may repeat"
    return {
      type: "optional",
      effect: {
        type: "repeat",
        times,
        effect,
      },
      chooser: "CONTROLLER",
    };
  }

  return undefined;
}

/**
 * Parse a conditional effect ("if X, Y" or "if X, Y instead")
 *
 * @param text - Text containing conditional effect
 * @returns ConditionalEffect or undefined if not parsable
 */
function parseConditionalEffect(text: string): Effect | undefined {
  const parts = splitConditionalEffect(text);
  if (!parts) return undefined;

  const [conditionText, thenEffectText, elseEffectText] = parts;

  // Parse the condition
  const condition = parseCondition(conditionText);
  if (!condition) return undefined;

  // Parse the then effect
  const thenEffect = parseAtomicEffect(thenEffectText);
  if (!thenEffect) return undefined;

  // Parse the else effect if present
  const elseEffect = elseEffectText
    ? parseAtomicEffect(elseEffectText)
    : undefined;

  return {
    type: "conditional",
    condition,
    then: thenEffect,
    else: elseEffect,
  };
}

/**
 * Parse an optional effect with "if you do" follow-up
 * Example: "You may exert chosen character. If you do, draw a card"
 *
 * @param text - Text containing optional effect with follow-up
 * @returns OptionalEffect or undefined if not parsable
 */
function parseOptionalWithFollowUp(text: string): Effect | undefined {
  const parts = splitOnIfYouDo(text);
  if (!parts) return undefined;

  const [optionalPart, followUpPart] = parts;

  // The optional part should contain "you may"
  if (!hasOptionalEffect(optionalPart)) return undefined;

  // Parse the optional effect (will handle "you may" stripping)
  const optionalEffect = parseOptionalEffect(optionalPart);
  if (!optionalEffect || optionalEffect.type !== "optional") return undefined;

  // Parse the follow-up effect
  const followUpEffect = parseAtomicEffect(followUpPart);
  if (!followUpEffect) return undefined;

  // Wrap in sequence: optional effect, then follow-up
  // The follow-up is conditional on the optional being performed
  return {
    type: "sequence",
    steps: [optionalEffect, followUpEffect],
  };
}

/**
 * Parse an optional effect ("you may X")
 *
 * @param text - Text containing optional effect
 * @returns OptionalEffect or undefined if not parsable
 */
function parseOptionalEffect(text: string): Effect | undefined {
  // Remove "you may" prefix and parse the inner effect
  const innerText = text.replace(/\byou may\b/i, "").trim();
  const innerEffect = parseAtomicEffect(innerText);

  if (innerEffect) {
    return {
      type: "optional",
      effect: innerEffect,
      chooser: "CONTROLLER",
    };
  }

  return undefined;
}

/**
 * Parse a choice effect (multiple options, player chooses one)
 *
 * @param text - Text containing choice effect
 * @returns ChoiceEffect or undefined if not parsable
 */
function parseChoiceEffect(text: string): Effect | undefined {
  const optionTexts = splitChoiceOptions(text);

  // Parse each option as an atomic effect
  const parsedOptions: Effect[] = [];
  const optionLabels: string[] = [];

  for (const optionText of optionTexts) {
    const effect = parseAtomicEffect(optionText);
    if (effect) {
      parsedOptions.push(effect);
      optionLabels.push(optionText);
    } else {
      // If any option fails to parse, return undefined
      return undefined;
    }
  }

  // If we parsed at least 2 options, return a choice effect
  if (parsedOptions.length >= 2) {
    return {
      type: "choice",
      options: parsedOptions,
      optionLabels,
    };
  }

  // Not enough options parsed successfully
  return undefined;
}

/**
 * Parse a sequence effect (multiple effects in order)
 *
 * @param text - Text containing sequence of effects
 * @returns SequenceEffect or undefined if not parsable
 */
function parseSequenceEffect(text: string): Effect | undefined {
  const steps = splitSequenceSteps(text);

  // Parse each step as an atomic effect
  const parsedSteps: Effect[] = [];

  for (const stepText of steps) {
    const effect = parseAtomicEffect(stepText);
    if (effect) {
      parsedSteps.push(effect);
    } else {
      // If any step fails to parse, return undefined
      // This allows fallback to treating as unparsable
      return undefined;
    }
  }

  // If we parsed at least 2 steps, return a sequence
  if (parsedSteps.length >= 2) {
    return {
      type: "sequence",
      steps: parsedSteps,
    };
  }

  // If only 1 step, return it directly (not a sequence)
  if (parsedSteps.length === 1) {
    return parsedSteps[0];
  }

  // No steps parsed successfully
  return undefined;
}

/**
 * Parse a single atomic effect (not a composite)
 *
 * @param text - Text containing single effect phrase
 * @returns Effect object or undefined if not parsable
 */
function parseAtomicEffect(text: string): Effect | undefined {
  if (!text) return undefined;

  // Try search deck effect first (before general patterns)
  if (SEARCH_AND_SHUFFLE_PATTERN.test(text)) {
    const match = text.match(SEARCH_AND_SHUFFLE_PATTERN);
    if (match) {
      const cardType = match[1] as CardType | "song" | "floodborn" | undefined;
      return {
        type: "search-deck",
        cardType,
        putInto: "hand",
        shuffle: true,
      };
    }
  }

  if (SEARCH_DECK_PUT_PATTERN.test(text)) {
    const match = text.match(SEARCH_DECK_PUT_PATTERN);
    if (match) {
      const cardType = match[1] as CardType | "song" | "floodborn" | undefined;
      let putInto: "hand" | "top-of-deck" | "play" = "hand";

      if (text.includes("into play")) {
        putInto = "play";
      } else if (text.includes("on top")) {
        putInto = "top-of-deck";
      }

      return {
        type: "search-deck",
        cardType,
        putInto,
        shuffle: false,
      };
    }
  }

  if (SEARCH_DECK_PATTERN.test(text)) {
    const match = text.match(SEARCH_DECK_PATTERN);
    if (match) {
      const cardType = match[1] as CardType | "song" | "floodborn" | undefined;
      return {
        type: "search-deck",
        cardType,
        putInto: "hand",
        shuffle: false,
      };
    }
  }

  // Try look at cards effect
  if (LOOK_AT_CARDS_FULL_PATTERN.test(text)) {
    const match = text.match(LOOK_AT_CARDS_FULL_PATTERN);
    if (match) {
      const amount = Number.parseInt(match[1], 10);
      const target = parsePlayerTarget(text) || "CONTROLLER";
      const effect: any = {
        type: "look-at-cards",
        amount,
        from: "top-of-deck" as const,
        target,
      };

      // Check for follow-up action
      if (text.includes("into your hand")) {
        const count = match[2] ? Number.parseInt(match[2], 10) : 1;
        effect.then = { action: "put-in-hand", count };
      } else if (text.includes("on top") || text.includes("on the top")) {
        const count = match[2] ? Number.parseInt(match[2], 10) : 1;
        effect.then = { action: "put-on-top", count };
      } else if (text.includes("on bottom") || text.includes("on the bottom")) {
        const count = match[2] ? Number.parseInt(match[2], 10) : 1;
        effect.then = { action: "put-on-bottom", count };
      }

      return effect;
    }
  }

  if (LOOK_AT_TOP_PATTERN.test(text)) {
    const match = text.match(LOOK_AT_TOP_PATTERN);
    if (match) {
      const amount = Number.parseInt(match[1], 10);
      const target = parsePlayerTarget(text) || "CONTROLLER";
      return {
        type: "look-at-cards",
        amount,
        from: "top-of-deck",
        target,
      };
    }
  }

  // Look-and-put composite movement handlers
  if (PUT_ONE_ON_TOP_AND_BOTTOM_PATTERN.test(text)) {
    return {
      type: "move-cards",
      from: "look-at",
      to: "top-and-bottom",
      count: 2, // 1 on top, 1 on bottom
    } as any;
  }

  if (PUT_ONE_IN_HAND_AND_BOTTOM_PATTERN.test(text)) {
    return {
      type: "move-cards",
      from: "look-at",
      to: "hand-and-bottom",
      count: 2,
    } as any;
  }

  if (PUT_TOP_OR_BOTTOM_PATTERN.test(text)) {
    return {
      type: "move-cards",
      from: "look-at",
      to: "top-or-bottom",
      count: 1,
    } as any;
  }

  if (PUT_REST_ON_BOTTOM_PATTERN.test(text)) {
    return {
      type: "move-cards",
      from: "look-at",
      to: "bottom-deck",
      count: "rest",
    } as any;
  }

  if (PUT_BACK_ON_TOP_PATTERN.test(text)) {
    return {
      type: "move-cards",
      from: "look-at",
      to: "top-of-deck",
      count: "all",
    } as any;
  }

  // Reveal and put in hand (Be Our Guest)
  if (REVEAL_AND_PUT_IN_HAND_PATTERN.test(text)) {
    const match = text.match(REVEAL_AND_PUT_IN_HAND_PATTERN);
    if (match) {
      // match[1] is e.g. "a character card" or "character card"
      // We need to parse this filter if possible, or store as "filter"
      return {
        type: "reveal-and-put-in-hand",
        filter: match[1],
        from: "look-at",
      } as any;
    }
  }

  // Play for free (Just in Time)
  if (PLAY_COST_X_OR_LESS_FREE_PATTERN.test(text)) {
    const match = text.match(PLAY_COST_X_OR_LESS_FREE_PATTERN);
    if (match) {
      const cost = Number.parseInt(match[1], 10);
      return {
        type: "play-card",
        cost: "free",
        filter: { cost: { lte: cost } },
      } as any;
    }
  }

  // Return cost X or less (Befuddle)
  if (RETURN_COST_X_OR_LESS_PATTERN.test(text)) {
    const match = text.match(RETURN_COST_X_OR_LESS_PATTERN);
    if (match) {
      const cost = Number.parseInt(match[1], 10);
      return {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER_OR_ITEM",
        filter: { cost: { lte: cost } },
      } as any;
    }
  }
  if (YOU_MAY_PUT_INTO_INKWELL_PATTERN.test(text)) {
    return {
      type: "put-into-inkwell",
      source: "hand",
      target: "CONTROLLER",
    };
  }

  if (PUT_INTO_INKWELL_FACEDOWN_PATTERN.test(text)) {
    const source = text.includes("top card of your deck")
      ? "top-of-deck"
      : "hand";
    const exerted = text.includes("exerted");
    return {
      type: "put-into-inkwell",
      source,
      target: "CONTROLLER",
      exerted,
    };
  }

  if (PUT_INTO_INKWELL_PATTERN.test(text)) {
    let source:
      | "top-of-deck"
      | "hand"
      | "chosen-card-in-play"
      | "chosen-character" = "hand";

    if (text.includes("top card of your deck")) {
      source = "top-of-deck";
    } else if (text.includes("card from your hand")) {
      source = "hand";
    } else if (text.includes("character")) {
      source = "chosen-character";
    }

    return {
      type: "put-into-inkwell",
      source,
      target: "CONTROLLER",
    };
  }

  // Try shuffle into deck effect
  if (SHUFFLE_INTO_DECK_PATTERN.test(text)) {
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    return {
      type: "shuffle-into-deck",
      target,
      intoDeck: "owner",
    };
  }

  // Try put under effect (Boost mechanic)
  if (PUT_UNDER_PATTERN.test(text)) {
    const source = text.includes("top card of your deck")
      ? "top-of-deck"
      : "hand";
    const under =
      text.includes("this character") || text.includes("this location")
        ? "self"
        : parseCharacterTarget(text) || "CHOSEN_CHARACTER";

    return {
      type: "put-under",
      source,
      under: under as any,
    };
  }

  // Try move to location effect
  if (MOVE_TO_LOCATION_PATTERN.test(text)) {
    const character = parseCharacterTarget(text) || "CHOSEN_CHARACTER_OF_YOURS";
    const isFree = text.includes("for free");

    return {
      type: "move-to-location",
      character,
      cost: isFree ? "free" : "normal",
    };
  }

  // Try return from discard effect
  if (RETURN_FROM_DISCARD_PATTERN.test(text)) {
    const match = text.match(RETURN_FROM_DISCARD_PATTERN);
    if (match) {
      const cardType = match[1] as CardType | "song" | undefined;
      const target = parsePlayerTarget(text) || "CONTROLLER";

      return {
        type: "return-from-discard",
        cardType,
        target,
      };
    }
  }

  // Try draw effect - with {d} placeholder support
  const drawMatch = text.match(DRAW_AMOUNT_PATTERN);
  if (drawMatch) {
    // drawMatch[1] is either undefined (for "a", "an") or a number/placeholder string
    const amount = drawMatch[1] ? parseNumericValue(drawMatch[1]) : 1;
    const target = parsePlayerTarget(text) || "CONTROLLER";
    return {
      type: "draw",
      amount,
      target,
    };
  }

  // Try discard effect
  const discardMatch = text.match(DISCARD_PATTERN);
  const discardHandMatch = text.match(DISCARD_HAND_PATTERN);

  if (discardHandMatch) {
    const target = parsePlayerTarget(text) || "CONTROLLER";
    return {
      type: "discard",
      amount: "hand",
      target,
    } as any;
  }

  if (discardMatch) {
    const amount =
      !discardMatch[1] || discardMatch[1] === "a"
        ? 1
        : Number.parseInt(discardMatch[1], 10);
    const chosen = CHOOSE_AND_DISCARD_PATTERN.test(text);
    const target = parsePlayerTarget(text) || "CONTROLLER";
    return {
      type: "discard",
      amount,
      target,
      chosen,
    };
  }

  // Try damage effect - with {d} placeholder support
  const damageMatch = text.match(DEAL_DAMAGE_PATTERN);
  if (damageMatch) {
    const amount = parseNumericValue(damageMatch[1]);
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    return {
      type: "deal-damage",
      amount,
      target,
    };
  }

  // Try put damage effect - with {d} placeholder support
  const putDamageMatch = text.match(PUT_DAMAGE_PATTERN);
  if (putDamageMatch) {
    const amount = parseNumericValue(putDamageMatch[1]);
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    return {
      type: "put-damage",
      amount,
      target,
    };
  }

  // Try remove damage effect - with {d} placeholder support
  const removeDamageMatch = text.match(REMOVE_DAMAGE_PATTERN);
  if (removeDamageMatch) {
    const amount = parseNumericValue(removeDamageMatch[1]);
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    const upTo = text.includes("up to");
    return {
      type: "remove-damage",
      amount,
      target,
      upTo,
    };
  }

  // Try lore gain effect - with {d} placeholder support
  const gainLoreMatch = text.match(GAIN_LORE_PATTERN);
  if (gainLoreMatch) {
    const amount = parseNumericValue(gainLoreMatch[1]);
    return {
      type: "gain-lore",
      amount,
    };
  }

  // Try lore loss effect - with {d} placeholder support
  const loseLoreMatch = text.match(LOSE_LORE_PATTERN);
  if (loseLoreMatch) {
    const amount = parseNumericValue(loseLoreMatch[1]);
    const target = parsePlayerTarget(text) || "OPPONENT";
    return {
      type: "lose-lore",
      amount,
      target,
    };
  }

  // Try cost reduction effect
  const payLessMatch = text.match(PAY_LESS_TO_PLAY_PATTERN);
  if (payLessMatch) {
    const amount = parseNumericValue(payLessMatch[1]);
    const targetText = payLessMatch[2];

    // Determine target (simplistic for now)
    let target: any = "SELF";
    if (targetText.includes("next action")) target = "NEXT_ACTION";
    if (targetText.includes("next character")) target = "NEXT_CHARACTER";
    if (targetText.includes("next item")) target = "NEXT_ITEM";
    if (targetText.includes("Broom characters"))
      target = "YOUR_BROOM_CHARACTERS";

    return {
      type: "cost-reduction",
      amount,
      target,
    } as any;
  }

  // Try keyword granting effect
  const grantMatch = text.match(GRANT_KEYWORD_PATTERN);
  if (grantMatch) {
    const keywordRaw = grantMatch[1];
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";

    // Parse keyword value if present
    let keyword = keywordRaw;
    let value: number | undefined;

    // Handle parameterized keywords
    if (keywordRaw.includes("Challenger")) {
      keyword = "Challenger";
      const match = keywordRaw.match(/Challenger \+(\d+)/);
      if (match) value = Number.parseInt(match[1], 10);
    } else if (keywordRaw.includes("Resist")) {
      keyword = "Resist";
      const match = keywordRaw.match(/Resist \+(\d+)/);
      if (match) value = Number.parseInt(match[1], 10);
    }

    return {
      type: "gain-keyword",
      keyword,
      value,
      target,
      duration: "turn",
    } as any;
  }

  // Try stat modification effect
  const statMatch = text.match(STAT_MODIFIER_PATTERN);
  if (statMatch) {
    const modifier = parseNumericValue(statMatch[1]);
    const statSymbol = statMatch[2];
    const stat =
      statSymbol === "S"
        ? "strength"
        : statSymbol === "W"
          ? "willpower"
          : "lore";
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";

    return {
      type: "modify-stat",
      stat,
      modifier,
      target,
      duration: "turn",
    } as any;
  }

  // Try self stat modification
  const selfStatMatch = text.match(THIS_CHARACTER_GETS_STAT_PATTERN);
  if (selfStatMatch) {
    const modifier = parseNumericValue(selfStatMatch[1]);
    const statSymbol = selfStatMatch[2];
    const stat =
      statSymbol === "S"
        ? "strength"
        : statSymbol === "W"
          ? "willpower"
          : "lore";

    return {
      type: "modify-stat",
      stat,
      modifier,
      target: "SELF",
      duration: "continuous", // explicit
    } as any;
  }

  // Try singer restriction
  if (CANT_SING_PATTERN.test(text)) {
    return {
      type: "restriction",
      restriction: "cant-sing",
      target: "SELF",
    } as any;
  }

  // Try exert effect
  if (EXERT_PATTERN.test(text)) {
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    return {
      type: "exert",
      target,
    };
  }

  // Try ready effect
  if (READY_PATTERN.test(text)) {
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    return {
      type: "ready",
      target,
    };
  }

  // Try banish effect
  if (BANISH_ALL_PATTERN.test(text)) {
    // Handle "Banish all X"
    const target = parseCharacterTarget(text) || "ALL_CHARACTERS";
    return {
      type: "banish",
      target,
    };
  }

  if (BANISH_PATTERN.test(text)) {
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    return {
      type: "banish",
      target,
    };
  }

  // Try return to hand effect
  if (RETURN_TO_HAND_PATTERN.test(text)) {
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    return {
      type: "return-to-hand",
      target,
    };
  }

  // Try stat modification - with {d} placeholder support
  const statModMatch = text.match(STAT_MODIFIER_PATTERN);
  if (statModMatch) {
    const modifierStr = statModMatch[1];
    // Handle +{d}, -{d}, or {d} (which defaults to positive)
    let modifier: number;
    if (modifierStr === "{d}" || modifierStr === "+{d}") {
      modifier = -1; // Placeholder for positive {d}
    } else if (modifierStr === "-{d}") {
      modifier = 1; // Placeholder for negative {d} (stored as positive, negated later)
    } else {
      modifier = Number.parseInt(modifierStr, 10);
    }

    const stat = statModMatch[2] as "S" | "W" | "L";
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    const duration = text.includes("this turn") ? "this-turn" : "permanent";

    return {
      type: "modify-stat",
      stat: stat === "S" ? "strength" : stat === "W" ? "willpower" : "lore",
      modifier,
      target,
      duration,
    };
  }

  // Try keyword grant - use "gain-keyword" effect type
  const keywordMatch = text.match(GRANT_KEYWORD_PATTERN);
  if (keywordMatch) {
    const keywordText = keywordMatch[1];
    const target = parseCharacterTarget(text) || "CHOSEN_CHARACTER";
    const duration = text.includes("this turn") ? "this-turn" : "permanent";

    // Parse the keyword name and value
    let keyword:
      | "Rush"
      | "Ward"
      | "Evasive"
      | "Bodyguard"
      | "Support"
      | "Reckless"
      | "Alert"
      | "Challenger"
      | "Resist";
    let value: number | undefined;

    if (keywordText.startsWith("Challenger")) {
      keyword = "Challenger";
      const valueMatch = keywordText.match(/\+(\d+)/);
      value = valueMatch ? Number.parseInt(valueMatch[1], 10) : undefined;
    } else if (keywordText.startsWith("Resist")) {
      keyword = "Resist";
      const valueMatch = keywordText.match(/\+(\d+)/);
      value = valueMatch ? Number.parseInt(valueMatch[1], 10) : undefined;
    } else {
      keyword = keywordText as typeof keyword;
    }

    return {
      type: "gain-keyword",
      keyword,
      value,
      target,
      duration,
    };
  }

  // Try play from discard effect
  if (PLAY_FROM_DISCARD_PATTERN.test(text)) {
    const isFree = text.includes("for free");
    return {
      type: "play-card",
      from: "discard",
      cardType: "character", // Default, could be parsed more specifically
      cost: isFree ? "free" : undefined,
    };
  }

  // Try reveal hand effect
  if (REVEAL_HAND_PATTERN.test(text)) {
    const target = parsePlayerTarget(text) || "OPPONENT";
    return {
      type: "reveal-hand",
      target,
    };
  }

  // Could not parse effect
  return undefined;
}
