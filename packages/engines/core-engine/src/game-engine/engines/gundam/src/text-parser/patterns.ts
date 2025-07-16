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
      pattern: /deal\s+(\d+)\s+damage\s+to\s+(.+)/gi,
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
      pattern: /(\d+)\s+damage\s+to\s+(.+)/gi,
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
      pattern: /deal\s+([xX])\s+damage\s+to\s+(.+)/gi,
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
      pattern: /destroy\s+(.+)/gi,
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
      pattern: /(.+)\s+(?:is|are)\s+destroyed/gi,
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
      pattern: /deploy\s+(.+)\s+(?:to|onto)\s+(.+)/gi,
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
      pattern: /put\s+(.+)\s+(?:into|onto)\s+(.+)/gi,
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
      pattern: /search\s+your\s+(.+)\s+for\s+(.+)/gi,
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
      pattern: /look\s+at\s+the\s+top\s+(\d+)\s+cards?\s+of\s+your\s+(.+)/gi,
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
      pattern: /draw\s+(\d+)(?:\s+cards?)?\.?/gi,
      type: "draw",
      priority: 11,
      extractor: (match): ParsedEffect => ({
        type: "draw",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {},
      }),
    },
    {
      pattern: /draw\s+(\d+)\s+cards?/gi,
      type: "draw",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "draw",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {},
      }),
    },
    {
      pattern: /draw\s+a\s+card/gi,
      type: "draw",
      priority: 9,
      extractor: (): ParsedEffect => ({
        type: "draw",
        amount: 1,
        parameters: {},
      }),
    },
    {
      pattern: /draw\s+([xX])\s+cards?/gi,
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

  // Discard effects
  discard: [
    {
      pattern: /discard\s+(\d+)\s+cards?\.?/gi,
      type: "discard",
      priority: 11,
      extractor: (match): ParsedEffect => ({
        type: "discard",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {
          originalText: match[0]?.trim() || "",
        },
      }),
    },
    {
      pattern: /discard\s+(\d+)\.?/gi,
      type: "discard",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "discard",
        amount: Number.parseInt(match[1] || "1", 10),
        parameters: {
          originalText: match[0]?.trim() || "",
        },
      }),
    },
    {
      pattern: /discard\s+a\s+card\.?/gi,
      type: "discard",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "discard",
        amount: 1,
        parameters: {
          originalText: match[0]?.trim() || "",
        },
      }),
    },
  ],

  // Power/stat modification effects
  power: [
    {
      pattern: /(.+)\s+gets?\s+([+-]\d+)\s+power/gi,
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
      pattern: /(.+)\s+gains?\s+([+-]\d+)\s+power/gi,
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

  // Attribute boost/modification effects (AP, HP, etc.)
  "attribute-boost": [
    {
      pattern: /(.+)\s+gets?\s+(AP|HP|ap|hp)([+-]\d+)/gi,
      type: "attribute-boost",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "attribute-boost",
        amount: Number.parseInt(match[3] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
          attribute: match[2]?.toUpperCase() || "AP",
        },
      }),
    },
    {
      pattern: /(.+)\s+gets?\s+([+-]\d+)\s+(AP|HP|ap|hp)/gi,
      type: "attribute-boost",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "attribute-boost",
        amount: Number.parseInt(match[2] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
          attribute: match[3]?.toUpperCase() || "AP",
        },
      }),
    },
    {
      pattern: /(.+)\s+gains?\s+(AP|HP|ap|hp)([+-]\d+)/gi,
      type: "attribute-boost",
      priority: 8,
      extractor: (match): ParsedEffect => ({
        type: "attribute-boost",
        amount: Number.parseInt(match[3] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
          attribute: match[2]?.toUpperCase() || "AP",
        },
      }),
    },
    {
      pattern: /(.+)\s+gains?\s+([+-]\d+)\s+(AP|HP|ap|hp)/gi,
      type: "attribute-boost",
      priority: 7,
      extractor: (match): ParsedEffect => ({
        type: "attribute-boost",
        amount: Number.parseInt(match[2] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
          attribute: match[3]?.toUpperCase() || "AP",
        },
      }),
    },
  ],

  // Attribute modification effects (temporary changes)
  "attribute-modification": [
    {
      pattern:
        /(.+)\s+gets?\s+(AP|HP|ap|hp)([+-]\d+)\s+(?:during\s+)?(?:this\s+)?turn/gi,
      type: "attribute-modification",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "attribute-modification",
        amount: Number.parseInt(match[3] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
          attribute: match[2]?.toUpperCase() || "AP",
          duration: "turn",
        },
      }),
    },
    {
      pattern:
        /(.+)\s+gets?\s+([+-]\d+)\s+(AP|HP|ap|hp)\s+(?:during\s+)?(?:this\s+)?turn/gi,
      type: "attribute-modification",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "attribute-modification",
        amount: Number.parseInt(match[2] || "0", 10),
        parameters: {
          targetText: match[1]?.trim() || "",
          attribute: match[3]?.toUpperCase() || "AP",
          duration: "turn",
        },
      }),
    },
  ],

  // Cost modification effects
  cost: [
    {
      pattern: /(.+)\s+costs?\s+(\d+)\s+less/gi,
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
      pattern: /(.+)\s+costs?\s+(\d+)\s+more/gi,
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
        /<(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+(\d+))?>/gi,
      type: "keyword",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "keyword",
        parameters: {
          keyword: match[1] as GundamKeyword,
          value: match[2] ? Number.parseInt(match[2], 10) : undefined,
          originalText: match[0],
        },
      }),
    },
    {
      // Handle HTML encoded variants in case they appear in the JSON
      pattern:
        /&lt;(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+(\d+))?&gt;/gi,
      type: "keyword",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "keyword",
        parameters: {
          keyword: match[1] as GundamKeyword,
          value: match[2] ? Number.parseInt(match[2], 10) : undefined,
          originalText: match[0],
        },
      }),
    },
  ],

  // Targeting effects (choose, select, etc.)
  targeting: [
    {
      pattern:
        /choose\s+(\d+|a|an|up\s+to\s+\d+)\s+(.+?)(?:\s+with\s+(.+?))?(?:\.|$)/gi,
      type: "targeting",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "targeting",
        parameters: {
          amount: match[1]?.trim() || "1",
          targetText: match[2]?.trim() || "",
          condition: match[3]?.trim() || "",
          originalText: match[0]?.trim() || "",
        },
      }),
    },
    {
      pattern:
        /select\s+(\d+|a|an|up\s+to\s+\d+)\s+(.+?)(?:\s+with\s+(.+?))?(?:\.|$)/gi,
      type: "targeting",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "targeting",
        parameters: {
          amount: match[1]?.trim() || "1",
          targetText: match[2]?.trim() || "",
          condition: match[3]?.trim() || "",
          originalText: match[0]?.trim() || "",
        },
      }),
    },
  ],

  // Move to hand effects (bounce effects)
  "move-to-hand": [
    {
      pattern: /add\s+(this\s+card|.+?)\s+to\s+(?:your\s+)?hand/gi,
      type: "move-to-hand",
      priority: 11,
      extractor: (match): ParsedEffect => ({
        type: "move-to-hand",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern: /return\s+(.+?)\s+to\s+(?:its?\s+owner'?s?\s+)?hand/gi,
      type: "move-to-hand",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "move-to-hand",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern:
        /(.+?)\s+(?:is|are)\s+returned\s+to\s+(?:its?\s+owner'?s?\s+)?hand/gi,
      type: "move-to-hand",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "move-to-hand",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern: /bounce\s+(.+)/gi,
      type: "move-to-hand",
      priority: 8,
      extractor: (match): ParsedEffect => ({
        type: "move-to-hand",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
  ],

  // Rest effects (tap effects)
  rest: [
    {
      pattern: /rest\s+(.+)/gi,
      type: "rest",
      priority: 10,
      extractor: (match): ParsedEffect => ({
        type: "rest",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
    {
      pattern: /(.+?)\s+(?:is|are)\s+rested/gi,
      type: "rest",
      priority: 9,
      extractor: (match): ParsedEffect => ({
        type: "rest",
        parameters: {
          targetText: match[1]?.trim() || "",
        },
      }),
    },
  ],

  // Rule text patterns (for RESOURCE, EX BASE, and other special cards)
  rule: [
    {
      pattern: /\((.*?)\)/gi,
      type: "rule",
      priority: 5,
      extractor: (match): ParsedEffect => ({
        type: "rule",
        parameters: {
          ruleText: match[1]?.trim() || "",
          originalText: match[0],
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
 * Extracts effects from text by matching against patterns
 */
export function extractEffectsFromText(text: string): ParsedEffect[] {
  const effects: ParsedEffect[] = [];
  const effectTypes = getAvailableEffectTypes();

  // First check for keyword effects as they're special
  if (hasKeywordEffects(text)) {
    const keywordEffects = extractKeywordEffects(text);
    keywordEffects.forEach((keywordEffect) => {
      effects.push({
        type: "keyword",
        parameters: {
          keyword: keywordEffect.keyword,
          value: keywordEffect.value,
          originalText: text,
        },
      });
    });

    // If we found keywords, and there's nothing else, return just the keyword effects
    if (
      effects.length > 0 &&
      text.trim() === effects[0].parameters.originalText.trim()
    ) {
      return effects;
    }
  }

  // Process each effect type and try to match patterns
  for (const effectType of effectTypes) {
    const patterns = getPatternsForEffectType(effectType);
    if (!patterns || patterns.length === 0) continue;

    // Skip keyword patterns if we've already processed them above
    if (effectType === "keyword" && effects.length > 0) continue;

    // Sort patterns by priority (higher first)
    const sortedPatterns = [...patterns].sort(
      (a, b) => (b.priority || 0) - (a.priority || 0),
    );

    // Try each pattern for this effect type
    for (const pattern of sortedPatterns) {
      try {
        // Make sure the pattern is global for matchAll
        const globalPattern = pattern.pattern.global
          ? pattern.pattern
          : new RegExp(pattern.pattern.source, pattern.pattern.flags + "g");

        const matches = Array.from(text.matchAll(globalPattern));

        if (matches.length > 0) {
          for (const match of matches) {
            try {
              const parsedEffect = pattern.extractor(match);

              // Add original text for reference
              if (!parsedEffect.parameters.originalText) {
                parsedEffect.parameters.originalText = match[0];
              }

              // Add target text for later processing if not already present
              if (
                match.length > 1 &&
                !parsedEffect.parameters.targetText &&
                [
                  "damage",
                  "destroy",
                  "attribute-boost",
                  "attribute-modification",
                ].includes(parsedEffect.type)
              ) {
                const possibleTargetIndex = match.findIndex(
                  (group, idx) =>
                    idx > 0 &&
                    group &&
                    /target|enemy|unit|character|card|player/.test(group),
                );

                if (possibleTargetIndex > 0) {
                  parsedEffect.parameters.targetText =
                    match[possibleTargetIndex];
                }
              }

              effects.push(parsedEffect);
            } catch (error) {
              // Skip this pattern if extraction fails
              console.error("Error extracting effect:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error applying pattern:", error);
        // Continue with next pattern
      }
    }
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
  const normalKeywordPattern =
    /<(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+\d+)?>/i;
  const htmlKeywordPattern =
    /&lt;(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+\d+)?&gt;/i;

  return normalKeywordPattern.test(text) || htmlKeywordPattern.test(text);
}

/**
 * Extracts all keyword effects from text
 */
export function extractKeywordEffects(text: string): Array<{
  keyword: GundamKeyword;
  value?: number;
}> {
  const keywords: Array<{ keyword: GundamKeyword; value?: number }> = [];

  // Match both normal and HTML encoded keyword patterns
  const normalKeywordRegex =
    /<(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+(\d+))?>/gi;
  const htmlKeywordRegex =
    /&lt;(Repair|Breach|Support|Blocker|Rush|Pierce|Intercept|Stealth)(?:\s+(\d+))?&gt;/gi;

  let match;

  // Process normal keywords
  while ((match = normalKeywordRegex.exec(text)) !== null) {
    keywords.push({
      keyword: match[1] as GundamKeyword,
      value: match[2] ? Number.parseInt(match[2], 10) : undefined,
    });
  }

  // Process HTML encoded keywords
  while ((match = htmlKeywordRegex.exec(text)) !== null) {
    keywords.push({
      keyword: match[1] as GundamKeyword,
      value: match[2] ? Number.parseInt(match[2], 10) : undefined,
    });
  }

  return keywords;
}
