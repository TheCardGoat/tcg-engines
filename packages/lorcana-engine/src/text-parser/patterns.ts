// Pattern database for matching text to effects

import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import type { EffectTargets } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { EffectPattern, ParsedEffect } from "./types";

/**
 * Database of regex patterns for basic effects
 * Organized by effect type for easy maintenance and extension
 */
export const EFFECT_PATTERNS: Record<string, EffectPattern[]> = {
  // Draw effects patterns
  draw: [
    {
      pattern: /\bdraw\s+a\s+card\b/i,
      type: "draw",
      extractor: (): ParsedEffect => ({
        type: "draw",
        amount: 1,
        parameters: {},
      }),
    },
    {
      pattern: /\bdraw\s+(\d+)\s+cards?\b/i,
      type: "draw",
      extractor: (match: RegExpMatchArray): ParsedEffect => ({
        type: "draw",
        amount: Number.parseInt(match[1] || "0", 10),
        parameters: {},
      }),
    },
    {
      pattern: /\bdraw\s+([a-zA-Z]+)\s+cards?\b/i,
      type: "draw",
      extractor: (match: RegExpMatchArray): ParsedEffect => {
        const amountText = match[1]?.toLowerCase() || "one";
        let amount: number | DynamicAmount;

        // Handle word numbers
        switch (amountText) {
          case "one":
            amount = 1;
            break;
          case "two":
            amount = 2;
            break;
          case "three":
            amount = 3;
            break;
          case "four":
            amount = 4;
            break;
          case "five":
            amount = 5;
            break;
          case "x":
            // For X variables, create appropriate dynamic amount
            amount = {
              dynamic: true as const,
            };
            break;
          default:
            // For other word amounts, fallback to 1
            amount = 1;
        }

        return {
          type: "draw",
          amount,
          parameters: {},
        };
      },
    },
  ],

  // Damage effects patterns
  damage: [
    {
      pattern: /\bdeal\s+(\d+)\s+damage\s+to\s+(.+)/i,
      type: "damage",
      extractor: (match: RegExpMatchArray): ParsedEffect => ({
        type: "damage",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {
          targetText: match[2]?.trim() || "",
        },
      }),
    },
    {
      pattern: /\bdeal\s+([a-zA-Z]+)\s+damage\s+to\s+(.+)/i,
      type: "damage",
      extractor: (match: RegExpMatchArray): ParsedEffect => {
        const amountText = match[1]?.toLowerCase() || "one";
        let amount: number | DynamicAmount;

        // Handle word numbers and variables
        switch (amountText) {
          case "one":
            amount = 1;
            break;
          case "two":
            amount = 2;
            break;
          case "three":
            amount = 3;
            break;
          case "four":
            amount = 4;
            break;
          case "five":
            amount = 5;
            break;
          case "x":
            // For X variables, create appropriate dynamic amount
            amount = {
              dynamic: true as const,
            };
            break;
          default:
            // For other word amounts, fallback to 1
            amount = 1;
        }

        return {
          type: "damage",
          amount,
          parameters: {
            targetText: match[2]?.trim() || "",
          },
        };
      },
    },
    {
      pattern: /\b(\d+)\s+damage\s+to\s+(.+)/i,
      type: "damage",
      extractor: (match: RegExpMatchArray): ParsedEffect => ({
        type: "damage",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {
          targetText: match[2]?.trim() || "",
        },
      }),
    },
  ],

  // Banish effects patterns
  banish: [
    {
      pattern: /\bbanish\s+(.+)/i,
      type: "banish",
      extractor: (match: RegExpMatchArray): ParsedEffect => ({
        type: "banish",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern: /\b(.+)\s+(?:is|are)\s+banished\b/i,
      type: "banish",
      extractor: (match: RegExpMatchArray): ParsedEffect => ({
        type: "banish",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
  ],

  // Attribute modifier effects patterns
  attribute: [
    {
      pattern: /\b(.+?)\s+gets?\s+([+-]\d+)\s+\{([SLW])\}/i,
      type: "attribute",
      extractor: (match: RegExpMatchArray): ParsedEffect => {
        const modifier = Number.parseInt(match[2] || "0", 10);
        const attribute = match[3]?.toLowerCase() || "s";

        return {
          type: "attribute",
          amount: modifier,
          parameters: {
            targetText: match[1]?.trim() || "",
            attribute:
              attribute === "s"
                ? "strength"
                : attribute === "l"
                  ? "lore"
                  : "willpower",
          },
        };
      },
    },
    {
      pattern: /\b(.+?)\s+gains?\s+([+-]\d+)\s+\{([SLW])\}/i,
      type: "attribute",
      extractor: (match: RegExpMatchArray): ParsedEffect => {
        const modifier = Number.parseInt(match[2] || "0", 10);
        const attribute = match[3]?.toLowerCase() || "s";

        return {
          type: "attribute",
          amount: modifier,
          parameters: {
            targetText: match[1]?.trim() || "",
            attribute:
              attribute === "s"
                ? "strength"
                : attribute === "l"
                  ? "lore"
                  : "willpower",
          },
        };
      },
    },
  ],
};

/**
 * Gets all patterns for a specific effect type
 */
export function getPatternsForEffectType(effectType: string): EffectPattern[] {
  return EFFECT_PATTERNS[effectType] || [];
}

/**
 * Gets all available effect types
 */
export function getAvailableEffectTypes(): string[] {
  return Object.keys(EFFECT_PATTERNS);
}

/**
 * Adds a new pattern to the database
 */
export function addPattern(effectType: string, pattern: EffectPattern): void {
  if (!EFFECT_PATTERNS[effectType]) {
    EFFECT_PATTERNS[effectType] = [];
  }
  EFFECT_PATTERNS[effectType].push(pattern);
}

/**
 * Matches text against all patterns and returns the first match found
 */
export function matchPattern(text: string): {
  match: RegExpMatchArray | null;
  pattern: EffectPattern | null;
  effectType: string | null;
} {
  for (const [effectType, patterns] of Object.entries(EFFECT_PATTERNS)) {
    for (const pattern of patterns) {
      const match = text.match(pattern.pattern);
      if (match) {
        return {
          match,
          pattern,
          effectType,
        };
      }
    }
  }

  return {
    match: null,
    pattern: null,
    effectType: null,
  };
}

/**
 * Matches text against patterns for a specific effect type
 */
export function matchPatternForType(
  text: string,
  effectType: string,
): {
  match: RegExpMatchArray | null;
  pattern: EffectPattern | null;
} {
  const patterns = getPatternsForEffectType(effectType);

  for (const pattern of patterns) {
    const match = text.match(pattern.pattern);
    if (match) {
      return {
        match,
        pattern,
      };
    }
  }

  return {
    match: null,
    pattern: null,
  };
}

/**
 * Extracts all effects from text using pattern matching
 */
export function extractEffectsFromText(text: string): ParsedEffect[] {
  const effects: ParsedEffect[] = [];
  let remainingText = text;
  const maxIterations = 20; // Prevent infinite loops
  let iterations = 0;

  // Keep matching patterns until no more matches are found
  while (remainingText.trim() && iterations < maxIterations) {
    const { match, pattern, effectType } = matchPattern(remainingText);

    if (!(match && pattern)) {
      break;
    }

    try {
      const effect = pattern.extractor(match);
      effects.push(effect);

      // More robust text removal to prevent infinite loops
      const matchedText = match[0];
      const matchIndex = remainingText.indexOf(matchedText);
      if (matchIndex !== -1) {
        remainingText =
          remainingText.slice(0, matchIndex) +
          remainingText.slice(matchIndex + matchedText.length);
      } else {
        // Fallback: remove from start
        remainingText = remainingText.replace(match[0], "");
      }
      remainingText = remainingText.trim();
    } catch (error) {
      console.warn(`Failed to extract effect from match: ${match[0]}`, error);
      break;
    }

    iterations++;
  }

  return effects;
}

/**
 * Target recognition patterns for converting text to EffectTargets
 * Maps common targeting phrases to their corresponding target objects
 */
export const TARGET_PATTERNS: Record<string, RegExp> = {
  // Character targets
  chosenCharacter: /\bchosen character\b/i,
  chosenCharacterOfYours: /\bchosen character of yours\b/i,
  chosenOpposingCharacter: /\bchosen opposing character\b/i,
  anotherChosenCharacter: /\banother chosen character\b/i,
  anotherChosenCharacterOfYours: /\banother chosen character of yours\b/i,

  // Player targets
  opponent: /\beach opponent\b/i,
  self: /\byou\b/i,

  // Multiple character targets
  yourCharacters: /\byour characters?\b/i,
  allYourCharacters: /\ball (?:of )?your characters?\b/i,
  eachOfYourCharacters: /\beach of your characters?\b/i,
  opposingCharacters: /\bopposing characters?\b/i,
  allOpposingCharacters: /\ball opposing characters?\b/i,

  // Item and location targets
  chosenItem: /\bchosen item\b/i,
  chosenLocation: /\bchosen location\b/i,
  chosenItemOrLocation: /\bchosen (?:item or location|location or item)\b/i,

  // Pronoun targets (contextual)
  them: /\bthem\b/i,
  they: /\bthey\b/i,
  it: /\bit\b/i,
  thisCharacter: /\bthis character\b/i,
};

/**
 * Zone-based targeting patterns
 * Used to identify cards from specific zones
 */
export const ZONE_PATTERNS: Record<string, RegExp> = {
  hand: /\bfrom (?:your )?hand\b/i,
  discard: /\bfrom (?:your )?discard(?:\s+pile)?\b/i,
  deck: /\bfrom (?:your )?deck\b/i,
  play: /\bin play\b/i,
  inkwell: /\bfrom (?:your )?inkwell\b/i,

  // Opponent zones
  opponentHand: /\bfrom (?:their|opponent'?s) hand\b/i,
  opponentDiscard: /\bfrom (?:their|opponent'?s) discard(?:\s+pile)?\b/i,
  opponentDeck: /\bfrom (?:their|opponent'?s) deck\b/i,
};

/**
 * Owner filter patterns
 * Used to determine card ownership
 */
export const OWNER_PATTERNS: Record<string, RegExp> = {
  self: /\b(?:your|yours)\b/i,
  opponent: /\b(?:their|opponent'?s|opposing)\b/i,
};

/**
 * Parses target text and returns the most appropriate target identifier
 */
export function parseTargetText(targetText: string): {
  targetType: string | null;
  zone: string | null;
  owner: string | null;
  isMultiple: boolean;
  originalText: string;
} {
  const normalizedText = targetText.toLowerCase().trim();

  // Check for target patterns - prioritize more specific patterns first
  // Sort patterns by specificity (longer patterns first)
  const sortedTargetPatterns = Object.entries(TARGET_PATTERNS).sort((a, b) => {
    const aLength = a[1].source.length;
    const bLength = b[1].source.length;
    return bLength - aLength;
  });

  let targetType: string | null = null;
  for (const [type, pattern] of sortedTargetPatterns) {
    if (pattern.test(normalizedText)) {
      targetType = type;
      break;
    }
  }

  // Check for zone patterns
  let zone: string | null = null;
  for (const [zoneName, pattern] of Object.entries(ZONE_PATTERNS)) {
    if (pattern.test(normalizedText)) {
      zone = zoneName;
      break;
    }
  }

  // Check for owner patterns
  let owner: string | null = null;
  for (const [ownerType, pattern] of Object.entries(OWNER_PATTERNS)) {
    if (pattern.test(normalizedText)) {
      owner = ownerType;
      break;
    }
  }

  // Determine if target is multiple
  const isMultiple =
    /\b(?:all|each|every|any number of)\b/i.test(normalizedText) ||
    (/characters?\b/i.test(normalizedText) &&
      !/\ba\s+character\b|\bchosen character\b/i.test(normalizedText));

  return {
    targetType,
    zone,
    owner,
    isMultiple,
    originalText: targetText,
  };
}

/**
 * Converts parsed target information to an EffectTargets object
 * This is a simplified mapping - in a full implementation, this would
 * import and use the actual target objects from the engine
 */
export function convertToEffectTarget(
  parsedTarget: ReturnType<typeof parseTargetText>,
): EffectTargets | null {
  const { targetType, zone, owner, isMultiple } = parsedTarget;

  // This is a simplified implementation that returns target identifiers
  // In the full implementation, this would return actual EffectTargets objects
  if (!targetType) {
    return null;
  }

  // Create a mock target structure for testing purposes
  // In the real implementation, this would use the actual target imports
  const mockTarget = {
    type:
      targetType.includes("player") ||
      targetType === "opponent" ||
      targetType === "self"
        ? "player"
        : "card",
    identifier: targetType,
    zone,
    owner,
    isMultiple,
  } as any;

  return mockTarget;
}

/**
 * Enhanced pattern matching that includes target recognition
 */
export function matchPatternWithTargets(text: string): {
  match: RegExpMatchArray | null;
  pattern: EffectPattern | null;
  effectType: string | null;
  parsedTarget: ReturnType<typeof parseTargetText> | null;
  effectTarget: EffectTargets | null;
} {
  const basicMatch = matchPattern(text);

  if (!(basicMatch.match && basicMatch.pattern)) {
    return {
      ...basicMatch,
      parsedTarget: null,
      effectTarget: null,
    };
  }

  // Extract target text from the effect parameters
  const effect = basicMatch.pattern.extractor(basicMatch.match);
  const targetText = effect.parameters?.targetText;

  let parsedTarget: ReturnType<typeof parseTargetText> | null = null;
  let effectTarget: EffectTargets | null = null;

  if (targetText) {
    parsedTarget = parseTargetText(targetText);
    effectTarget = convertToEffectTarget(parsedTarget);
  }

  return {
    ...basicMatch,
    parsedTarget,
    effectTarget,
  };
}

/**
 * Enhanced effect extraction that includes target resolution
 */
export function extractEffectsWithTargets(text: string): Array<
  ParsedEffect & {
    parsedTarget?: ReturnType<typeof parseTargetText>;
    resolvedTarget?: EffectTargets;
  }
> {
  const effects: Array<
    ParsedEffect & {
      parsedTarget?: ReturnType<typeof parseTargetText>;
      resolvedTarget?: EffectTargets;
    }
  > = [];

  let remainingText = text;

  while (remainingText.trim()) {
    const matchResult = matchPatternWithTargets(remainingText);

    if (!(matchResult.match && matchResult.pattern)) {
      break;
    }

    try {
      const effect = matchResult.pattern.extractor(matchResult.match);

      // Add target information to the effect
      const enhancedEffect = {
        ...effect,
        parsedTarget: matchResult.parsedTarget || undefined,
        resolvedTarget: matchResult.effectTarget || undefined,
      };

      // Update the effect's target property if we resolved one
      if (matchResult.effectTarget) {
        enhancedEffect.target = matchResult.effectTarget;
      }

      effects.push(enhancedEffect);

      // Remove the matched text to continue searching
      remainingText = remainingText.replace(matchResult.match[0], "").trim();
    } catch (error) {
      console.warn(
        `Failed to extract effect from match: ${matchResult.match[0]}`,
        error,
      );
      break;
    }
  }

  return effects;
}
/**
 * Duration patterns for recognizing temporal modifiers
 */
export const DURATION_PATTERNS: {
  thisTurn: RegExp;
  untilEndOfTurn: RegExp;
  permanently: RegExp;
  nextTurn: RegExp;
  [key: string]: RegExp;
} = {
  thisTurn: /\bthis turn\b/i,
  untilEndOfTurn: /\buntil (?:the )?end of (?:the )?turn\b/i,
  permanently: /\bpermanently\b/i,
  nextTurn: /\bnext turn\b/i,
};

/**
 * Timing patterns for recognizing when effects trigger
 */
export const TIMING_PATTERNS: {
  // Triggered timing patterns
  endOfTurn: RegExp;
  beginningOfTurn: RegExp;
  endOfYourTurn: RegExp;
  beginningOfYourTurn: RegExp;

  // Immediate timing
  immediately: RegExp;
  now: RegExp;

  // Conditional timing
  when: RegExp;
  whenever: RegExp;
  if: RegExp;
  then: RegExp;

  // Sequence timing
  first: RegExp;
  after: RegExp;
  before: RegExp;

  [key: string]: RegExp;
} = {
  // Triggered timing patterns
  endOfTurn: /\bat the end of (?:your|the) turn\b/i,
  beginningOfTurn: /\bat the beginning of (?:your|the) turn\b/i,
  endOfYourTurn: /\bat the end of your turn\b/i,
  beginningOfYourTurn: /\bat the beginning of your turn\b/i,

  // Immediate timing
  immediately: /\bimmediately\b/i,
  now: /\bnow\b/i,

  // Conditional timing
  when: /\bwhen\b/i,
  whenever: /\bwhenever\b/i,
  if: /\bif\b/i,
  then: /\bthen\b/i,

  // Sequence timing
  first: /\bfirst\b/i,
  after: /\bafter\b/i,
  before: /\bbefore\b/i,
};

/**
 * Conditional patterns for recognizing conditional effects
 */
export const CONDITIONAL_PATTERNS: {
  // If-then patterns
  ifThen: RegExp;

  // When patterns
  when: RegExp;
  whenever: RegExp;

  // Simple then pattern
  then: RegExp;

  // Choose patterns
  chooseOne: RegExp;
  choose: RegExp;

  // May patterns
  may: RegExp;

  [key: string]: RegExp;
} = {
  // If-then patterns
  ifThen: /\bif\s+(.+?),?\s+then\s+(.+)/i,

  // When patterns
  when: /\bwhen\s+(.+?),\s*(.+)/i,
  whenever: /\bwhenever\s+(.+?),\s*(.+)/i,

  // Simple then pattern
  then: /(.+?)\s+then\s+(.+)/i,

  // Choose patterns - more specific first
  chooseOne: /\bchoose one:\s*(.+)/i,
  choose: /\bchoose\s+(?:two|three|\d+):\s*(.+)/i, // Removed "one" since it's handled by chooseOne

  // May patterns
  may: /\bmay\s+(.+)/i,
};

/**
 * Parses timing and duration information from text
 */
export function parseTimingAndDuration(text: string): {
  duration: string | null;
  timing: string | null;
  isTriggered: boolean;
  isConditional: boolean;
  conditionalType: string | null;
  condition: string | null;
  consequence: string | null;
  originalText: string;
} {
  const normalizedText = text.toLowerCase().trim();

  // Check for duration patterns first
  let duration: string | null = null;
  for (const [durationType, pattern] of Object.entries(DURATION_PATTERNS)) {
    if (pattern.test(normalizedText)) {
      // Map pattern types to duration values
      switch (durationType) {
        case "thisTurn":
        case "untilEndOfTurn":
          duration = "turn";
          break;
        case "permanently":
          duration = "permanent";
          break;
        case "nextTurn":
          duration = "next-turn";
          break;
        default:
          duration = durationType;
      }
      break;
    }
  }

  // Check for timing patterns
  let timing: string | null = null;
  let isTriggered = false;
  for (const [timingType, pattern] of Object.entries(TIMING_PATTERNS)) {
    if (pattern.test(normalizedText)) {
      switch (timingType) {
        case "endOfTurn":
        case "endOfYourTurn":
          timing = "end-of-turn";
          isTriggered = true;
          break;
        case "beginningOfTurn":
        case "beginningOfYourTurn":
          timing = "beginning-of-turn";
          isTriggered = true;
          break;
        case "when":
        case "whenever":
          timing = timingType;
          isTriggered = true;
          break;
        case "immediately":
        case "now":
          timing = "immediate";
          break;
        default:
          timing = timingType;
      }
      break;
    }
  }

  // Check for conditional patterns - prioritize more specific patterns first
  const sortedConditionalPatterns = Object.entries(CONDITIONAL_PATTERNS).sort(
    (a, b) => {
      const aLength = a[1].source.length;
      const bLength = b[1].source.length;
      return bLength - aLength;
    },
  );

  let isConditional = false;
  let conditionalType: string | null = null;
  let condition: string | null = null;
  let consequence: string | null = null;

  for (const [condType, pattern] of sortedConditionalPatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      isConditional = true;
      conditionalType = condType;

      // Extract condition and consequence based on pattern type
      switch (condType) {
        case "ifThen":
        case "when":
        case "whenever":
        case "then":
          condition = match[1]?.trim() || null;
          consequence = match[2]?.trim() || null;
          break;
        case "choose":
        case "chooseOne":
          consequence = match[1]?.trim() || null;
          break;
        case "may":
          consequence = match[1]?.trim() || null;
          break;
      }
      break;
    }
  }

  return {
    duration,
    timing,
    isTriggered,
    isConditional,
    conditionalType,
    condition,
    consequence,
    originalText: text,
  };
}

/**
 * Enhanced effect extraction that includes timing and duration information
 */
export function extractEffectsWithTimingAndTargets(text: string): Array<
  ParsedEffect & {
    parsedTarget?: ReturnType<typeof parseTargetText>;
    resolvedTarget?: EffectTargets;
    timingInfo?: ReturnType<typeof parseTimingAndDuration>;
  }
> {
  const effects: Array<
    ParsedEffect & {
      parsedTarget?: ReturnType<typeof parseTargetText>;
      resolvedTarget?: EffectTargets;
      timingInfo?: ReturnType<typeof parseTimingAndDuration>;
    }
  > = [];

  let remainingText = text;

  // First, parse overall timing and duration for the entire text
  const overallTimingInfo = parseTimingAndDuration(text);

  while (remainingText.trim()) {
    const matchResult = matchPatternWithTargets(remainingText);

    if (!(matchResult.match && matchResult.pattern)) {
      break;
    }

    try {
      const effect = matchResult.pattern.extractor(matchResult.match);

      // Parse timing information for this specific effect
      const effectTimingInfo = parseTimingAndDuration(matchResult.match[0]);

      // Combine overall timing with effect-specific timing
      // Prioritize effect-specific timing, but fall back to overall timing
      const combinedTimingInfo = {
        duration: effectTimingInfo.duration || overallTimingInfo.duration,
        timing: effectTimingInfo.timing || overallTimingInfo.timing,
        isTriggered:
          effectTimingInfo.isTriggered || overallTimingInfo.isTriggered,
        isConditional:
          effectTimingInfo.isConditional || overallTimingInfo.isConditional,
        conditionalType:
          effectTimingInfo.conditionalType || overallTimingInfo.conditionalType,
        condition: effectTimingInfo.condition || overallTimingInfo.condition,
        consequence:
          effectTimingInfo.consequence || overallTimingInfo.consequence,
        originalText: matchResult.match[0],
      };

      // Add timing and target information to the effect
      const enhancedEffect = {
        ...effect,
        parsedTarget: matchResult.parsedTarget || undefined,
        resolvedTarget: matchResult.effectTarget || undefined,
        timingInfo: combinedTimingInfo,
      };

      // Update the effect's target property if we resolved one
      if (matchResult.effectTarget) {
        enhancedEffect.target = matchResult.effectTarget;
      }

      // Update the effect's duration if we found one
      if (combinedTimingInfo.duration) {
        enhancedEffect.duration = combinedTimingInfo.duration;
      }

      effects.push(enhancedEffect);

      // Remove the matched text to continue searching
      remainingText = remainingText.replace(matchResult.match[0], "").trim();
    } catch (error) {
      console.warn(
        `Failed to extract effect from match: ${matchResult.match[0]}`,
        error,
      );
      break;
    }
  }

  return effects;
}

/**
 * Determines if effects should resolve individually based on timing patterns
 */
export function shouldResolveEffectsIndividually(text: string): boolean {
  const timingInfo = parseTimingAndDuration(text);

  // Effects should resolve individually if they have different timing
  // or if there are conditional patterns
  return (
    timingInfo.isConditional ||
    timingInfo.conditionalType === "then" ||
    /\bthen\b/i.test(text) ||
    /\bchoose\b/i.test(text)
  );
}

/**
 * Determines if effects are dependent on each other
 */
export function areEffectsDependent(text: string): boolean {
  const timingInfo = parseTimingAndDuration(text);

  // Effects are dependent if they use "then" or other sequential patterns
  return (
    timingInfo.conditionalType === "then" ||
    /\bthen\b/i.test(text) ||
    /\bafter\b/i.test(text) ||
    /\bfirst\b/i.test(text)
  );
}
