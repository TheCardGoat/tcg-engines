/**
 * Effect Keyword Parser
 *
 * Parses effect keywords: Deathknell, Legion, Vision
 * These keywords have attached effects that trigger under specific conditions.
 */

import type {
  AnyTarget,
  Condition,
  Effect,
  EffectKeyword,
  EffectKeywordAbility,
  Location,
} from "@tcg/riftbound-types";

// ============================================================================
// Types
// ============================================================================

export interface EffectKeywordParseResult {
  readonly ability: EffectKeywordAbility;
  readonly startIndex: number;
  readonly endIndex: number;
  /** Remaining text after the effect keyword (for multi-ability parsing) */
  readonly remainingText?: string;
}

// ============================================================================
// Patterns
// ============================================================================

/**
 * Effect keywords that have attached effects
 */
const EFFECT_KEYWORDS: readonly EffectKeyword[] = ["Deathknell", "Legion", "Vision"] as const;

/**
 * Pattern to match effect keywords with their effects
 * Captures: keyword, effect text (after em-dash or space)
 * Examples:
 * - [Deathknell] — Draw 1.
 * - [Legion] — When you play me, buff me.
 * - [Vision] (reminder text)
 */
const EFFECT_KEYWORD_PATTERN = new RegExp(
  `\\[(${EFFECT_KEYWORDS.join("|")})\\](?:\\s*—\\s*|\\s*)`,
  "gi",
);

/**
 * Pattern to match reminder text in parentheses
 */
const REMINDER_TEXT_PATTERN = /\([^)]*\)/g;

/**
 * Pattern to match draw effects: "Draw N."
 */
const DRAW_PATTERN = /^Draw (\d+)\.?/i;

/**
 * Pattern to match channel effects: "Channel N rune(s) [exhausted]."
 */
const CHANNEL_PATTERN = /^Channel (\d+) runes?(?:\s+(exhausted))?\.?/i;

/**
 * Pattern to match buff effects: "Buff TARGET."
 */
const BUFF_PATTERN = /^Buff (me|a friendly unit|a unit)\.?/i;

/**
 * Pattern to match ready effects: "Ready TARGET."
 */
const READY_PATTERN = /^Ready (me|a unit|your units|your runes|a friendly unit)\.?/i;

/**
 * Pattern to match damage effects: "Deal N to TARGET."
 */
const DAMAGE_PATTERN = /^Deal (\d+) to (.+?)\.?$/i;

/**
 * Pattern to match "When you play me" trigger in effect text
 */
const WHEN_PLAY_ME_PATTERN = /^When you play me,\s*/i;

/**
 * Pattern to match conditions in effect text
 */
const IF_MIGHTY_PATTERN = /^If I was \[Mighty\],\s*/i;
const IF_ALONE_PATTERN = /^If I (?:died|was|'m) alone,\s*/i;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Remove reminder text from ability text
 */
function removeReminderText(text: string): string {
  return text.replace(REMINDER_TEXT_PATTERN, "").trim();
}

/**
 * Parse a simple effect from text
 */
function parseSimpleEffect(text: string): Effect | undefined {
  const cleanText = removeReminderText(text).trim();

  // Try draw effect
  const drawMatch = DRAW_PATTERN.exec(cleanText);
  if (drawMatch) {
    return {
      amount: Number.parseInt(drawMatch[1], 10),
      type: "draw",
    };
  }

  // Try channel effect
  const channelMatch = CHANNEL_PATTERN.exec(cleanText);
  if (channelMatch) {
    const amount = Number.parseInt(channelMatch[1], 10);
    const exhausted = channelMatch[2] === "exhausted";
    return exhausted ? { amount, exhausted: true, type: "channel" } : { amount, type: "channel" };
  }

  // Try buff effect
  const buffMatch = BUFF_PATTERN.exec(cleanText);
  if (buffMatch) {
    const targetText = buffMatch[1].toLowerCase();
    const target =
      targetText === "me"
        ? { type: "self" as const }
        : (targetText === "a friendly unit"
          ? { controller: "friendly" as const, type: "unit" as const }
          : { type: "unit" as const });
    return { target, type: "buff" };
  }

  // Try ready effect
  const readyMatch = READY_PATTERN.exec(cleanText);
  if (readyMatch) {
    const targetText = readyMatch[1].toLowerCase();
    let target;
    if (targetText === "me") {
      target = { type: "self" as const };
    } else if (targetText === "your runes") {
      target = {
        controller: "friendly" as const,
        quantity: "all" as const,
        type: "rune" as const,
      };
    } else if (targetText === "your units") {
      target = {
        controller: "friendly" as const,
        quantity: "all" as const,
        type: "unit" as const,
      };
    } else if (targetText === "a friendly unit") {
      target = { controller: "friendly" as const, type: "unit" as const };
    } else {
      target = { type: "unit" as const };
    }
    return { target, type: "ready" };
  }

  // Try damage effect
  const damageMatch = DAMAGE_PATTERN.exec(cleanText);
  if (damageMatch) {
    const amount = Number.parseInt(damageMatch[1], 10);
    const targetText = damageMatch[2].toLowerCase();
    const target: {
      type: "unit";
      controller?: "friendly" | "enemy";
      location?: Location;
      quantity?: "all" | "any" | number;
    } = { type: "unit" };

    if (targetText.includes("enemy")) {
      target.controller = "enemy";
    } else if (targetText.includes("friendly")) {
      target.controller = "friendly";
    }

    if (targetText.includes("all units") || targetText.includes("all ")) {
      target.quantity = "all";
    }

    if (targetText.includes(" here")) {
      target.location = "here";
    } else if (targetText.includes("at my battlefield")) {
      target.location = { battlefield: "controlled" };
    }

    return { amount, target, type: "damage" };
  }

  return undefined;
}

/**
 * Parse condition from effect text
 */
function parseCondition(text: string): {
  condition?: Condition;
  remainingText: string;
} {
  // Check for "If I was [Mighty]" condition
  const mightyMatch = IF_MIGHTY_PATTERN.exec(text);
  if (mightyMatch) {
    return {
      condition: { type: "while-mighty" },
      remainingText: text.slice(mightyMatch[0].length),
    };
  }

  // Check for "If I died alone" condition
  const aloneMatch = IF_ALONE_PATTERN.exec(text);
  if (aloneMatch) {
    return {
      condition: { type: "while-alone" },
      remainingText: text.slice(aloneMatch[0].length),
    };
  }

  return { remainingText: text };
}

/**
 * Parse effect text that may contain "When you play me" trigger
 * For Legion keyword, this creates a triggered effect
 */
function parseEffectWithTrigger(text: string): Effect | undefined {
  const cleanText = removeReminderText(text).trim();

  // Check for "When you play me" pattern
  const whenPlayMatch = WHEN_PLAY_ME_PATTERN.exec(cleanText);
  if (whenPlayMatch) {
    const effectText = cleanText.slice(whenPlayMatch[0].length);
    const effect = parseSimpleEffect(effectText);
    if (effect) {
      // Return the effect directly - the trigger is implicit in Legion
      return effect;
    }
  }

  // Try parsing as simple effect
  return parseSimpleEffect(cleanText);
}

// ============================================================================
// Main Parser Functions
// ============================================================================

/**
 * Check if text contains an effect keyword
 */
export function hasEffectKeyword(text: string): boolean {
  const pattern = new RegExp(`\\[(${EFFECT_KEYWORDS.join("|")})\\]`, "i");
  return pattern.test(text);
}

/**
 * Parse effect keywords from text with positions
 */
export function parseEffectKeywordsWithPositions(text: string): EffectKeywordParseResult[] {
  const results: EffectKeywordParseResult[] = [];
  const cleanText = removeReminderText(text);

  // Reset pattern lastIndex
  const pattern = new RegExp(EFFECT_KEYWORD_PATTERN.source, "gi");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(cleanText)) !== null) {
    const keyword = match[1] as EffectKeyword;
    const startIndex = match.index;
    const keywordEndIndex = match.index + match[0].length;

    // Find the effect text after the keyword
    // Look for the next keyword or end of text
    const nextKeywordMatch = cleanText
      .slice(keywordEndIndex)
      .match(
        /\[(?:Deathknell|Legion|Vision|Tank|Ganking|Action|Reaction|Hidden|Temporary|Quick-Draw|Weaponmaster|Unique|Assault|Shield|Deflect|Accelerate|Equip|Repeat)(?:\s+\d+)?\]/i,
      );

    const effectEndIndex = nextKeywordMatch
      ? keywordEndIndex + (nextKeywordMatch.index ?? 0)
      : cleanText.length;

    let effectText = cleanText.slice(keywordEndIndex, effectEndIndex).trim();

    // Remove trailing period if present
    if (effectText.endsWith(".")) {
      effectText = effectText.slice(0, -1).trim();
    }

    // Parse condition from effect text
    const { condition, remainingText } = parseCondition(effectText);
    effectText = remainingText;

    // Parse the effect
    let effect: Effect | undefined;

    if (keyword === "Vision") {
      // Vision has an implicit "look" effect
      effect = {
        amount: 1,
        from: "deck",
        then: { recycle: 1 },
        type: "look",
      };
    } else {
      // Parse the effect text
      effect = parseEffectWithTrigger(effectText);
    }

    // Only add if we have an effect (or it's Vision which has implicit effect)
    if (effect) {
      const ability: EffectKeywordAbility = condition
        ? { condition, effect, keyword, type: "keyword" }
        : { effect, keyword, type: "keyword" };

      results.push({
        ability,
        endIndex: effectEndIndex,
        startIndex,
      });
    }
  }

  return results;
}

/**
 * Parse effect keywords from text
 */
export function parseEffectKeywords(text: string): EffectKeywordAbility[] {
  return parseEffectKeywordsWithPositions(text).map((r) => r.ability);
}

/**
 * Check if a keyword is an effect keyword
 */
export function isEffectKeyword(keyword: string): keyword is EffectKeyword {
  return EFFECT_KEYWORDS.includes(keyword as EffectKeyword);
}
