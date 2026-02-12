/**
 * Static Ability Parser
 *
 * Parses static abilities from ability text.
 * Static abilities are always active and include keyword grants, restrictions, etc.
 */

import type { AnyTarget, Condition, Effect, StaticAbility, Target } from "@tcg/riftbound-types";
import { parseConditionFromText } from "./condition-parser";

// ============================================================================
// Types
// ============================================================================

export interface StaticAbilityParseResult {
  readonly ability: StaticAbility;
  readonly startIndex: number;
  readonly endIndex: number;
}

// ============================================================================
// Patterns
// ============================================================================

/**
 * Pattern to match reminder text in parentheses
 */
const REMINDER_TEXT_PATTERN = /\([^)]*\)/g;

/**
 * Pattern for "TARGET have [KEYWORD]" - grants keyword to others
 * Examples:
 * - "Other friendly units here have [Assault]"
 * - "Your Mechs have [Shield]"
 * - "Friendly units have [Deflect]"
 */
const GRANT_KEYWORD_PATTERN =
  /^(.+?)\s+have\s+\[(\w+(?:-\w+)?)\](?:\s+and\s+\[(\w+(?:-\w+)?)\])?(?:\s*,\s*(?:and\s*)?\[(\w+(?:-\w+)?)\])?\.?/i;

/**
 * Pattern for "While CONDITION, I have [KEYWORDS]" - conditional self-grant
 * Examples:
 * - "While I'm [Mighty], I have [Deflect], [Ganking], and [Shield]"
 * - "While I'm buffed, I have [Ganking]"
 */
const CONDITIONAL_SELF_GRANT_PATTERN = /^(While .+?),\s*I have\s+(.+?)\.?$/i;

/**
 * Pattern for "If CONDITION, I have [KEYWORDS]" - conditional self-grant
 * Examples:
 * - "If you've discarded a card this turn, I have [Assault] and [Ganking]"
 */
const IF_SELF_GRANT_PATTERN = /^(If .+?),\s*I have\s+(.+?)\.?$/i;

/**
 * Pattern for "Units here have [KEYWORD]" - location-based grant
 */
const LOCATION_GRANT_PATTERN = /^Units here have\s+\[(\w+(?:-\w+)?)\]\.?/i;

/**
 * Pattern for "Your Equipment each give [KEYWORD]"
 */
const EQUIPMENT_GIVE_PATTERN = /^Your Equipment each give\s+\[(\w+(?:-\w+)?)\]\.?/i;

/**
 * Pattern for "Each TYPE in ZONE has [KEYWORD]"
 */
const EACH_TYPE_HAS_PATTERN = /^Each (\w+) in your (\w+) has\s+\[(\w+(?:-\w+)?)\]\.?/i;

/**
 * Pattern for restriction abilities
 * Examples:
 * - "While I'm at a battlefield, opponents can't score points"
 * - "You may play me to an open battlefield"
 */
const RESTRICTION_PATTERN = /^(While .+?),\s*(opponents can't .+|.+ can't .+)\.?$/i;

/**
 * Pattern for play location abilities
 * Examples:
 * - "You may play me to an open battlefield"
 * - "You may play me to an occupied enemy battlefield"
 */
const PLAY_LOCATION_PATTERN = /^You may play me to (an? .+? battlefield)\.?$/i;

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
 * Parse keywords from a keyword list string
 * Examples:
 * - "[Deflect], [Ganking], and [Shield]" -> ["Deflect", "Ganking", "Shield"]
 * - "[Assault] and [Ganking]" -> ["Assault", "Ganking"]
 */
function parseKeywordList(text: string): string[] {
  const keywords: string[] = [];
  const pattern = /\[(\w+(?:-\w+)?)\]/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    keywords.push(match[1]);
  }

  return keywords;
}

/**
 * Parse target from grant text
 * Examples:
 * - "Other friendly units here" -> { type: "unit", controller: "friendly", location: "here", excludeSelf: true }
 * - "Your Mechs" -> { type: "unit", controller: "friendly", tribe: "Mech" }
 * - "Friendly units" -> { type: "unit", controller: "friendly" }
 */
function parseGrantTarget(text: string): Target {
  const normalized = text.toLowerCase().trim();

  const target: {
    type: "unit" | "gear" | "card";
    controller?: "friendly" | "enemy" | "any";
    location?: string;
    excludeSelf?: boolean;
    tribe?: string;
    cardType?: string;
  } = { type: "unit" };

  // Check for "other" (excludes self)
  if (normalized.includes("other")) {
    target.excludeSelf = true;
  }

  // Check for controller
  if (normalized.includes("friendly") || normalized.includes("your") || normalized.includes("my")) {
    target.controller = "friendly";
  } else if (normalized.includes("enemy")) {
    target.controller = "enemy";
  }

  // Check for location
  if (normalized.includes(" here")) {
    target.location = "here";
  }

  // Check for specific types/tribes
  if (normalized.includes("mechs")) {
    target.tribe = "Mech";
  } else if (normalized.includes("equipment")) {
    target.type = "gear";
  }

  return target as Target;
}

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Check if text is a static ability
 */
export function isStaticAbility(text: string): boolean {
  const cleanText = removeReminderText(text);

  return (
    GRANT_KEYWORD_PATTERN.test(cleanText) ||
    CONDITIONAL_SELF_GRANT_PATTERN.test(cleanText) ||
    IF_SELF_GRANT_PATTERN.test(cleanText) ||
    LOCATION_GRANT_PATTERN.test(cleanText) ||
    EQUIPMENT_GIVE_PATTERN.test(cleanText) ||
    EACH_TYPE_HAS_PATTERN.test(cleanText) ||
    RESTRICTION_PATTERN.test(cleanText) ||
    PLAY_LOCATION_PATTERN.test(cleanText)
  );
}

/**
 * Parse a static ability from text
 */
export function parseStaticAbility(text: string): StaticAbilityParseResult | undefined {
  const cleanText = removeReminderText(text);

  // Try conditional self-grant: "While I'm [Mighty], I have [Deflect]..."
  const conditionalMatch = CONDITIONAL_SELF_GRANT_PATTERN.exec(cleanText);
  if (conditionalMatch) {
    const conditionText = conditionalMatch[1];
    const keywordsText = conditionalMatch[2];
    const keywords = parseKeywordList(keywordsText);

    // Parse the condition
    const conditionResult = parseConditionFromText(conditionText + ",");
    const condition = conditionResult?.condition;

    if (condition && keywords.length > 0) {
      const effect: Effect =
        keywords.length === 1
          ? {
              keyword: keywords[0],
              target: { type: "self" } as AnyTarget,
              type: "grant-keyword",
            }
          : {
              keywords,
              target: { type: "self" } as AnyTarget,
              type: "grant-keywords",
            };

      return {
        ability: {
          condition,
          effect,
          type: "static",
        },
        endIndex: text.length,
        startIndex: 0,
      };
    }
  }

  // Try "If CONDITION, I have [KEYWORDS]"
  const ifSelfGrantMatch = IF_SELF_GRANT_PATTERN.exec(cleanText);
  if (ifSelfGrantMatch) {
    const conditionText = ifSelfGrantMatch[1];
    const keywordsText = ifSelfGrantMatch[2];
    const keywords = parseKeywordList(keywordsText);

    // Parse the condition
    const conditionResult = parseConditionFromText(conditionText + ",");
    const condition = conditionResult?.condition;

    if (condition && keywords.length > 0) {
      const effect: Effect =
        keywords.length === 1
          ? {
              keyword: keywords[0],
              target: { type: "self" } as AnyTarget,
              type: "grant-keyword",
            }
          : {
              keywords,
              target: { type: "self" } as AnyTarget,
              type: "grant-keywords",
            };

      return {
        ability: {
          condition,
          effect,
          type: "static",
        },
        endIndex: text.length,
        startIndex: 0,
      };
    }
  }

  // Try grant keyword: "TARGET have [KEYWORD]"
  const grantMatch = GRANT_KEYWORD_PATTERN.exec(cleanText);
  if (grantMatch) {
    const targetText = grantMatch[1];
    const keywords: string[] = [];

    // Collect all keywords from the match groups
    if (grantMatch[2]) {
      keywords.push(grantMatch[2]);
    }
    if (grantMatch[3]) {
      keywords.push(grantMatch[3]);
    }
    if (grantMatch[4]) {
      keywords.push(grantMatch[4]);
    }

    const target = parseGrantTarget(targetText);

    const effect: Effect =
      keywords.length === 1
        ? { keyword: keywords[0], target, type: "grant-keyword" }
        : { keywords, target, type: "grant-keywords" };

    return {
      ability: {
        effect,
        type: "static",
      },
      endIndex: text.length,
      startIndex: 0,
    };
  }

  // Try location grant: "Units here have [KEYWORD]"
  const locationGrantMatch = LOCATION_GRANT_PATTERN.exec(cleanText);
  if (locationGrantMatch) {
    const keyword = locationGrantMatch[1];
    const target: Target = { location: "here", type: "unit" } as Target;

    return {
      ability: {
        effect: { keyword, target, type: "grant-keyword" },
        type: "static",
      },
      endIndex: text.length,
      startIndex: 0,
    };
  }

  // Try equipment give: "Your Equipment each give [KEYWORD]"
  const equipmentGiveMatch = EQUIPMENT_GIVE_PATTERN.exec(cleanText);
  if (equipmentGiveMatch) {
    const keyword = equipmentGiveMatch[1];

    return {
      ability: {
        effect: {
          keyword,
          target: { controller: "friendly", type: "gear" } as Target,
          type: "grant-keyword",
        },
        type: "static",
      },
      endIndex: text.length,
      startIndex: 0,
    };
  }

  // Try "Each TYPE in ZONE has [KEYWORD]"
  const eachTypeMatch = EACH_TYPE_HAS_PATTERN.exec(cleanText);
  if (eachTypeMatch) {
    const cardType = eachTypeMatch[1];
    const zone = eachTypeMatch[2];
    const keyword = eachTypeMatch[3];

    return {
      ability: {
        effect: {
          keyword,
          target: {
            location: zone.toLowerCase(),
            type: cardType.toLowerCase() === "equipment" ? "gear" : "card",
          } as Target,
          type: "grant-keyword",
        },
        type: "static",
      },
      endIndex: text.length,
      startIndex: 0,
    };
  }

  // Try restriction: "While CONDITION, opponents can't..."
  const restrictionMatch = RESTRICTION_PATTERN.exec(cleanText);
  if (restrictionMatch) {
    const conditionText = restrictionMatch[1];
    const restrictionText = restrictionMatch[2];

    const conditionResult = parseConditionFromText(conditionText + ",");
    const condition = conditionResult?.condition;

    if (condition) {
      return {
        ability: {
          condition,
          effect: {
            restriction: restrictionText,
            type: "restriction",
          } as unknown as Effect,
          type: "static",
        },
        endIndex: text.length,
        startIndex: 0,
      };
    }
  }

  // Try play location: "You may play me to..."
  const playLocationMatch = PLAY_LOCATION_PATTERN.exec(cleanText);
  if (playLocationMatch) {
    const locationText = playLocationMatch[1];

    return {
      ability: {
        effect: {
          allowedLocation: locationText,
          type: "play-restriction",
        } as unknown as Effect,
        type: "static",
      },
      endIndex: text.length,
      startIndex: 0,
    };
  }

  return undefined;
}

/**
 * Parse static abilities from text with positions
 */
export function parseStaticAbilitiesWithPositions(text: string): StaticAbilityParseResult[] {
  const result = parseStaticAbility(text);
  return result ? [result] : [];
}
