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
  EffectKeywordAbility,
  ReadyEffect,
  SimpleKeyword,
  SimpleKeywordAbility,
  SpellAbility,
  StaticAbility,
  Target,
  Trigger,
  TriggeredAbility,
  ValueKeyword,
  ValueKeywordAbility,
} from "@tcg/riftbound-types";
import { parseInlineCondition } from "./parsers/condition-parser";
import {
  hasEffectKeyword,
  parseEffectKeywordsWithPositions,
} from "./parsers/effect-keyword-parser";
import {
  parseCounterEffect,
  parseCreateTokenEffect,
  parseFightEffect,
  parseGainControlOfSpellEffect,
  parseKillEffect,
  parseLookEffect,
  parseModifyMightEffect,
  parseMovementEffect,
  parsePreventDamageEffect,
  parseReturnToHandEffect,
  parseStunEffect,
} from "./parsers/effect-parser";
import { parseCostKeywords } from "./parsers/keyword-parser";
import { isStaticAbility, parseStaticAbility } from "./parsers/static-parser";

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
  readonly abilities?: Ability[];
  readonly error?: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Simple keywords that have no parameters
 * Note: Action and Reaction are NOT included here - they are spell timing indicators
 */
const SIMPLE_KEYWORDS: readonly SimpleKeyword[] = [
  "Tank",
  "Ganking",
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
 * Pattern to match italic reminder text: _..._
 * Only matches when the underscore is at word boundary (not inside :rb_xxx:)
 */
const ITALIC_REMINDER_TEXT_PATTERN = /(?<![:\w])_[^_]+_(?![:\w])/g;

/**
 * Pattern to match empty italic markers: _ _
 * This can occur after removing parenthetical content from italic text
 */
const EMPTY_ITALIC_PATTERN = /_ _/g;

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

/**
 * Pattern to match spell timing: [Action] or [Reaction] at the start
 * Captures: timing word (Action or Reaction)
 */
const SPELL_TIMING_PATTERN = /^\[(Action|Reaction)\]/i;

/**
 * Pattern to match triggered abilities: "When you play me, EFFECT"
 * Captures: trigger phrase, effect phrase
 */
const TRIGGERED_ABILITY_PATTERN =
  /^(When (?:you play me|I (?:attack|defend|conquer|hold|die|move))),\s*(.+)$/i;

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Remove reminder text (text in parentheses) from ability text
 */
function removeReminderText(text: string): string {
  return text
    .replace(REMINDER_TEXT_PATTERN, "")
    .replace(ITALIC_REMINDER_TEXT_PATTERN, "")
    .replace(EMPTY_ITALIC_PATTERN, "")
    .trim();
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

  // Try buff effect
  const buffEffect = parseBuffEffect(cleanText);
  if (buffEffect) {
    return buffEffect;
  }

  // Try damage effect
  const damageEffect = parseDamageEffect(cleanText);
  if (damageEffect) {
    return damageEffect;
  }

  // Try ready effect
  const readyEffect = parseReadyEffect(cleanText);
  if (readyEffect) {
    return readyEffect;
  }

  // Try movement effect
  const moveEffect = parseMovementEffect(cleanText);
  if (moveEffect) {
    return moveEffect;
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
 * Parse trigger phrase to Trigger object
 * @param triggerPhrase - The trigger phrase (e.g., "When you play me")
 * @returns Trigger object
 */
function parseTrigger(triggerPhrase: string): Trigger {
  const lowerPhrase = triggerPhrase.toLowerCase();

  if (lowerPhrase.includes("when you play me")) {
    return { event: "play-self", timing: "when" };
  }
  if (lowerPhrase.includes("when i attack")) {
    return { event: "attack", on: "self", timing: "when" };
  }
  if (lowerPhrase.includes("when i defend")) {
    return { event: "defend", on: "self", timing: "when" };
  }
  if (lowerPhrase.includes("when i conquer")) {
    return { event: "conquer", on: "self", timing: "when" };
  }
  if (lowerPhrase.includes("when i hold")) {
    return { event: "hold", on: "self", timing: "when" };
  }
  if (lowerPhrase.includes("when i die")) {
    return { event: "die", on: "self", timing: "when" };
  }
  if (lowerPhrase.includes("when i move")) {
    return { event: "move", on: "self", timing: "when" };
  }

  // Default fallback
  return { event: "play-self", timing: "when" };
}

/**
 * Parse triggered ability from text
 * @param text - The ability text to parse
 * @returns TriggeredAbility if parsed successfully, undefined otherwise
 */
function parseTriggeredAbility(text: string): TriggeredAbility | undefined {
  const cleanText = removeReminderText(text).trim();
  const match = TRIGGERED_ABILITY_PATTERN.exec(cleanText);

  if (!match) {
    return undefined;
  }

  const triggerPhrase = match[1];
  const effectText = match[2];

  const trigger = parseTrigger(triggerPhrase);
  const effect = parseEffect(effectText);

  if (!effect) {
    return undefined;
  }

  return {
    type: "triggered",
    trigger,
    effect,
  };
}

/**
 * Parse effect from text and wrap in SpellAbility
 * @param text - The text to parse
 * @param timing - The spell timing (action or reaction)
 * @returns SpellAbility if an effect was parsed, undefined otherwise
 */
function parseEffectAsSpell(
  text: string,
  timing: "action" | "reaction" = "action",
): SpellAbility | undefined {
  const cleanText = removeReminderText(text);

  // Try draw effect
  const drawEffect = parseDrawEffect(cleanText);
  if (drawEffect) {
    return {
      type: "spell",
      timing,
      effect: drawEffect,
    };
  }

  // Try channel effect
  const channelEffect = parseChannelEffect(cleanText);
  if (channelEffect) {
    return {
      type: "spell",
      timing,
      effect: channelEffect,
    };
  }

  // Try damage effect
  const damageEffect = parseDamageEffect(cleanText);
  if (damageEffect) {
    return {
      type: "spell",
      timing,
      effect: damageEffect,
    };
  }

  // Try buff effect
  const buffEffect = parseBuffEffect(cleanText);
  if (buffEffect) {
    return {
      type: "spell",
      timing,
      effect: buffEffect,
    };
  }

  // Try ready effect
  const readyEffect = parseReadyEffect(cleanText);
  if (readyEffect) {
    return {
      type: "spell",
      timing,
      effect: readyEffect,
    };
  }

  // Try movement effects (move, recall)
  const movementEffect = parseMovementEffect(cleanText);
  if (movementEffect) {
    return {
      type: "spell",
      timing,
      effect: movementEffect,
    };
  }

  // Try modify-might effect
  const modifyMightEffect = parseModifyMightEffect(cleanText);
  if (modifyMightEffect) {
    return {
      type: "spell",
      timing,
      effect: modifyMightEffect,
    };
  }

  // Try kill effect
  const killEffect = parseKillEffect(cleanText);
  if (killEffect) {
    return {
      type: "spell",
      timing,
      effect: killEffect,
    };
  }

  // Try counter effect
  const counterEffect = parseCounterEffect(cleanText);
  if (counterEffect) {
    return {
      type: "spell",
      timing,
      effect: counterEffect,
    };
  }

  // Try stun effect
  const stunEffect = parseStunEffect(cleanText);
  if (stunEffect) {
    return {
      type: "spell",
      timing,
      effect: stunEffect,
    };
  }

  // Try return-to-hand effect
  const returnToHandEffect = parseReturnToHandEffect(cleanText);
  if (returnToHandEffect) {
    return {
      type: "spell",
      timing,
      effect: returnToHandEffect,
    };
  }

  // Try create-token effect
  const createTokenEffect = parseCreateTokenEffect(cleanText);
  if (createTokenEffect) {
    return {
      type: "spell",
      timing,
      effect: createTokenEffect,
    };
  }

  // Try look effect
  const lookEffect = parseLookEffect(cleanText);
  if (lookEffect) {
    return {
      type: "spell",
      timing,
      effect: lookEffect,
    };
  }

  // Try fight effect
  const fightEffect = parseFightEffect(cleanText);
  if (fightEffect) {
    return {
      type: "spell",
      timing,
      effect: fightEffect,
    };
  }

  // Try prevent-damage effect
  const preventDamageEffect = parsePreventDamageEffect(cleanText);
  if (preventDamageEffect) {
    return {
      type: "spell",
      timing,
      effect: preventDamageEffect,
    };
  }

  // Try gain-control-of-spell effect
  const gainControlOfSpellEffect = parseGainControlOfSpellEffect(cleanText);
  if (gainControlOfSpellEffect) {
    return {
      type: "spell",
      timing,
      effect: gainControlOfSpellEffect,
    };
  }

  return undefined;
}

/**
 * Parse a spell ability from text starting with [Action] or [Reaction]
 * @param text - The text to parse
 * @returns SpellAbility if parsed successfully, undefined otherwise
 */
function parseSpellAbility(text: string): SpellAbility | undefined {
  const cleanText = removeReminderText(text).trim();
  const match = SPELL_TIMING_PATTERN.exec(cleanText);

  if (!match) {
    return undefined;
  }

  const timing = match[1].toLowerCase() as "action" | "reaction";
  // Remove the [Action] or [Reaction] prefix and any following reminder text
  const effectText = cleanText.slice(match[0].length).trim();

  // Parse the effect from the remaining text
  return parseEffectAsSpell(effectText, timing);
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
 * Split text into multiple ability segments
 * Handles patterns like:
 * - "[Vision] Other friendly units have [Vision]."
 * - "[Accelerate][Deathknell] — Draw 1."
 * - "[Tank] When you play me, draw 1. When I hold, buff me."
 */
function splitMultiAbilityText(text: string): string[] {
  const cleanText = removeReminderText(text);
  const segments: string[] = [];

  // Check if text starts with an effect keyword
  const startsWithEffectKeyword = /^\[(Deathknell|Legion|Vision)\]/i.test(
    cleanText,
  );

  // If text starts with an effect keyword, don't split on "When you play me"
  // because that's part of the effect keyword's effect text
  if (startsWithEffectKeyword) {
    // Only split if there are OTHER abilities after the effect keyword
    const staticPatterns = [
      /(?:Other |Your |Friendly |Units |Each ).+?(?:have|has|give).+?(?:\.|$)/gi,
      /(?:While |If you've ).+?(?:have|has|can't).+?(?:\.|$)/gi,
      /You may play me to .+?(?:\.|$)/gi,
    ];

    // Collect static matches
    const staticMatches: Array<{ text: string; index: number }> = [];
    for (const pattern of staticPatterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(cleanText)) !== null) {
        staticMatches.push({ text: match[0], index: match.index });
      }
    }

    if (staticMatches.length > 0) {
      // Sort by index
      staticMatches.sort((a, b) => a.index - b.index);

      // Get the keyword portion (everything before first static)
      const firstStaticIndex = staticMatches[0].index;
      const keywordPortion = cleanText.slice(0, firstStaticIndex).trim();
      if (keywordPortion) {
        segments.push(keywordPortion);
      }

      // Add static abilities
      for (const m of staticMatches) {
        segments.push(m.text.trim());
      }

      return segments;
    }

    // No splitting needed for effect keyword text
    return [text];
  }

  // Pattern to find ability boundaries
  // Look for: static ability patterns, triggered ability patterns after keywords
  const staticPatterns = [
    /(?:Other |Your |Friendly |Units |Each ).+?(?:have|has|give).+?(?:\.|$)/gi,
    /(?:While |If you've ).+?(?:have|has|can't).+?(?:\.|$)/gi,
    /You may play me to .+?(?:\.|$)/gi,
  ];
  const triggeredPattern =
    /When (?:you play me|I (?:attack|defend|conquer|hold|die|move|become)|you recycle|a friendly unit).+?(?:\.|$)/gi;

  // Collect all static matches
  const staticMatches: Array<{ text: string; index: number }> = [];
  for (const pattern of staticPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(cleanText)) !== null) {
      staticMatches.push({ text: match[0], index: match.index });
    }
  }

  // Collect triggered matches
  const triggeredMatches: Array<{ text: string; index: number }> = [];
  let match: RegExpExecArray | null;
  while ((match = triggeredPattern.exec(cleanText)) !== null) {
    triggeredMatches.push({ text: match[0], index: match.index });
  }

  // Check if this is a multi-ability card
  const hasStatic = staticMatches.length > 0;
  const hasTriggered = triggeredMatches.length > 0;
  const textHasEffectKeywords = hasEffectKeyword(cleanText);

  // If we have multiple ability types, try to split
  if (
    (hasStatic && textHasEffectKeywords) ||
    (hasStatic && hasTriggered) ||
    (textHasEffectKeywords && hasTriggered)
  ) {
    // Sort all matches by index
    const allMatches = [...staticMatches, ...triggeredMatches].sort(
      (a, b) => a.index - b.index,
    );

    // Get the keyword portion (everything before first static/triggered)
    const firstAbilityEnd = allMatches[0]?.index ?? cleanText.length;

    if (firstAbilityEnd > 0 && firstAbilityEnd < cleanText.length) {
      const keywordPortion = cleanText.slice(0, firstAbilityEnd).trim();
      if (keywordPortion) {
        segments.push(keywordPortion);
      }
    }

    // Add all matched abilities
    for (const m of allMatches) {
      segments.push(m.text.trim());
    }

    if (segments.length > 0) {
      return segments;
    }
  }

  // No splitting needed, return original
  return [text];
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

  const cleanText = removeReminderText(text);

  // Check if text STARTS with an effect keyword (not just contains one)
  const startsWithEffectKeyword = /^\[(Deathknell|Legion|Vision)\]/i.test(
    cleanText,
  );

  // Try parsing as static ability first (keyword grants, restrictions)
  // But only if text doesn't start with an effect keyword
  if (!startsWithEffectKeyword && isStaticAbility(cleanText)) {
    const staticResult = parseStaticAbility(text);
    if (staticResult) {
      return {
        success: true,
        abilities: [staticResult.ability],
      };
    }
  }

  // Try parsing as spell ability ([Action] or [Reaction] prefix)
  const spellAbility = parseSpellAbility(text);
  if (spellAbility) {
    return {
      success: true,
      abilities: [spellAbility],
    };
  }

  // Try parsing as activated ability (cost:: effect pattern)
  const activatedAbility = parseActivatedAbility(text);
  if (activatedAbility) {
    return {
      success: true,
      abilities: [activatedAbility],
    };
  }

  // Try parsing as triggered ability (When X, effect pattern)
  // But only if text doesn't start with an effect keyword
  if (!startsWithEffectKeyword) {
    const triggeredAbility = parseTriggeredAbility(text);
    if (triggeredAbility) {
      return {
        success: true,
        abilities: [triggeredAbility],
      };
    }
  }

  // Split into multiple ability segments if needed
  const segments = splitMultiAbilityText(text);

  // Collect all abilities with their positions
  const abilitiesWithPositions: Array<{
    ability: Ability;
    startIndex: number;
  }> = [];

  // Process each segment
  for (const segment of segments) {
    const segmentClean = removeReminderText(segment);
    const segmentStartsWithEffectKeyword =
      /^\[(Deathknell|Legion|Vision)\]/i.test(segmentClean);

    // Try static ability for this segment
    if (!segmentStartsWithEffectKeyword && isStaticAbility(segmentClean)) {
      const staticResult = parseStaticAbility(segment);
      if (staticResult) {
        abilitiesWithPositions.push({
          ability: staticResult.ability,
          startIndex: text.indexOf(segment),
        });
        continue;
      }
    }

    // Try triggered ability for this segment (but not if it starts with effect keywords)
    if (!segmentStartsWithEffectKeyword) {
      const triggeredResult = parseTriggeredAbility(segment);
      if (triggeredResult) {
        abilitiesWithPositions.push({
          ability: triggeredResult,
          startIndex: text.indexOf(segment),
        });
        continue;
      }
    }

    // Parse effect keywords (Deathknell, Legion, Vision)
    const effectKeywordResults = parseEffectKeywordsWithPositions(segment);
    for (const result of effectKeywordResults) {
      abilitiesWithPositions.push({
        ability: result.ability,
        startIndex: text.indexOf(segment) + result.startIndex,
      });
    }

    // Skip other keyword parsing if we found effect keywords
    if (effectKeywordResults.length > 0) {
      continue;
    }

    // Parse cost keywords (Accelerate, Equip, Repeat)
    const costKeywordResults = parseCostKeywords(segment);
    abilitiesWithPositions.push(
      ...costKeywordResults.map((r) => ({
        ability: r.ability,
        startIndex: text.indexOf(segment) + r.startIndex,
      })),
    );

    // Parse simple keywords
    const simpleKeywordResults = parseSimpleKeywordsWithPositions(segment);
    abilitiesWithPositions.push(
      ...simpleKeywordResults.map((r) => ({
        ability: r.ability,
        startIndex: text.indexOf(segment) + r.startIndex,
      })),
    );

    // Parse value keywords
    const valueKeywordResults = parseValueKeywordsWithPositions(segment);
    abilitiesWithPositions.push(
      ...valueKeywordResults.map((r) => ({
        ability: r.ability,
        startIndex: text.indexOf(segment) + r.startIndex,
      })),
    );
  }

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
