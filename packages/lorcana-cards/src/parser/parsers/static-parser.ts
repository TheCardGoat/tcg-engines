/**
 * Static Ability Parser
 *
 * Parses static abilities from text.
 * Static abilities are continuous effects that are always active.
 * Examples:
 * - "Your characters gain Ward"
 * - "Your characters get +1 {S}"
 * - "While this character has no damage, he gets +2 {S}"
 * - "HIDDEN AWAY This character can't be challenged"
 * - "Characters gain Resist +{d} while here"
 * - "This character can challenge ready characters"
 */

import type { StaticAbility, StaticEffect } from "@tcg/lorcana";
import {
  CAN_CHALLENGE_READY_PATTERN,
  CANT_BE_CHALLENGED_PATTERN,
  CANT_CHALLENGE_PATTERN,
  CANT_QUEST_PATTERN,
  CANT_SING_PATTERN,
  CHARACTERS_GAIN_WHILE_HERE_PATTERN,
  CHARACTERS_GET_STAT_WHILE_HERE_PATTERN,
  ENTERS_PLAY_EXERTED_PATTERN,
  PAY_LESS_TO_PLAY_PATTERN,
  THIS_CHARACTER_GETS_STAT_PATTERN,
  YOU_MAY_PUT_INTO_INKWELL_PATTERN,
  YOUR_CHARACTERS_GAIN_PATTERN,
  YOUR_CHARACTERS_GET_STAT_PATTERN,
  YOUR_ITEMS_GAIN_PATTERN,
  YOUR_ITEMS_GET_STAT_PATTERN,
} from "../patterns/effects";
import { extractNamedAbilityPrefix } from "../preprocessor";
import type { ParseResult } from "../types";
import { extractConditionText, parseCondition } from "./condition-parser";
import { parseEffect } from "./effect-parser";

/**
 * Parse a static ability from text
 *
 * @param text - Normalized ability text
 * @returns Parse result with static ability
 */
export function parseStaticAbility(text: string): ParseResult {
  // Extract named ability prefix if present
  const extracted = extractNamedAbilityPrefix(text);
  const name = extracted?.name;
  const remainingText = extracted?.remainingText || text;

  // Extract condition if present ("While X,")
  const conditionText = extractConditionText(remainingText);
  const condition = conditionText ? parseCondition(conditionText) : undefined;

  // Remove condition from text to get effect
  const effectText = conditionText
    ? remainingText.replace(
        new RegExp(`^While\\s+${conditionText},?\\s*`, "i"),
        "",
      )
    : remainingText;

  // Try to parse specific static ability patterns first
  const specificResult = parseSpecificStaticPattern(effectText);
  if (specificResult) {
    const ability: StaticAbility = {
      type: "static",
      effect: specificResult,
    };

    if (name) ability.name = name;
    if (condition) ability.condition = condition;

    return {
      success: true,
      ability: {
        ability,
        text,
        name,
      },
    };
  }

  // Parse effect - static abilities use a subset of effects
  const parsedEffect = parseEffect(effectText);
  if (!parsedEffect) {
    return {
      success: false,
      error: `Could not parse static effect: "${effectText}"`,
    };
  }

  // Validate that the effect is a valid static effect
  // Static effects are: gain-keyword, modify-stat, restriction, grant-ability
  if (!isValidStaticEffect(parsedEffect)) {
    return {
      success: false,
      error: `Effect type "${parsedEffect.type}" is not a valid static effect`,
      unparsedSegments: [effectText],
    };
  }

  // Build static ability
  const ability: StaticAbility = {
    type: "static",
    effect: parsedEffect as StaticEffect,
  };

  if (name) {
    ability.name = name;
  }

  if (condition) {
    ability.condition = condition;
  }

  return {
    success: true,
    ability: {
      ability,
      text,
      name,
    },
  };
}

/**
 * Parse specific static ability patterns that don't fit the general effect parser
 * Returns a StaticEffect if a pattern matches, or undefined if no match
 */
function parseSpecificStaticPattern(text: string): StaticEffect | undefined {
  // Pattern: "This character/item can't be challenged"
  if (CANT_BE_CHALLENGED_PATTERN.test(text)) {
    return {
      type: "restriction",
      restriction: "cant-be-challenged",
      target: "SELF",
    };
  }

  // Pattern: "This character/item cannot challenge"
  if (CANT_CHALLENGE_PATTERN.test(text)) {
    return {
      type: "restriction",
      restriction: "cant-challenge",
      target: "SELF",
    };
  }

  // Pattern: "This character/item can't quest"
  if (CANT_QUEST_PATTERN.test(text)) {
    return {
      type: "restriction",
      restriction: "cant-quest",
      target: "SELF",
    };
  }

  // Pattern: "This character/item enters play exerted"
  if (ENTERS_PLAY_EXERTED_PATTERN.test(text)) {
    return {
      type: "restriction",
      restriction: "enters-play-exerted",
      target: "SELF",
    };
  }

  // Pattern: "This character can challenge ready characters"
  if (CAN_CHALLENGE_READY_PATTERN.test(text)) {
    return {
      type: "grant-ability",
      ability: "can-challenge-ready",
      target: "SELF",
    };
  }

  // Pattern: "Your characters gain [Keyword]"
  const yourCharactersGainMatch = text.match(YOUR_CHARACTERS_GAIN_PATTERN);
  if (yourCharactersGainMatch) {
    const keywordText = yourCharactersGainMatch[1];
    const parsedKeyword = parseKeywordFromText(keywordText);

    if (parsedKeyword) {
      return {
        type: "gain-keyword",
        keyword: parsedKeyword.keyword,
        value: parsedKeyword.value,
        target: "YOUR_CHARACTERS",
      };
    }
  }

  // Pattern: "Your characters get +X {S/W/L}"
  const yourCharactersGetStatMatch = text.match(
    YOUR_CHARACTERS_GET_STAT_PATTERN,
  );
  if (yourCharactersGetStatMatch) {
    const modifier = parseNumericValue(yourCharactersGetStatMatch[1]);
    const statSymbol = yourCharactersGetStatMatch[2];
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
      target: "YOUR_CHARACTERS",
      duration: "while-condition",
    };
  }

  // Pattern: "Your items gain [Keyword]"
  const yourItemsGainMatch = text.match(YOUR_ITEMS_GAIN_PATTERN);
  if (yourItemsGainMatch) {
    const keywordText = yourItemsGainMatch[1];
    const parsedKeyword = parseKeywordFromText(keywordText);

    if (parsedKeyword) {
      return {
        type: "gain-keyword",
        keyword: parsedKeyword.keyword,
        value: parsedKeyword.value,
        target: "YOUR_ITEMS" as any,
      };
    }
  }

  // Pattern: "Your items get +X {S/W/L}"
  const yourItemsGetStatMatch = text.match(YOUR_ITEMS_GET_STAT_PATTERN);
  if (yourItemsGetStatMatch) {
    const modifier = parseNumericValue(yourItemsGetStatMatch[1]);
    const statSymbol = yourItemsGetStatMatch[2];
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
      target: "YOUR_ITEMS" as any,
      duration: "while-condition",
    };
  }

  // Pattern: "Characters gain [Keyword] while here"
  const charactersGainWhileHereMatch = text.match(
    CHARACTERS_GAIN_WHILE_HERE_PATTERN,
  );
  if (charactersGainWhileHereMatch) {
    const keywordText = charactersGainWhileHereMatch[1];
    const parsedKeyword = parseKeywordFromText(keywordText);

    if (parsedKeyword) {
      return {
        type: "gain-keyword",
        keyword: parsedKeyword.keyword,
        value: parsedKeyword.value,
        target: "CHARACTERS_HERE" as any,
        duration: "while-condition",
      };
    }
  }

  // Pattern: "Characters get +X {S/W/L} while here"
  const charactersGetStatWhileHereMatch = text.match(
    CHARACTERS_GET_STAT_WHILE_HERE_PATTERN,
  );
  if (charactersGetStatWhileHereMatch) {
    const modifier = parseNumericValue(charactersGetStatWhileHereMatch[1]);
    const statSymbol = charactersGetStatWhileHereMatch[2];
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
      target: "CHARACTERS_HERE" as any,
      duration: "while-condition",
    };
  }

  // Pattern: "This character gets +X {S/W/L}..."
  const thisCharacterGetsStatMatch = text.match(
    THIS_CHARACTER_GETS_STAT_PATTERN,
  );
  if (thisCharacterGetsStatMatch) {
    const modifier = parseNumericValue(thisCharacterGetsStatMatch[1]);
    const statSymbol = thisCharacterGetsStatMatch[2];
    const stat =
      statSymbol === "S"
        ? "strength"
        : statSymbol === "W"
          ? "willpower"
          : "lore";

    // Check for "for each" modifier
    const forEachMatch = text.match(/for each (.*)/i);

    // Construct the base effect
    const effect: any = {
      type: "modify-stat",
      stat,
      modifier,
      target: "SELF",
    };

    // If it has a for-each clause, we need to handle it.
    // Ideally this would be a separate effect type or a modifier property.
    // For now, we'll mark it as a scaled modifier if needed, or rely on the text.
    // In strict parser model, we might want a "scaled-modify-stat" type.
    if (forEachMatch) {
      effect.scaling = {
        base: 0,
        factor: modifier,
        source: forEachMatch[1], // simplifying for now, ideally parsed
      };
      effect.modifier = 0; // Base modifier is 0 if it's purely per-X
    }

    return effect;
  }

  // Pattern: "You pay X {I} less to play..."
  const payLessMatch = text.match(PAY_LESS_TO_PLAY_PATTERN);
  if (payLessMatch) {
    const amount = parseNumericValue(payLessMatch[1]);
    const targetText = payLessMatch[2];

    // Determine target
    let target: any = "SELF";
    if (targetText.includes("next action")) target = "NEXT_ACTION";
    if (targetText.includes("next character")) target = "NEXT_CHARACTER";
    if (targetText.includes("next item")) target = "NEXT_ITEM";
    if (targetText.includes("Broom characters"))
      target = "YOUR_BROOM_CHARACTERS"; // Specific case handling

    return {
      type: "cost-reduction",
      amount,
      target,
    };
  }

  // Pattern: "This character can't {E} to sing songs"
  if (CANT_SING_PATTERN.test(text)) {
    return {
      type: "restriction",
      restriction: "cant-sing",
      target: "SELF",
    };
  }

  // Pattern: "During your turn, you may put an additional card..."
  // TODO: "put-additional-ink" is a custom ability not yet in GrantAbilityEffect type
  // For now, skip this pattern until the type is extended
  // if (YOU_MAY_PUT_INTO_INKWELL_PATTERN.test(text)) {
  //   return {
  //     type: "grant-ability",
  //     ability: "put-additional-ink",
  //     target: "SELF",
  //   };
  // }

  return undefined;
}

/**
 * Parse a keyword from text (e.g., "Rush", "Challenger +3", "Resist +{d}")
 * Returns keyword name and optional value
 */
type KeywordName =
  | "Rush"
  | "Ward"
  | "Evasive"
  | "Bodyguard"
  | "Support"
  | "Reckless"
  | "Alert"
  | "Challenger"
  | "Resist";

function parseKeywordFromText(text: string):
  | {
      keyword: KeywordName;
      value?: number;
    }
  | undefined {
  // Check for parameterized keywords: "Challenger +X" or "Resist +X"
  const challengerMatch = text.match(/Challenger\s*\+(\d+|\{d\})/);
  if (challengerMatch) {
    return {
      keyword: "Challenger",
      value: parseNumericValue(challengerMatch[1]),
    };
  }

  const resistMatch = text.match(/Resist\s*\+(\d+|\{d\})/);
  if (resistMatch) {
    return {
      keyword: "Resist",
      value: parseNumericValue(resistMatch[1]),
    };
  }

  // Check for simple keywords
  const simpleKeywords: KeywordName[] = [
    "Rush",
    "Ward",
    "Evasive",
    "Bodyguard",
    "Support",
    "Reckless",
    "Alert",
  ];
  for (const keyword of simpleKeywords) {
    if (text === keyword) {
      return { keyword };
    }
  }

  return undefined;
}

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

  // Remove optional + prefix
  const cleaned = value.replace(/^\+/, "");
  const parsed = Number.parseInt(cleaned, 10);

  if (Number.isNaN(parsed)) {
    return -1; // Fallback for unparseable values
  }

  return parsed;
}

/**
 * Check if an effect is valid for static abilities
 *
 * Static abilities typically use:
 * - gain-keyword
 * - modify-stat
 * - restriction effects
 * - grant-ability
 */
function isValidStaticEffect(effect: any): boolean {
  const validTypes = [
    "gain-keyword",
    "modify-stat",
    "restriction",
    "grant-ability",
    "cost-reduction",
  ];

  return validTypes.includes(effect.type);
}
