/**
 * Effect Parser
 *
 * Parses effect text into structured Effect objects.
 */

import type {
  CounterEffect,
  CreateTokenEffect,
  FightEffect,
  GainControlOfSpellEffect,
  KillEffect,
  LookEffect,
  ModifyMightEffect,
  MoveEffect,
  PreventDamageEffect,
  RecallEffect,
  ReturnToHandEffect,
  StunEffect,
  TokenDefinition,
} from "@tcg/riftbound-types/abilities/effect-types";
import type { AnyTarget, Location, Target } from "@tcg/riftbound-types/targeting";
import {
  COUNTER_PATTERN,
  CREATE_TOKEN_PATTERN,
  FIGHT_PATTERN,
  GAIN_CONTROL_OF_SPELL_PATTERN,
  KILL_PATTERN,
  LOOK_PATTERN,
  MODIFY_MIGHT_PATTERN,
  MOVE_BASIC_PATTERN,
  MOVE_FROM_TO_PATTERN,
  PREVENT_DAMAGE_PATTERN,
  RECALL_PATTERN,
  RETURN_TO_HAND_PATTERN,
  STUN_PATTERN,
  parseLocationString,
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
      exhausted: true,
      target,
      type: "recall",
    };
  }

  return {
    target,
    type: "recall",
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
    // FromToMatch[2] is "unit" or "units" - not used since we always target units
    const fromStr = fromToMatch[3];
    const toStr = fromToMatch[4];

    const from = parseLocationString(fromStr);
    const to = parseLocationString(toStr);

    const target: Target = {
      type: "unit",
    };

    return {
      from,
      target,
      to,
      type: "move",
    };
  }

  // Try basic pattern
  const basicMatch = MOVE_BASIC_PATTERN.exec(text);
  if (basicMatch) {
    const quantityStr = basicMatch[1]; // "a", "an", "up to 2"
    const controllerStr = basicMatch[2]?.trim(); // "friendly", "enemy", or undefined
    // BasicMatch[3] is "unit" or "units" - not used since we always target units
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
      target,
      to,
      type: "move",
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
export function parseMovementEffect(text: string): MoveEffect | RecallEffect | undefined {
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

// ============================================================================
// Stat Modification Effect Parsers
// ============================================================================

/**
 * Convert word numbers to numeric values
 */
function wordToNumber(word: string): number {
  const wordMap: Record<string, number> = {
    a: 1,
    an: 1,
    five: 5,
    four: 4,
    one: 1,
    six: 6,
    three: 3,
    two: 2,
  };
  const lower = word.toLowerCase();
  return wordMap[lower] ?? (Number.parseInt(lower, 10) || 1);
}

/**
 * Parse a modify-might effect from text
 *
 * @param text - The text to parse (e.g., "Give a unit +5 :rb_might: this turn.")
 * @returns ModifyMightEffect if matched, undefined otherwise
 *
 * @example
 * parseModifyMightEffect("Give a unit +5 :rb_might: this turn.")
 * // Returns: { type: "modify-might", amount: 5, target: { type: "unit" }, duration: "turn" }
 */
export function parseModifyMightEffect(text: string): ModifyMightEffect | undefined {
  const match = MODIFY_MIGHT_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const targetStr = match[1];
  const amountStr = match[2]; // "+5" or "-4"
  const durationStr = match[3]; // "this turn" or undefined
  const minimumStr = match[5]; // "1" from "to a minimum of 1 :rb_might:"

  const target = parseTarget(targetStr);
  const amount = Number.parseInt(amountStr, 10);
  const duration = durationStr ? "turn" : undefined;
  const minimum = minimumStr ? Number.parseInt(minimumStr, 10) : undefined;

  const effect: ModifyMightEffect = {
    amount,
    target,
    type: "modify-might",
  };

  if (duration) {
    (effect as { duration: "turn" }).duration = duration;
  }

  if (minimum !== undefined) {
    (effect as { minimum: number }).minimum = minimum;
  }

  return effect;
}

// ============================================================================
// Kill Effect Parser
// ============================================================================

/**
 * Parse a kill effect from text
 *
 * @param text - The text to parse (e.g., "Kill a unit at a battlefield.")
 * @returns KillEffect if matched, undefined otherwise
 */
export function parseKillEffect(text: string): KillEffect | undefined {
  const match = KILL_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const targetStr = match[1];
  const target = parseTarget(targetStr);

  return {
    target,
    type: "kill",
  };
}

// ============================================================================
// Counter Effect Parser
// ============================================================================

/**
 * Parse a counter effect from text
 *
 * @param text - The text to parse (e.g., "Counter a spell.")
 * @returns CounterEffect if matched, undefined otherwise
 */
export function parseCounterEffect(text: string): CounterEffect | undefined {
  const match = COUNTER_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  return {
    type: "counter",
  };
}

// ============================================================================
// Stun Effect Parser
// ============================================================================

/**
 * Parse a stun effect from text
 *
 * @param text - The text to parse (e.g., "Stun a unit.")
 * @returns StunEffect if matched, undefined otherwise
 */
export function parseStunEffect(text: string): StunEffect | undefined {
  const match = STUN_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const targetStr = match[1];
  const target = parseTarget(targetStr);

  return {
    target,
    type: "stun",
  };
}

// ============================================================================
// Return to Hand Effect Parser
// ============================================================================

/**
 * Parse a return-to-hand effect from text
 *
 * @param text - The text to parse (e.g., "Return a gear to its owner's hand.")
 * @returns ReturnToHandEffect if matched, undefined otherwise
 */
export function parseReturnToHandEffect(text: string): ReturnToHandEffect | undefined {
  const match = RETURN_TO_HAND_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const targetStr = match[1];
  const target = parseTarget(targetStr);

  return {
    target,
    type: "return-to-hand",
  };
}

// ============================================================================
// Create Token Effect Parser
// ============================================================================

/**
 * Parse a create-token effect from text
 *
 * @param text - The text to parse (e.g., "Play four 1 :rb_might: Recruit unit tokens.")
 * @returns CreateTokenEffect if matched, undefined otherwise
 */
export function parseCreateTokenEffect(text: string): CreateTokenEffect | undefined {
  const match = CREATE_TOKEN_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const quantityStr = match[1]; // "four", "two", "1"
  const mightStr = match[2]; // "1"
  const tokenName = match[3]; // "Recruit"
  const tokenType = match[4] as "unit" | "gear"; // "unit"

  const amount = wordToNumber(quantityStr);
  const might = Number.parseInt(mightStr, 10);

  const token: TokenDefinition = {
    might,
    name: tokenName,
    type: tokenType,
  };

  return {
    amount,
    token,
    type: "create-token",
  };
}

// ============================================================================
// Look Effect Parser
// ============================================================================

/**
 * Parse a look effect from text
 *
 * @param text - The text to parse (e.g., "Look at the top 3 cards of your Main Deck.")
 * @returns LookEffect if matched, undefined otherwise
 */
export function parseLookEffect(text: string): LookEffect | undefined {
  const match = LOOK_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const amountStr = match[1];
  const deckType = match[2];

  const amount = Number.parseInt(amountStr, 10);
  const from = deckType.toLowerCase() === "rune deck" ? "rune-deck" : ("deck" as const);

  return {
    amount,
    from,
    type: "look",
  };
}

// ============================================================================
// Fight Effect Parser
// ============================================================================

/**
 * Parse a fight effect from text
 *
 * @param text - The text to parse (e.g., "They deal damage equal to their Mights to each other.")
 * @returns FightEffect if matched, undefined otherwise
 */
export function parseFightEffect(text: string): FightEffect | undefined {
  const match = FIGHT_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  // Fight effects typically involve two targets that were chosen earlier
  // We use placeholder targets that will be resolved at runtime
  const attacker: AnyTarget = { controller: "friendly", type: "unit" };
  const defender: AnyTarget = { controller: "enemy", type: "unit" };

  return {
    attacker,
    defender,
    type: "fight",
  };
}

// ============================================================================
// Prevent Damage Effect Parser
// ============================================================================

/**
 * Parse a prevent-damage effect from text
 *
 * @param text - The text to parse (e.g., "Prevent all spell and ability damage this turn.")
 * @returns PreventDamageEffect if matched, undefined otherwise
 */
export function parsePreventDamageEffect(text: string): PreventDamageEffect | undefined {
  const match = PREVENT_DAMAGE_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const amountType = match[1]; // "all" or "the next"
  const amount = amountType.toLowerCase() === "all" ? "all" : undefined;
  const duration = text.toLowerCase().includes("this turn") ? "turn" : "next";

  const effect: PreventDamageEffect = {
    type: "prevent-damage",
  };

  if (amount === "all") {
    (effect as { amount: "all" }).amount = amount;
  }

  if (duration) {
    (effect as { duration: "turn" | "next" }).duration = duration;
  }

  return effect;
}

// ============================================================================
// Gain Control of Spell Effect Parser
// ============================================================================

/**
 * Parse a gain-control-of-spell effect from text
 *
 * @param text - The text to parse (e.g., "Gain control of a spell. You may make new choices for it.")
 * @returns GainControlOfSpellEffect if matched, undefined otherwise
 */
export function parseGainControlOfSpellEffect(text: string): GainControlOfSpellEffect | undefined {
  const match = GAIN_CONTROL_OF_SPELL_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }

  const newChoicesClause = match[1];
  const newChoices = Boolean(newChoicesClause);

  if (newChoices) {
    return {
      newChoices: true,
      type: "gain-control-of-spell",
    };
  }

  return {
    type: "gain-control-of-spell",
  };
}
