/**
 * Riftbound Ability Parser
 *
 * Parser for converting card ability text to structured ability objects.
 */

import type {
  Ability,
  AbilityWithText,
  ActivatedAbility,
  AmountExpression,
  BuffEffect,
  ChannelEffect,
  Cost,
  CostKeywordAbility,
  DamageEffect,
  Domain,
  DrawEffect,
  Effect,
  ReadyEffect,
  SimpleKeyword,
  SimpleKeywordAbility,
  SpellAbility,
  Target,
  ValueKeyword,
  ValueKeywordAbility,
} from "@tcg/riftbound-types";
import { parseMovementEffect } from "./parsers/effect-parser";
import { parseCostKeywords } from "./parsers/keyword-parser";

/**
 * Options for controlling parser behavior and output
 */
export interface ParserOptions {
  /** Omit the 'id' field from AbilityWithText results */
  readonly omitId?: boolean;
  /** Omit the 'text' field from AbilityWithText results */
  readonly omitText?: boolean;
  /** Card ID prefix for generating ability IDs (e.g., "card-1") */
  readonly cardId?: string;
  /** Generate unique IDs for abilities */
  readonly generateAbilityUids?: boolean;
}

/**
 * Result of parsing a single ability text
 */
export interface ParseResult {
  readonly success: boolean;
  readonly ability?: Ability;
  readonly error?: string;
}

/**
 * Result of parsing ability text that may contain multiple abilities
 */
export interface ParseAbilitiesResult {
  readonly success: boolean;
  readonly abilities?: AbilityWithText[];
  readonly error?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Simple keywords that have no parameters
 */
const SIMPLE_KEYWORDS: readonly SimpleKeyword[] = [
  "Tank",
  "Ganking",
  "Action",
  "Reaction",
  "Hidden",
  "Temporary",
  "Quick-Draw",
  "Weaponmaster",
  "Unique",
] as const;

/**
 * Value keywords that have optional numeric values
 */
const VALUE_KEYWORDS: readonly ValueKeyword[] = [
  "Assault",
  "Shield",
  "Deflect",
] as const;

// ============================================================================
// Regex Patterns
// ============================================================================

/**
 * Pattern to match simple keywords: [KeywordName]
 */
const SIMPLE_KEYWORD_PATTERN = new RegExp(
  `\\[(${SIMPLE_KEYWORDS.join("|")})\\]`,
  "g",
);

/**
 * Pattern to match value keywords: [KeywordName] or [KeywordName N]
 */
const VALUE_KEYWORD_PATTERN = new RegExp(
  `\\[(${VALUE_KEYWORDS.join("|")})(?:\\s+(\\d+))?\\]`,
  "g",
);

/**
 * Pattern to match reminder text in parentheses
 */
const REMINDER_TEXT_PATTERN = /\([^)]*\)/g;

/**
 * Pattern to match draw effects: "Draw N."
 */
const DRAW_PATTERN = /^Draw (\d+)\.?$/i;

/**
 * Pattern to match channel effects: "Channel N rune(s) [exhausted]."
 */
const CHANNEL_PATTERN = /^Channel (\d+) runes?(?:\s+(exhausted))?\.?$/i;

/**
 * Pattern to match damage effects: "Deal N to TARGET."
 */
const DAMAGE_PATTERN = /^Deal (\d+) to (.+)\.?$/i;

/**
 * Pattern to match split damage effects: "Deal N damage split among TARGET."
 */
const SPLIT_DAMAGE_PATTERN = /^Deal (\d+) damage split among (.+)\.?$/i;

/**
 * Pattern to match damage equal to might: "Deal damage equal to my Might to TARGET."
 */
const DAMAGE_EQUAL_MIGHT_PATTERN =
  /^Deal damage equal to my Might to (.+)\.?$/i;

/**
 * Pattern to match buff effects: "Buff TARGET."
 */
const BUFF_PATTERN = /^Buff (me|a friendly unit|a unit)\.?/i;

/**
 * Pattern to match ready effects: "Ready TARGET."
 */
const READY_PATTERN =
  /^Ready (me|a unit|your units|your runes|a friendly unit)\.?/i;

/**
 * Pattern to match exhaust symbol: :rb_exhaust:
 */
const EXHAUST_PATTERN = /:rb_exhaust:/g;

/**
 * Pattern to match energy cost: :rb_energy_N:
 */
const ENERGY_PATTERN = /:rb_energy_(\d+):/g;

/**
 * Pattern to match power/rune cost: :rb_rune_domain:
 */
const POWER_PATTERN = /:rb_rune_(fury|calm|mind|body|chaos|order|rainbow):/g;

/**
 * Pattern to match activated ability: cost: effect
 * Captures: cost part (including trailing colon), effect part
 * The separator is ": " (colon followed by space)
 * Cost tokens end with : (like :rb_exhaust:), so we match up to and including the last :
 */
const ACTIVATED_ABILITY_PATTERN = /^(.+:): (.+)$/;

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Remove reminder text (text in parentheses) from ability text
 */
function removeReminderText(text: string): string {
  return text.replace(REMINDER_TEXT_PATTERN, "").trim();
}

/**
 * Parse simple keywords from text with positions
 */
function parseSimpleKeywordsWithPositions(
  text: string,
): Array<{ ability: SimpleKeywordAbility; startIndex: number }> {
  const results: Array<{ ability: SimpleKeywordAbility; startIndex: number }> =
    [];
  const cleanText = removeReminderText(text);

  let match: RegExpExecArray | null;
  const pattern = new RegExp(SIMPLE_KEYWORD_PATTERN.source, "g");

  while ((match = pattern.exec(cleanText)) !== null) {
    const keyword = match[1] as SimpleKeyword;
    // Find the actual position in the original text
    const keywordPattern = new RegExp(`\\[${keyword}\\]`);
    const originalMatch = text.match(keywordPattern);
    const startIndex = originalMatch
      ? text.indexOf(originalMatch[0])
      : match.index;

    results.push({
      ability: {
        type: "keyword",
        keyword,
      },
      startIndex,
    });
  }

  return results;
}

/**
 * Parse simple keywords from text
 */
function parseSimpleKeywords(text: string): SimpleKeywordAbility[] {
  return parseSimpleKeywordsWithPositions(text).map((r) => r.ability);
}

/**
 * Parse value keywords from text with positions
 */
function parseValueKeywordsWithPositions(
  text: string,
): Array<{ ability: ValueKeywordAbility; startIndex: number }> {
  const results: Array<{ ability: ValueKeywordAbility; startIndex: number }> =
    [];
  const cleanText = removeReminderText(text);

  let match: RegExpExecArray | null;
  const pattern = new RegExp(VALUE_KEYWORD_PATTERN.source, "g");

  while ((match = pattern.exec(cleanText)) !== null) {
    const keyword = match[1] as ValueKeyword;
    const value = match[2] ? Number.parseInt(match[2], 10) : 1;
    // Find the actual position in the original text
    const keywordPattern = new RegExp(`\\[${keyword}(?:\\s+${value})?\\]`);
    const originalMatch = text.match(keywordPattern);
    const startIndex = originalMatch
      ? text.indexOf(originalMatch[0])
      : match.index;

    results.push({
      ability: {
        type: "keyword",
        keyword,
        value,
      },
      startIndex,
    });
  }

  return results;
}

/**
 * Parse value keywords from text
 */
function parseValueKeywords(text: string): ValueKeywordAbility[] {
  return parseValueKeywordsWithPositions(text).map((r) => r.ability);
}

/**
 * Parse draw effect from text
 * @param text - The text to parse (should be cleaned of reminder text)
 * @returns DrawEffect if matched, undefined otherwise
 */
function parseDrawEffect(text: string): DrawEffect | undefined {
  const match = DRAW_PATTERN.exec(text);
  if (match) {
    const amount = Number.parseInt(match[1], 10);
    return {
      type: "draw",
      amount,
    };
  }
  return undefined;
}

/**
 * Parse channel effect from text
 * @param text - The text to parse (should be cleaned of reminder text)
 * @returns ChannelEffect if matched, undefined otherwise
 */
function parseChannelEffect(text: string): ChannelEffect | undefined {
  const match = CHANNEL_PATTERN.exec(text);
  if (match) {
    const amount = Number.parseInt(match[1], 10);
    const exhausted = match[2] === "exhausted";
    if (exhausted) {
      return {
        type: "channel",
        amount,
        exhausted: true,
      };
    }
    return {
      type: "channel",
      amount,
    };
  }
  return undefined;
}

/**
 * Parse a target expression from text
 * @param text - The target text (e.g., "a unit", "an enemy unit", "a unit at a battlefield")
 * @returns Target object
 */
function parseTarget(text: string): Target {
  const normalized = text.trim().toLowerCase();

  // Start with default target
  const target: {
    type: "unit" | "gear" | "spell" | "card" | "permanent";
    controller?: "friendly" | "enemy" | "any";
    location?: string | { battlefield: string };
    quantity?: "all" | "any" | number;
  } = { type: "unit" };

  // Parse quantity: "all units" or "any number of"
  if (normalized.includes("all units") || normalized.includes("all ")) {
    target.quantity = "all";
  } else if (normalized.includes("any number of")) {
    target.quantity = "any";
  }

  // Parse controller: "enemy" or "friendly"
  if (normalized.includes("enemy")) {
    target.controller = "enemy";
  } else if (normalized.includes("friendly")) {
    target.controller = "friendly";
  }

  // Parse location: "here"
  if (normalized.includes(" here")) {
    target.location = "here";
  }
  // Parse location: "at my battlefield" -> { battlefield: "controlled" }
  else if (normalized.includes("at my battlefield")) {
    target.location = { battlefield: "controlled" };
  }
  // Parse location: "at a battlefield" or "at battlefields"
  else if (
    normalized.includes("at a battlefield") ||
    normalized.includes("at battlefields")
  ) {
    target.location = "battlefield";
  }

  return target as Target;
}

/**
 * Parse damage effect from text
 * @param text - The text to parse (should be cleaned of reminder text)
 * @returns DamageEffect if matched, undefined otherwise
 */
function parseDamageEffect(text: string): DamageEffect | undefined {
  // Try damage equal to might pattern
  const mightMatch = DAMAGE_EQUAL_MIGHT_PATTERN.exec(text);
  if (mightMatch) {
    const targetText = mightMatch[1];
    const target = parseTarget(targetText);
    const amount: AmountExpression = { might: "self" };

    return {
      type: "damage",
      amount,
      target,
    };
  }

  // Try split damage pattern
  const splitMatch = SPLIT_DAMAGE_PATTERN.exec(text);
  if (splitMatch) {
    const amount = Number.parseInt(splitMatch[1], 10);
    const targetText = splitMatch[2];
    const target = parseTarget(targetText);

    return {
      type: "damage",
      amount,
      target,
      split: true,
    };
  }

  // Try regular damage pattern
  const match = DAMAGE_PATTERN.exec(text);
  if (match) {
    const amount = Number.parseInt(match[1], 10);
    const targetText = match[2];
    const target = parseTarget(targetText);

    return {
      type: "damage",
      amount,
      target,
    };
  }
  return undefined;
}

/**
 * Parse buff effect from text
 * @param text - The text to parse (should be cleaned of reminder text)
 * @returns BuffEffect if matched, undefined otherwise
 */
function parseBuffEffect(text: string): BuffEffect | undefined {
  const match = BUFF_PATTERN.exec(text);
  if (match) {
    const targetText = match[1].toLowerCase();
    let target: Target;

    if (targetText === "me") {
      target = { type: "self" } as unknown as Target;
    } else if (targetText === "a friendly unit") {
      target = { type: "unit", controller: "friendly" };
    } else {
      target = { type: "unit" };
    }

    return {
      type: "buff",
      target,
    };
  }
  return undefined;
}

/**
 * Parse ready effect from text
 * @param text - The text to parse (should be cleaned of reminder text)
 * @returns ReadyEffect if matched, undefined otherwise
 */
function parseReadyEffect(text: string): ReadyEffect | undefined {
  const match = READY_PATTERN.exec(text);
  if (match) {
    const targetText = match[1].toLowerCase();
    let target: Target;

    if (targetText === "me") {
      target = { type: "self" } as unknown as Target;
    } else if (targetText === "a friendly unit") {
      target = { type: "unit", controller: "friendly" };
    } else if (targetText === "your units") {
      target = { type: "unit", controller: "friendly", quantity: "all" };
    } else if (targetText === "your runes") {
      target = { type: "rune", controller: "friendly", quantity: "all" };
    } else {
      target = { type: "unit" };
    }

    return {
      type: "ready",
      target,
    };
  }
  return undefined;
}

/**
 * Parse cost from text
 * @param text - The cost text to parse
 * @returns Cost object
 */
function parseCost(text: string): Cost {
  const cost: {
    exhaust?: boolean;
    energy?: number;
    power?: Domain[];
  } = {};

  // Check for exhaust - use a new regex to avoid global state issues
  const exhaustPattern = new RegExp(EXHAUST_PATTERN.source);
  if (exhaustPattern.test(text)) {
    cost.exhaust = true;
  }

  // Parse energy
  const energyPattern = new RegExp(ENERGY_PATTERN.source, "g");
  let energyMatch: RegExpExecArray | null;
  while ((energyMatch = energyPattern.exec(text)) !== null) {
    const amount = Number.parseInt(energyMatch[1], 10);
    cost.energy = (cost.energy || 0) + amount;
  }

  // Parse power/runes
  const powerPattern = new RegExp(POWER_PATTERN.source, "g");
  let powerMatch: RegExpExecArray | null;
  while ((powerMatch = powerPattern.exec(text)) !== null) {
    const domain = powerMatch[1] as Domain;
    if (!cost.power) {
      cost.power = [];
    }
    cost.power.push(domain);
  }

  return cost;
}

/**
 * Parse effect from text
 * @param text - The effect text to parse
 * @returns Effect if matched, undefined otherwise
 */
function parseEffect(text: string): Effect | undefined {
  const cleanText = removeReminderText(text).trim();

  // Try draw effect
  const drawEffect = parseDrawEffect(cleanText);
  if (drawEffect) {
    return drawEffect;
  }

  // Try channel effect
  const channelEffect = parseChannelEffect(cleanText);
  if (channelEffect) {
    return channelEffect;
  }

  return undefined;
}

/**
 * Parse activated ability from text
 * @param text - The text to parse
 * @returns ActivatedAbility if matched, undefined otherwise
 */
function parseActivatedAbility(text: string): ActivatedAbility | undefined {
  const cleanText = removeReminderText(text).trim();
  const match = ACTIVATED_ABILITY_PATTERN.exec(cleanText);

  if (!match) {
    return undefined;
  }

  const costText = match[1];
  const effectText = match[2];

  const cost = parseCost(costText);
  const effect = parseEffect(effectText);

  if (!effect) {
    return undefined;
  }

  return {
    type: "activated",
    cost,
    effect,
  };
}

/**
 * Parse effect from text and wrap in SpellAbility
 * @param text - The text to parse
 * @returns SpellAbility if an effect was parsed, undefined otherwise
 */
function parseEffectAsSpell(text: string): SpellAbility | undefined {
  const cleanText = removeReminderText(text);

  // Try draw effect
  const drawEffect = parseDrawEffect(cleanText);
  if (drawEffect) {
    return {
      type: "spell",
      timing: "action",
      effect: drawEffect,
    };
  }

  // Try channel effect
  const channelEffect = parseChannelEffect(cleanText);
  if (channelEffect) {
    return {
      type: "spell",
      timing: "action",
      effect: channelEffect,
    };
  }

  // Try damage effect
  const damageEffect = parseDamageEffect(cleanText);
  if (damageEffect) {
    return {
      type: "spell",
      timing: "action",
      effect: damageEffect,
    };
  }

  // Try buff effect
  const buffEffect = parseBuffEffect(cleanText);
  if (buffEffect) {
    return {
      type: "spell",
      timing: "action",
      effect: buffEffect,
    };
  }

  // Try ready effect
  const readyEffect = parseReadyEffect(cleanText);
  if (readyEffect) {
    return {
      type: "spell",
      timing: "action",
      effect: readyEffect,
    };
  }

  // Try movement effects (move, recall)
  const movementEffect = parseMovementEffect(cleanText);
  if (movementEffect) {
    return {
      type: "spell",
      timing: "action",
      effect: movementEffect,
    };
  }

  return undefined;
}

/**
 * Parse ability text into a structured ability object.
 *
 * @param text - The ability text to parse
 * @returns ParseResult with the parsed ability or error
 *
 * @example
 * ```typescript
 * const result = parseAbilityText("Rush");
 * if (result.success) {
 *   console.log(result.ability);
 * }
 * ```
 */
export function parseAbilityText(text: string): ParseResult {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: "Empty ability text",
    };
  }

  // Try parsing as simple keyword first
  const simpleKeywords = parseSimpleKeywords(text);
  if (simpleKeywords.length > 0) {
    return {
      success: true,
      ability: simpleKeywords[0],
    };
  }

  // Try parsing as value keyword
  const valueKeywords = parseValueKeywords(text);
  if (valueKeywords.length > 0) {
    return {
      success: true,
      ability: valueKeywords[0],
    };
  }

  return {
    success: false,
    error: "Unable to parse ability text",
  };
}

/**
 * Generate an ability ID from card ID and index
 * @param cardId - Card ID prefix (e.g., "card-1")
 * @param index - 1-based ability index
 * @returns Ability ID (e.g., "card-1-1")
 */
function generateAbilityId(cardId: string, index: number): string {
  return `${cardId}-${index}`;
}

/**
 * Build an AbilityWithText object based on parser options
 * @param ability - The parsed ability
 * @param text - The original ability text
 * @param options - Parser options
 * @param index - 1-based ability index (for multi-ability parsing)
 * @returns AbilityWithText with fields conditionally included based on options
 */
export function buildAbilityWithText(
  ability: Ability,
  text: string,
  options?: ParserOptions,
  index = 1,
): AbilityWithText {
  const result: { ability: Ability; text?: string; id?: string } = { ability };

  // Include text unless omitText is true
  if (!options?.omitText) {
    result.text = text;
  }

  // Include id if generateAbilityUids is true and cardId is provided, unless omitId is true
  if (options?.generateAbilityUids && options?.cardId && !options?.omitId) {
    result.id = generateAbilityId(options.cardId, index);
  }

  return result as AbilityWithText;
}

/**
 * Parse ability text that may contain multiple abilities.
 *
 * Card text often contains multiple abilities separated by line breaks or
 * specific patterns. This function parses all abilities from the text.
 *
 * @param text - The ability text to parse (may contain multiple abilities)
 * @param options - Optional parser options to control output fields
 * @returns ParseAbilitiesResult with all parsed abilities or error
 *
 * @example
 * ```typescript
 * const result = parseAbilities("[Assault 2] (+2 :rb_might: while I'm an attacker.)");
 * if (result.success) {
 *   console.log(result.abilities); // [{ ability: { type: "keyword", keyword: "Assault", value: 2 }, text: "..." }]
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Omit text and id fields for cleaner test assertions
 * const result = parseAbilities("Draw 1.", { omitText: true, omitId: true });
 * if (result.success) {
 *   console.log(result.abilities); // [{ ability: { type: "spell", ... } }]
 * }
 * ```
 */
export function parseAbilities(
  text: string,
  options?: ParserOptions,
): ParseAbilitiesResult {
  if (!text || text.trim().length === 0) {
    return {
      success: false,
      error: "Empty ability text",
    };
  }

  // Try parsing as activated ability first (cost:: effect pattern)
  const activatedAbility = parseActivatedAbility(text);
  if (activatedAbility) {
    return {
      success: true,
      abilities: [activatedAbility],
    };
  }

  // Collect all abilities with their positions
  const abilitiesWithPositions: Array<{
    ability: Ability;
    startIndex: number;
  }> = [];

  // Parse cost keywords (Accelerate, Equip, Repeat)
  const costKeywordResults = parseCostKeywords(text);
  abilitiesWithPositions.push(...costKeywordResults);

  // Parse simple keywords
  const simpleKeywordResults = parseSimpleKeywordsWithPositions(text);
  abilitiesWithPositions.push(...simpleKeywordResults);

  // Parse value keywords
  const valueKeywordResults = parseValueKeywordsWithPositions(text);
  abilitiesWithPositions.push(...valueKeywordResults);

  // Sort by position in text
  abilitiesWithPositions.sort((a, b) => a.startIndex - b.startIndex);

  // Extract just the abilities
  const abilities = abilitiesWithPositions.map((r) => r.ability);

  // If no keywords found, try parsing as an effect
  if (abilities.length === 0) {
    const spellAbility = parseEffectAsSpell(text);
    if (spellAbility) {
      abilities.push(spellAbility);
    }
  }

  if (abilities.length === 0) {
    return {
      success: false,
      error: "No abilities found in text",
    };
  }

  return {
    success: true,
    abilities,
  };
}

/**
 * Validate ability text without fully parsing
 *
 * @param text - The ability text to validate
 * @returns true if the text appears to be valid ability text
 */
export function validateAbilityText(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }
  return true;
}
