// Pattern database for matching Gundam card text to effects

import type {
  DynamicAmount,
  EffectPattern,
  GundamKeyword,
  ParsedEffect,
} from "./types";

/**
 * Gundam keyword symbols and their normalized forms
 */
export const GUNDAM_KEYWORDS = {
  REPAIR: "<Repair>",
  BREACH: "<Breach>",
  SUPPORT: "<Support>",
  BLOCKER: "<Blocker>",
  RUSH: "<Rush>",
  PIERCE: "<Pierce>",
  INTERCEPT: "<Intercept>",
  STEALTH: "<Stealth>",
} as const;

/**
 * Database of regex patterns for Gundam effects
 * Organized by effect type for easy maintenance and extension
 */
export const GUNDAM_EFFECT_PATTERNS: Record<string, EffectPattern[]> = {
  // Damage effects
  damage: [
    {
      pattern: /deal\s+(\d+)\s+damage\s+to\s+(.+)/i,
      type: "damage",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "damage",
        amount: Number.parseInt(match[1] || "0", 10),
        parameters: {
          targetText: match[2]?.trim() || "",
        },
      }),
    },
    {
      pattern: /(\d+)\s+damage\s+to\s+(.+)/i,
      type: "damage",
      priority: 8,
      extractor: (match): ParsedEffect => ({
        type: "damage",
        amount: Number.parseInt(match[1] || "0", 10),
        parameters: {
          targetText: match[2]?.trim() || "",
        },
      }),
    },
    {
      pattern: /deal\s+([xX])\s+damage\s+to\s+(.+)/i,
      type: "damage",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "damage",
        amount: {
          dynamic: true as const,
          type: "variable",
          variable: match[1]?.toUpperCase() || "X",
        },
        parameters: {
          targetText: match[2]?.trim() || "",
        },
      }),
    },
  ],

  // Destroy effects
  destroy: [
    {
      pattern: /destroy\s+(.+)/i,
      type: "destroy",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "destroy",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern: /(.+)\s+(?:is|are)\s+destroyed/i,
      type: "destroy",
      priority: 8,
      extractor: (match): ParsedEffect => ({
        type: "destroy",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
  ],

  // Deploy/Summon effects
  deploy: [
    {
      pattern: /deploy\s+(.+)\s+(?:to|onto)\s+(.+)/i,
      type: "deploy",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "deploy",
        parameters: {
          unitText: match[1]?.trim() || "",
          zoneText: match[2]?.trim() || "",
        },
      }),
    },
    {
      pattern: /put\s+(.+)\s+(?:into|onto)\s+(.+)/i,
      type: "deploy",
      priority: 8,
      extractor: (match): ParsedEffect => ({
        type: "deploy",
        parameters: {
          unitText: match[1]?.trim() || "",
          zoneText: match[2]?.trim() || "",
        },
      }),
    },
  ],

  // Search effects
  search: [
    {
      pattern: /search\s+your\s+(.+)\s+for\s+(.+)/i,
      type: "search",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "search",
        parameters: {
          zoneText: match[1]?.trim() || "",
          searchText: match[2]?.trim() || "",
        },
      }),
    },
    {
      pattern: /look\s+at\s+the\s+top\s+(\d+)\s+cards?\s+of\s+your\s+(.+)/i,
      type: "search",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "search",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {
          searchType: "look",
          zoneText: match[2]?.trim() || "",
        },
      }),
    },
  ],

  // Draw effects
  draw: [
    {
      pattern: /draw\s+(\d+)\s+cards?/i,
      type: "draw",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "draw",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {},
      }),
    },
    {
      pattern: /draw\s+a\s+card/i,
      type: "draw",
      priority: 9,
      extractor: (): ParsedEffect => ({
        type: "draw",
        amount: 1,
        parameters: {},
      }),
    },
    {
      pattern: /draw\s+([xX])\s+cards?/i,
      type: "draw",
      priority: 8,
      extractor: (match): ParsedEffect => ({
        type: "draw",
        amount: {
          dynamic: true as const,
          type: "variable",
          variable: match[1]?.toUpperCase() || "X",
        },
        parameters: {},
      }),
    },
  ],

  // Power/stat modification effects
  power: [
    {
      pattern: /(.+)\s+gets?\s+([+-]\d+)\s+power/i,
      type: "power",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "power",
        amount: Number.parseInt(match[2] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern: /(.+)\s+gains?\s+([+-]\d+)\s+power/i,
      type: "power",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "power",
        amount: Number.parseInt(match[2] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
  ],

  // Cost modification effects
  cost: [
    {
      pattern: /(.+)\s+costs?\s+(\d+)\s+less/i,
      type: "cost",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "cost",
        amount: -Number.parseInt(match[2] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern: /(.+)\s+costs?\s+(\d+)\s+more/i,
      type: "cost",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "cost",
        amount: Number.parseInt(match[2] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
  ],

  // Keyword effects
  keyword: [
    {
      pattern:
        /<(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+(\d+))?>/i,
      type: "keyword",
      priority: 15,
      extractor: (match): ParsedEffect => ({
        type: "keyword",
        amount: match[2] ? Number.parseInt(match[2], 10) : undefined,
        parameters: {
          keyword: match[1] as GundamKeyword,
          value: match[2] ? Number.parseInt(match[2], 10) : undefined,
        },
      }),
    },
    {
      pattern:
        /gains?\s+<(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+(\d+))?>/i,
      type: "keyword",
      priority: 12,
      extractor: (match): ParsedEffect => ({
        type: "keyword",
        amount: match[2] ? Number.parseInt(match[2], 10) : undefined,
        parameters: {
          keyword: match[1] as GundamKeyword,
          value: match[2] ? Number.parseInt(match[2], 10) : undefined,
          gained: true,
        },
      }),
    },
  ],
};

/**
 * Gets all patterns for a specific effect type
 */
export function getPatternsForEffectType(effectType: string): EffectPattern[] {
  return GUNDAM_EFFECT_PATTERNS[effectType] || [];
}

/**
 * Gets all available effect types
 */
export function getAvailableEffectTypes(): string[] {
  return Object.keys(GUNDAM_EFFECT_PATTERNS);
}

/**
 * Adds a new pattern to the database
 */
export function addPattern(effectType: string, pattern: EffectPattern): void {
  if (!GUNDAM_EFFECT_PATTERNS[effectType]) {
    GUNDAM_EFFECT_PATTERNS[effectType] = [];
  }
  GUNDAM_EFFECT_PATTERNS[effectType].push(pattern);
}

/**
 * Matches text against all patterns and returns the first match found
 * Patterns are sorted by priority (highest first)
 */
export function matchPattern(text: string): {
  match: RegExpMatchArray | null;
  pattern: EffectPattern | null;
  effectType: string | null;
} {
  // Create a flat list of all patterns with their effect types
  const allPatterns: Array<{ pattern: EffectPattern; effectType: string }> = [];

  for (const [effectType, patterns] of Object.entries(GUNDAM_EFFECT_PATTERNS)) {
    for (const pattern of patterns) {
      allPatterns.push({ pattern, effectType });
    }
  }

  // Sort by priority (highest first)
  allPatterns.sort(
    (a, b) => (b.pattern.priority || 0) - (a.pattern.priority || 0),
  );

  for (const { pattern, effectType } of allPatterns) {
    const match = text.match(pattern.pattern);
    if (match) {
      return {
        match,
        pattern,
        effectType,
      };
    }
  }

  return {
    match: null,
    pattern: null,
    effectType: null,
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

  // Normalize keyword symbols first
  remainingText = normalizeKeywords(remainingText);

  while (remainingText.trim() && iterations < maxIterations) {
    const { match, pattern } = matchPattern(remainingText);

    if (!(match && pattern)) {
      break;
    }

    try {
      const effect = pattern.extractor(match);
      effects.push(effect);

      // Remove the matched text to continue searching
      const matchedText = match[0];
      const matchIndex = remainingText.indexOf(matchedText);
      if (matchIndex !== -1) {
        remainingText =
          remainingText.slice(0, matchIndex) +
          remainingText.slice(matchIndex + matchedText.length);
      } else {
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
 * Normalizes keyword symbols in text
 */
export function normalizeKeywords(text: string): string {
  let normalized = text;

  // Normalize various keyword formats to standard <Keyword> format
  const keywordMappings = [
    { patterns: [/\[repair\]/gi, /\(repair\)/gi], replacement: "<Repair>" },
    { patterns: [/\[breach\]/gi, /\(breach\)/gi], replacement: "<Breach>" },
    { patterns: [/\[support\]/gi, /\(support\)/gi], replacement: "<Support>" },
    { patterns: [/\[blocker\]/gi, /\(blocker\)/gi], replacement: "<Blocker>" },
    { patterns: [/\[rush\]/gi, /\(rush\)/gi], replacement: "<Rush>" },
    { patterns: [/\[pierce\]/gi, /\(pierce\)/gi], replacement: "<Pierce>" },
    {
      patterns: [/\[intercept\]/gi, /\(intercept\)/gi],
      replacement: "<Intercept>",
    },
    { patterns: [/\[stealth\]/gi, /\(stealth\)/gi], replacement: "<Stealth>" },
  ];

  for (const mapping of keywordMappings) {
    for (const pattern of mapping.patterns) {
      normalized = normalized.replace(pattern, mapping.replacement);
    }
  }

  return normalized;
}

/**
 * Checks if text contains keyword effects
 */
export function hasKeywordEffects(text: string): boolean {
  const keywordPattern =
    /<(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+\d+)?>/i;
  return keywordPattern.test(text);
}

/**
 * Extracts all keyword effects from text
 */
export function extractKeywordEffects(text: string): Array<{
  keyword: GundamKeyword;
  value?: number;
}> {
  const keywords: Array<{ keyword: GundamKeyword; value?: number }> = [];
  const keywordPattern =
    /<(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+(\d+))?>/gi;

  let match;
  while ((match = keywordPattern.exec(text)) !== null) {
    keywords.push({
      keyword: match[1] as GundamKeyword,
      value: match[2] ? Number.parseInt(match[2], 10) : undefined,
    });
  }

  return keywords;
}
