// Main parser for generating Gundam card abilities from text

import {
  extractEffectsFromText,
  hasKeywordEffects,
  normalizeKeywords,
} from "./patterns";
import { parseTargetFromText } from "./target-mapper";
import type {
  GundamEffectTarget,
  GundamParseResult,
  GundamParserConfig,
  ParsedClause,
  ParsedEffect,
} from "./types";

/**
 * Game symbols that appear in Gundam card text
 */
export const GUNDAM_SYMBOLS = {
  COST: "{C}",
  POWER: "{P}",
  SHIELD: "{S}",
} as const;

/**
 * Normalizes text spacing by removing extra whitespace
 */
export function normalizeSpacing(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s*([,.;:!?])\s*/g, "$1 ")
    .replace(/\s+([.!?])$/g, "$1")
    .trim();
}

/**
 * Normalizes punctuation by standardizing common patterns
 */
export function normalizePunctuation(text: string): string {
  let result = text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/([.!?]){2,}/g, "$1");

  if (result.trim() && !result.trim().match(/[.!?]$/)) {
    result = result.replace(/\s*$/, ".");
  }

  return result;
}

/**
 * Handles special game symbols by normalizing their format
 */
export function handleGameSymbols(text: string): string {
  let processed = text;

  // Replace various formats with standardized symbols
  processed = processed
    .replace(/\{cost\}/gi, GUNDAM_SYMBOLS.COST)
    .replace(/\{power\}/gi, GUNDAM_SYMBOLS.POWER)
    .replace(/\{shield\}/gi, GUNDAM_SYMBOLS.SHIELD);

  // Ensure space around symbols
  processed = processed
    .replace(/(\w)(\{[CPS]\})/g, "$1 $2")
    .replace(/(\{[CPS]\})(\w)/g, "$1 $2");

  return processed;
}

/**
 * Comprehensive text normalization function
 */
export function normalizeText(text: string): string {
  if (!text.trim()) {
    return "";
  }

  let normalized = text;
  normalized = normalizePunctuation(normalized);
  normalized = normalizeSpacing(normalized);
  normalized = handleGameSymbols(normalized);
  normalized = normalizeKeywords(normalized);

  return normalized;
}

/**
 * Splits text into sentences based on sentence-ending punctuation
 */
export function splitIntoSentences(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  // Split on sentence endings, preserving punctuation
  const sentences = text
    .split(/([.!?]+)/)
    .reduce((acc: string[], part, index, array) => {
      if (index % 2 === 0) {
        const nextPart = array[index + 1];
        if (part.trim() && nextPart) {
          acc.push((part + nextPart).trim());
        } else if (part.trim()) {
          acc.push(part.trim());
        }
      }
      return acc;
    }, []);

  return sentences.filter((sentence) => sentence.length > 0);
}

/**
 * Identifies modal patterns like "Choose X:"
 */
export function identifyModalPatterns(text: string): {
  isModal: boolean;
  modalType?: string;
  options?: string[];
  remainingText?: string;
} {
  const modalPatterns = [
    /^choose one:\s*(.*)/i,
    /^choose (\w+):\s*(.*)/i,
    /^select one:\s*(.*)/i,
  ];

  for (const pattern of modalPatterns) {
    const match = text.match(pattern);
    if (match) {
      const modalType = match[0]
        ? match[0].split(":")[0]?.trim() || "Choose one"
        : "Choose one";
      const optionsText = match[1] || match[2] || "";

      // Split options by "or" separators
      const options = optionsText
        .split(/\s+or\s+/i)
        .map((option) => option.trim())
        .filter((option) => option.length > 0);

      return {
        isModal: true,
        modalType,
        options,
        remainingText: optionsText,
      };
    }
  }

  return { isModal: false };
}

/**
 * Identifies conditional phrases in text
 */
export function identifyConditionalPhrases(text: string): {
  hasConditional: boolean;
  conditionalType?: string;
  condition?: string;
  consequence?: string;
} {
  const conditionalPatterns = [
    { pattern: /^if\s+(.+?),?\s+then\s+(.+)/i, type: "if" },
    { pattern: /^when\s+(.+?),\s*(.+)/i, type: "when" },
    { pattern: /^whenever\s+(.+?),\s*(.+)/i, type: "whenever" },
    { pattern: /(.+?)\s+then\s+(.+)/i, type: "then" },
  ];

  for (const { pattern, type } of conditionalPatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        hasConditional: true,
        conditionalType: type,
        condition: match[1]?.trim(),
        consequence: match[2]?.trim(),
      };
    }
  }

  return { hasConditional: false };
}

/**
 * Identifies timing markers in text
 */
export function identifyTimingMarkers(text: string): {
  hasTimingMarker: boolean;
  timingType?: string;
  timing?: string;
  remainingText?: string;
} {
  const timingPatterns = [
    { pattern: /\bthis turn\b/i, type: "this-turn" },
    { pattern: /\bat the end of (?:your|the) turn\b/i, type: "end-of-turn" },
    {
      pattern: /\bat the beginning of (?:your|the) turn\b/i,
      type: "beginning-of-turn",
    },
    { pattern: /\buntil end of turn\b/i, type: "this-turn" },
    { pattern: /\buntil your next turn\b/i, type: "next-turn" },
    { pattern: /\bwhen this unit is deployed\b/i, type: "on-deploy" },
    { pattern: /\bwhen this unit attacks\b/i, type: "on-attack" },
    { pattern: /\bwhen this unit is destroyed\b/i, type: "on-destroy" },
  ];

  for (const { pattern, type } of timingPatterns) {
    const match = text.match(pattern);
    if (match) {
      const timing = match[0];
      const remainingText = text.replace(pattern, "").trim();

      return {
        hasTimingMarker: true,
        timingType: type,
        timing,
        remainingText,
      };
    }
  }

  return { hasTimingMarker: false };
}

/**
 * Analyzes text structure to identify patterns and clauses
 */
export function analyzeTextStructure(text: string): {
  sentences: string[];
  clauses: string[];
  modalInfo: ReturnType<typeof identifyModalPatterns>;
  conditionalInfo: ReturnType<typeof identifyConditionalPhrases>;
  timingInfo: ReturnType<typeof identifyTimingMarkers>;
  hasKeywords: boolean;
  isComplex: boolean;
} {
  const normalizedText = normalizeText(text);
  const sentences = splitIntoSentences(normalizedText);

  // Simple clause splitting - this can be enhanced later
  const clauses = sentences;

  const modalInfo = identifyModalPatterns(normalizedText);
  const conditionalInfo = identifyConditionalPhrases(normalizedText);
  const timingInfo = identifyTimingMarkers(normalizedText);
  const hasKeywords = hasKeywordEffects(normalizedText);

  const isComplex =
    modalInfo.isModal ||
    conditionalInfo.hasConditional ||
    timingInfo.hasTimingMarker ||
    hasKeywords ||
    clauses.length > 2;

  return {
    sentences,
    clauses,
    modalInfo,
    conditionalInfo,
    timingInfo,
    hasKeywords,
    isComplex,
  };
}

/**
 * Converts clauses to structured parsed clauses with effects
 */
function parseClauses(
  clauses: string[],
  config: GundamParserConfig = {},
): ParsedClause[] {
  const result: ParsedClause[] = [];

  for (const clause of clauses) {
    if (!clause.trim()) continue;

    const modalInfo = identifyModalPatterns(clause);
    const conditionalInfo = identifyConditionalPhrases(clause);
    const timingInfo = identifyTimingMarkers(clause);

    let type: ParsedClause["type"] = "effect";

    if (modalInfo.isModal) {
      type = "modal";
    } else if (conditionalInfo.hasConditional) {
      type = "condition";
    } else if (timingInfo.hasTimingMarker) {
      type = "timing";
    } else if (hasKeywordEffects(clause)) {
      type = "keyword";
    }

    // Extract effects from the clause
    const effects = extractEffectsFromText(clause);

    // Add target information to effects
    const enhancedEffects = addTargetsToEffects(effects);

    result.push({
      text: clause,
      type,
      effects: enhancedEffects,
      dependencies: [],
    });
  }

  return result;
}

/**
 * Adds target information to parsed effects
 */
function addTargetsToEffects(effects: ParsedEffect[]): ParsedEffect[] {
  return effects.map((effect) => {
    const targetText = effect.parameters.targetText;

    if (targetText) {
      const target = parseTargetFromText(targetText);
      if (target) {
        return {
          ...effect,
          target,
        };
      }
    }

    return effect;
  });
}

/**
 * Main function to parse Gundam card text
 */
export function parseGundamText(
  text: string,
  config: GundamParserConfig = {},
): GundamParseResult {
  const result: GundamParseResult = {
    abilities: [],
    warnings: [],
    errors: [],
    clauses: [],
  };

  // Validate input
  if (!text || text.trim().length === 0) {
    result.errors.push("Empty or invalid text provided");
    return result;
  }

  try {
    if (config.debug) {
      console.log(`[Gundam Parser] Parsing text: "${text}"`);
    }

    // Analyze text structure
    const textStructure = analyzeTextStructure(text);

    if (config.debug) {
      console.log("[Gundam Parser] Text structure:", textStructure);
    }

    // Parse clauses to get structured data
    const parsedClauses = parseClauses(textStructure.clauses, config);
    result.clauses = parsedClauses;

    if (config.debug) {
      console.log(`[Gundam Parser] Parsed ${parsedClauses.length} clauses`);
    }

    // Generate abilities from parsed clauses
    // For now, we'll just return placeholder abilities to ensure the interface works
    // This would be expanded to actually build the abilities based on the engine's requirements
    result.abilities = generatePlaceholderAbilities(parsedClauses);

    if (config.debug) {
      console.log(
        `[Gundam Parser] Generated ${result.abilities.length} abilities`,
      );
    }

    // Validate the generated abilities (to be implemented)
    // const validationResult = validateAbilities(result.abilities);
    // result.warnings.push(...validationResult.warnings);
    // result.errors.push(...validationResult.errors);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(`Parsing failed: ${errorMessage}`);

    if (config.debug) {
      console.error("[Gundam Parser] Error during parsing:", error);
    }
  }

  return result;
}

/**
 * Generate placeholder abilities from parsed clauses
 * This is a temporary function that will be replaced with actual ability generation
 */
function generatePlaceholderAbilities(clauses: ParsedClause[]): any[] {
  return clauses.map((clause, index) => ({
    type: "resolution",
    effects: clause.effects.map((effect) => ({
      ...effect,
      // Convert ParsedEffect to actual Effect objects
      // This is where we'd integrate with the Gundam card effect system
    })),
    text: clause.text,
    id: `ability_${index}`,
  }));
}

/**
 * Main entry point to generate abilities from card text
 */
export function generateAbilitiesFromText(
  text: string,
  config: GundamParserConfig = {},
): any[] {
  const result = parseGundamText(text, config);
  return result.abilities;
}
