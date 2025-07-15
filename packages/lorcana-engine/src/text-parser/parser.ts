// Main parser function for generating action abilities from text

import type { ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { buildAbilitiesWithTriggeredSupport } from "./ability-builder";
import { extractEffectsWithTimingAndTargets } from "./patterns";
import {
  CacheManager,
  optimizedExtractEffectsFromText,
  PerformanceMonitor,
  StringProcessor,
} from "./performance-optimizations";
import { parseTargetFromText } from "./target-mapper";
import type {
  NormalizationConfig,
  ParsedClause,
  ParseResult,
  ParserConfig,
} from "./types";

// Text preprocessing functionality

/**
 * Game symbols that appear in Lorcana card text
 */
export const GAME_SYMBOLS = {
  STRENGTH: "{S}",
  LORE: "{L}",
  WILLPOWER: "{W}",
  INKWELL: "{I}",
  COST: "{C}",
} as const;

/**
 * Normalizes text spacing by removing extra whitespace and standardizing punctuation spacing
 */
export function normalizeSpacing(text: string): string {
  return StringProcessor.normalizeSpacing(text);
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
 * Normalizes case while preserving proper nouns and game-specific terms
 */
export function normalizeCase(
  text: string,
  preserveProperNouns = true,
): string {
  if (!preserveProperNouns) {
    return text.toLowerCase();
  }

  const preservedTerms = [
    "Lorcana",
    "Disney",
    "Inkwell",
    "Lore",
    "Strength",
    "Willpower",
    "Choose",
    "Draw",
    "Deal",
    "Banish",
    "Return",
    "Move",
    "Gain",
  ];

  let normalized = text.toLowerCase();

  for (const term of preservedTerms) {
    const regex = new RegExp(`\\b${term.toLowerCase()}\\b`, "gi");
    normalized = normalized.replace(regex, term);
  }

  normalized = normalized.replace(
    /(^|[.!?]\s+)([a-z])/g,
    (_, prefix, letter) => {
      return prefix + letter.toUpperCase();
    },
  );

  return normalized;
}

/**
 * Handles special game symbols by normalizing their format and ensuring consistency
 */
export function handleGameSymbols(text: string): string {
  let processed = text;

  const symbolMappings = [
    {
      patterns: [/\{strength\}/gi, /\{str\}/gi, /\(s\)/gi],
      replacement: GAME_SYMBOLS.STRENGTH,
    },
    { patterns: [/\{lore\}/gi, /\(l\)/gi], replacement: GAME_SYMBOLS.LORE },
    {
      patterns: [/\{willpower\}/gi, /\{will\}/gi, /\(w\)/gi],
      replacement: GAME_SYMBOLS.WILLPOWER,
    },
    {
      patterns: [/\{inkwell\}/gi, /\{ink\}/gi, /\(i\)/gi],
      replacement: GAME_SYMBOLS.INKWELL,
    },
    { patterns: [/\{cost\}/gi, /\(c\)/gi], replacement: GAME_SYMBOLS.COST },
  ];

  for (const mapping of symbolMappings) {
    for (const pattern of mapping.patterns) {
      processed = processed.replace(pattern, mapping.replacement);
    }
  }

  processed = processed.replace(/(\w)(\{[SLWIC]\})/g, "$1 $2");
  processed = processed.replace(/(\{[SLWIC]\})(\w)/g, "$1 $2");

  return processed;
}

/**
 * Comprehensive text normalization function that applies all normalization steps
 */
export function normalizeText(
  text: string,
  config: NormalizationConfig = {},
): string {
  const {
    preserveSpacing = false,
    normalizeCase: shouldNormalizeCase = true,
    handleGameSymbols: shouldHandleGameSymbols = true,
  } = config;

  let normalized = text;

  if (!normalized.trim()) {
    return "";
  }

  normalized = normalizePunctuation(normalized);

  if (!preserveSpacing) {
    normalized = normalizeSpacing(normalized);
  }

  if (shouldNormalizeCase) {
    normalized = normalizeCase(normalized);
  }

  if (shouldHandleGameSymbols) {
    normalized = handleGameSymbols(normalized);
  }

  return normalized;
}

/**
 * Validates that text contains expected game symbols and patterns
 */
export function validateTextFormat(text: string): {
  isValid: boolean;
  issues: string[];
  symbols: string[];
} {
  const issues: string[] = [];
  const symbols: string[] = [];

  const allSymbols = text.match(/\{[^}]*\}/g) || [];
  const validSymbols = text.match(/\{[SLWIC]\}/g) || [];
  const malformedSymbols = allSymbols.filter(
    (symbol) => !validSymbols.some((validSymbol) => validSymbol === symbol),
  );

  if (malformedSymbols.length > 0) {
    issues.push(`Malformed symbols found: ${malformedSymbols.join(", ")}`);
  }

  if (validSymbols) {
    symbols.push(...validSymbols);
  }

  if (text.includes("  ")) {
    issues.push("Multiple consecutive spaces found");
  }

  if (text.match(/[.!?]{2,}/)) {
    issues.push("Duplicate punctuation found");
  }

  return {
    isValid: issues.length === 0,
    issues,
    symbols,
  };
}

// Text splitting and clause identification functionality

/**
 * Splits text into sentences based on sentence-ending punctuation
 */
export function splitIntoSentences(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  // Split on sentence endings, but preserve the punctuation
  const sentences = text
    .split(/([.!?]+)/)
    .reduce((acc: string[], part, index, array) => {
      if (index % 2 === 0) {
        // This is text content
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
 * Splits text into clauses based on conjunctions and punctuation
 */
export function splitIntoClauses(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  // Split on common clause separators while preserving the text structure
  const clauseSeparators = /([,;]|\bthen\b|\band\b|\bor\b)/i;

  const parts = text.split(clauseSeparators);
  const clauses: string[] = [];

  for (let i = 0; i < parts.length; i += 2) {
    const clause = parts[i]?.trim();
    if (clause) {
      clauses.push(clause);
    }
  }

  return clauses.filter((clause) => clause.length > 0);
}

/**
 * Identifies modal text patterns like "Choose one:" with multiple options
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
    /^pick one:\s*(.*)/i,
  ];

  for (const pattern of modalPatterns) {
    const match = text.match(pattern);
    if (match) {
      const modalType = match[0]
        ? match[0].split(":")[0]?.trim() || "Choose one"
        : "Choose one";
      const optionsText = match[1] || match[2] || "";

      // Split options by "or" or similar separators
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
    { pattern: /\bnext turn\b/i, type: "next-turn" },
    { pattern: /\buntil end of turn\b/i, type: "this-turn" },
    { pattern: /\bpermanently\b/i, type: "permanent" },
    { pattern: /\bimmediately\b/i, type: "immediate" },
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
 * Comprehensive text analysis that combines all clause identification techniques
 */
export function analyzeTextStructure(text: string): {
  sentences: string[];
  clauses: string[];
  modalInfo: ReturnType<typeof identifyModalPatterns>;
  conditionalInfo: ReturnType<typeof identifyConditionalPhrases>;
  timingInfo: ReturnType<typeof identifyTimingMarkers>;
  isComplex: boolean;
} {
  const normalizedText = normalizeText(text);

  const sentences = splitIntoSentences(normalizedText);
  const clauses = sentences.flatMap((sentence) => splitIntoClauses(sentence));

  const modalInfo = identifyModalPatterns(normalizedText);
  const conditionalInfo = identifyConditionalPhrases(normalizedText);
  const timingInfo = identifyTimingMarkers(normalizedText);

  const isComplex =
    modalInfo.isModal ||
    conditionalInfo.hasConditional ||
    timingInfo.hasTimingMarker ||
    clauses.length > 2;

  return {
    sentences,
    clauses,
    modalInfo,
    conditionalInfo,
    timingInfo,
    isComplex,
  };
}

/**
 * Generates action card abilities from text descriptions
 *
 * This is the main entry point for the text parser. It takes a card text string
 * and returns an array of ResolutionAbility objects that match the existing
 * Lorcana engine structure.
 *
 * @param text - The card text to parse
 * @param config - Optional configuration for the parser
 * @returns Array of ResolutionAbility objects
 */
export function generateActionAbilitiesFromText(
  text: string,
  config?: ParserConfig,
): ResolutionAbility[] {
  const result = parseActionText(text, config);
  return result.abilities;
}

/**
 * Parses action card text and returns detailed parsing results
 *
 * This function provides more detailed information about the parsing process,
 * including warnings, errors, and intermediate parsing results.
 *
 * @param text - The card text to parse
 * @param config - Optional configuration for the parser
 * @returns Detailed parse result with abilities, warnings, and errors
 */
export function parseActionText(
  text: string,
  config: ParserConfig = {},
): ParseResult {
  // Start performance monitoring
  const endTimer = PerformanceMonitor.startTimer("parseActionText");

  const result: ParseResult = {
    abilities: [],
    warnings: [],
    errors: [],
    clauses: [],
  };

  // Validate input
  if (!text || text.trim().length === 0) {
    result.errors.push("Empty or invalid text provided");
    endTimer(); // End timing even on early return
    return result;
  }

  try {
    // Log debug information if enabled
    if (config.debug) {
      console.log(`[Text Parser] Parsing text: "${text}"`);
    }

    // Step 1: Normalize and preprocess the text
    const normalizedText = normalizeText(text);
    if (config.debug) {
      console.log(`[Text Parser] Normalized text: "${normalizedText}"`);
    }

    // Step 2: Analyze text structure to identify clauses and patterns
    const textStructure = analyzeTextStructure(normalizedText);
    if (config.debug) {
      console.log("[Text Parser] Text structure:", textStructure);
    }

    // Step 3: Convert text structure into parsed clauses
    const parsedClauses = convertStructureToClauses(textStructure, config);
    result.clauses = parsedClauses;

    if (config.debug) {
      console.log(`[Text Parser] Parsed ${parsedClauses.length} clauses`);
    }

    // Step 4: Build abilities from parsed clauses
    const abilityResult = buildAbilitiesFromParsedClauses(
      parsedClauses,
      config,
    );
    result.abilities = abilityResult.abilities;
    result.warnings.push(...abilityResult.warnings);
    result.errors.push(...abilityResult.errors);

    if (config.debug) {
      console.log(
        `[Text Parser] Generated ${result.abilities.length} abilities`,
      );
    }

    // Step 5: Validate generated abilities with enhanced validation
    const basicValidationResult = validateGeneratedAbilities(result.abilities);
    result.warnings.push(...basicValidationResult.warnings);
    result.errors.push(...basicValidationResult.errors);

    // Step 6: Run comprehensive validation if enabled
    if (config.debug || config.strictMode) {
      const comprehensiveValidation = validateParseResult(result);
      result.warnings.push(...comprehensiveValidation.enhancedWarnings);
      result.errors.push(...comprehensiveValidation.enhancedErrors);

      if (config.debug) {
        console.log(
          `[Text Parser] Comprehensive validation - Valid: ${comprehensiveValidation.isValid}`,
        );
        if (comprehensiveValidation.enhancedWarnings.length > 0) {
          console.log(
            "[Text Parser] Validation warnings:",
            comprehensiveValidation.enhancedWarnings,
          );
        }
        if (comprehensiveValidation.enhancedErrors.length > 0) {
          console.log(
            "[Text Parser] Validation errors:",
            comprehensiveValidation.enhancedErrors,
          );
        }
      }
    }

    // Add warnings for unknown patterns if in strict mode
    if (
      config.strictMode &&
      result.abilities.length === 0 &&
      result.errors.length === 0
    ) {
      result.warnings.push(
        "No abilities could be generated from the provided text",
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(`Parsing failed: ${errorMessage}`);

    if (config.debug) {
      console.error("[Text Parser] Error during parsing:", error);
    }

    // In non-strict mode, continue with partial results
    if (config.strictMode) {
      result.abilities = [];
    }
  } finally {
    // Always end the timer
    const duration = endTimer();

    if (config.debug) {
      console.log(
        `[Text Parser] Parsing completed in ${duration.toFixed(2)}ms`,
      );
    }
  }

  return result;
}

/**
 * Converts analyzed text structure into parsed clauses with effects
 */
function convertStructureToClauses(
  textStructure: ReturnType<typeof analyzeTextStructure>,
  config: ParserConfig,
): ParsedClause[] {
  const clauses: ParsedClause[] = [];

  // Handle modal patterns first (they take precedence)
  if (textStructure.modalInfo.isModal) {
    // Validate that modal has options
    if (
      !textStructure.modalInfo.options ||
      textStructure.modalInfo.options.length === 0
    ) {
      // Add error for malformed modal
      if (config.debug) {
        console.log(
          `[Text Parser] Modal pattern found but no options parsed from: "${textStructure.modalInfo.remainingText}"`,
        );
      }
    }

    const modalClause: ParsedClause = {
      text: textStructure.modalInfo.modalType || "Choose one",
      type: "modal",
      effects:
        textStructure.modalInfo.options &&
        textStructure.modalInfo.options.length > 0
          ? [
              {
                type: "modal",
                parameters: {
                  modalType: textStructure.modalInfo.modalType,
                  optionsText: textStructure.modalInfo.remainingText,
                  options: textStructure.modalInfo.options,
                },
              },
            ]
          : [],
      dependencies: [],
    };

    // Add modal information to clause parameters
    (modalClause as any).parameters = {
      modalType: textStructure.modalInfo.modalType,
      optionsText: textStructure.modalInfo.remainingText,
      options: textStructure.modalInfo.options,
    };

    clauses.push(modalClause);
    return clauses;
  }

  // Handle conditional patterns
  if (textStructure.conditionalInfo.hasConditional) {
    const { condition, consequence, conditionalType } =
      textStructure.conditionalInfo;

    if (condition && consequence) {
      // Create condition clause
      const conditionClause: ParsedClause = {
        text: condition,
        type: "condition",
        effects: extractEffectsWithTimingAndTargets(condition),
        dependencies: [],
      };

      // Create consequence clause with dependency
      const consequenceClause: ParsedClause = {
        text: consequence,
        type: "effect",
        effects: extractEffectsWithTimingAndTargets(consequence),
        dependencies: [condition],
      };

      clauses.push(conditionClause, consequenceClause);
    } else if (consequence) {
      // Single conditional clause
      const clause: ParsedClause = {
        text: consequence,
        type: conditionalType === "then" ? "effect" : "condition",
        effects: extractEffectsWithTimingAndTargets(consequence),
        dependencies: [],
      };
      clauses.push(clause);
    }
  }
  // Handle timing patterns
  else if (textStructure.timingInfo.hasTimingMarker) {
    const { remainingText, timingType } = textStructure.timingInfo;

    if (remainingText) {
      const clause: ParsedClause = {
        text: remainingText,
        type: "timing",
        effects: extractEffectsWithTimingAndTargets(remainingText),
        dependencies: [],
      };
      clauses.push(clause);
    }
  }
  // Handle regular clauses
  else {
    for (const clauseText of textStructure.clauses) {
      if (clauseText.trim()) {
        const effects = extractEffectsWithTimingAndTargets(clauseText);

        if (effects.length > 0) {
          const clause: ParsedClause = {
            text: clauseText,
            type: "effect",
            effects,
            dependencies: [],
          };
          clauses.push(clause);
        } else if (config.debug) {
          console.log(
            `[Text Parser] No effects found in clause: "${clauseText}"`,
          );
        }
      }
    }
  }

  // If no clauses were created, try to parse the entire text as one clause
  if (clauses.length === 0) {
    const effects = extractEffectsWithTimingAndTargets(
      textStructure.sentences.join(" "),
    );

    if (effects.length > 0) {
      const clause: ParsedClause = {
        text: textStructure.sentences.join(" "),
        type: "effect",
        effects,
        dependencies: [],
      };
      clauses.push(clause);
    }
  }

  return clauses;
}

/**
 * Builds abilities from parsed clauses using the ability builder system
 */
function buildAbilitiesFromParsedClauses(
  clauses: ParsedClause[],
  config: ParserConfig,
): {
  abilities: ResolutionAbility[];
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (clauses.length === 0) {
    warnings.push("No clauses found to build abilities from");
    return { abilities: [], warnings, errors };
  }

  try {
    // Use the ability builder with triggered support to handle all clause types
    const result = buildAbilitiesWithTriggeredSupport(clauses, {
      debug: config.debug,
      defaultResponder: "self",
      resolveEffectsIndividually: false,
    });

    // Combine all ability types into a single array
    // Cast to ResolutionAbility[] as required by the return type
    const allAbilities = [
      ...result.abilities,
      ...result.triggeredAbilities,
      ...result.floatingTriggeredAbilities,
    ] as ResolutionAbility[];

    errors.push(...result.errors);

    if (config.debug) {
      console.log(
        `[Ability Builder] Built ${allAbilities.length} total abilities`,
      );
      console.log(
        `[Ability Builder] Resolution abilities: ${result.abilities.length}`,
      );
      console.log(
        `[Ability Builder] Triggered abilities: ${result.triggeredAbilities.length}`,
      );
      console.log(
        `[Ability Builder] Floating triggered abilities: ${result.floatingTriggeredAbilities.length}`,
      );
    }

    return {
      abilities: allAbilities,
      warnings,
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(`Failed to build abilities: ${errorMessage}`);

    if (config.debug) {
      console.error("[Ability Builder] Error:", error);
    }

    return { abilities: [], warnings, errors };
  }
}

/**
 * Validates generated abilities for type safety and correctness
 */
function validateGeneratedAbilities(abilities: ResolutionAbility[]): {
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < abilities.length; i++) {
    const ability = abilities[i];

    // Validate basic structure
    if (!ability || typeof ability !== "object") {
      errors.push(`Ability ${i + 1} is not a valid object`);
      continue;
    }

    if (!ability.type) {
      errors.push(`Ability ${i + 1} is missing required 'type' property`);
    }

    if (ability.type === "resolution") {
      // Validate resolution ability structure
      if (!(ability.effects && Array.isArray(ability.effects))) {
        errors.push(
          `Resolution ability ${i + 1} is missing or has invalid 'effects' array`,
        );
      } else if (ability.effects.length === 0) {
        warnings.push(`Resolution ability ${i + 1} has no effects`);
      }

      // Validate each effect
      for (let j = 0; j < ability.effects.length; j++) {
        const effect = ability.effects[j];

        if (!effect || typeof effect !== "object") {
          errors.push(
            `Effect ${j + 1} in ability ${i + 1} is not a valid object`,
          );
          continue;
        }

        if (!effect.type) {
          errors.push(
            `Effect ${j + 1} in ability ${i + 1} is missing required 'type' property`,
          );
        }

        // Validate effect-specific requirements
        if (effect.type === "damage" || effect.type === "banish") {
          if (!effect.target) {
            errors.push(
              `${effect.type} effect ${j + 1} in ability ${i + 1} is missing required 'target' property`,
            );
          }
        }

        if (effect.type === "damage" && !effect.amount) {
          errors.push(
            `Damage effect ${j + 1} in ability ${i + 1} is missing required 'amount' property`,
          );
        }

        if (
          effect.type === "attribute" &&
          !(effect.amount && effect.attribute)
        ) {
          errors.push(
            `Attribute effect ${j + 1} in ability ${i + 1} is missing required 'amount' or 'attribute' property`,
          );
        }
      }
    }

    // Validate triggered abilities
    if (ability && (ability as any).type === "static-triggered") {
      const triggeredAbility = ability as any;
      if (!triggeredAbility.trigger) {
        errors.push(
          `Triggered ability ${i + 1} is missing required 'trigger' property`,
        );
      }
      if (!triggeredAbility.layer) {
        errors.push(
          `Triggered ability ${i + 1} is missing required 'layer' property`,
        );
      }
    }

    // Validate floating triggered abilities
    if (ability && (ability as any).type === "floating-triggered") {
      const floatingAbility = ability as any;
      if (!floatingAbility.trigger) {
        errors.push(
          `Floating triggered ability ${i + 1} is missing required 'trigger' property`,
        );
      }
      if (!floatingAbility.layer) {
        errors.push(
          `Floating triggered ability ${i + 1} is missing required 'layer' property`,
        );
      }
      if (!floatingAbility.duration) {
        warnings.push(
          `Floating triggered ability ${i + 1} is missing 'duration' property`,
        );
      }
    }
  }

  return { warnings, errors };
}

/**
 * Validates that a parsed effect conforms to the expected interface
 */
export function validateParsedEffect(effect: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!effect || typeof effect !== "object") {
    errors.push("Effect is not a valid object");
    return { isValid: false, errors };
  }

  if (!effect.type || typeof effect.type !== "string") {
    errors.push(
      'Effect is missing required "type" property or type is not a string',
    );
  }

  if (!effect.parameters || typeof effect.parameters !== "object") {
    errors.push(
      'Effect is missing required "parameters" property or parameters is not an object',
    );
  }

  // Validate type-specific requirements
  switch (effect.type) {
    case "draw":
      if (
        effect.amount !== undefined &&
        typeof effect.amount !== "number" &&
        typeof effect.amount !== "object"
      ) {
        errors.push(
          "Draw effect amount must be a number or DynamicAmount object",
        );
      }
      break;

    case "damage":
      if (!effect.amount) {
        errors.push('Damage effect is missing required "amount" property');
      } else if (
        typeof effect.amount !== "number" &&
        typeof effect.amount !== "object"
      ) {
        errors.push(
          "Damage effect amount must be a number or DynamicAmount object",
        );
      }
      if (!effect.parameters?.targetText) {
        errors.push("Damage effect is missing target text in parameters");
      }
      break;

    case "banish":
      if (!effect.parameters?.targetText) {
        errors.push("Banish effect is missing target text in parameters");
      }
      break;

    case "attribute":
      if (!effect.amount) {
        errors.push('Attribute effect is missing required "amount" property');
      } else if (
        typeof effect.amount !== "number" &&
        typeof effect.amount !== "object"
      ) {
        errors.push(
          "Attribute effect amount must be a number or DynamicAmount object",
        );
      }
      if (effect.parameters?.attribute) {
        const validAttributes = [
          "strength",
          "willpower",
          "lore",
          "cost",
          "moveCost",
          "singCost",
        ];
        if (!validAttributes.includes(effect.parameters.attribute)) {
          errors.push(
            `Attribute effect has invalid attribute type: ${effect.parameters.attribute}`,
          );
        }
      } else {
        errors.push("Attribute effect is missing attribute type in parameters");
      }
      break;

    default:
      // Allow unknown effect types but warn about them
      break;
  }

  // Validate duration if present
  if (effect.duration !== undefined) {
    const validDurations = [
      "turn",
      "next_turn",
      "static",
      "next",
      "challenge",
      "permanent",
    ];
    if (!validDurations.includes(effect.duration)) {
      errors.push(`Effect has invalid duration: ${effect.duration}`);
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates that a parsed clause conforms to the expected interface
 */
export function validateParsedClause(clause: ParsedClause): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!clause || typeof clause !== "object") {
    errors.push("Clause is not a valid object");
    return { isValid: false, errors };
  }

  if (!clause.text || typeof clause.text !== "string") {
    errors.push(
      'Clause is missing required "text" property or text is not a string',
    );
  }

  if (!clause.type || typeof clause.type !== "string") {
    errors.push(
      'Clause is missing required "type" property or type is not a string',
    );
  } else {
    const validTypes = ["effect", "condition", "timing", "modal"];
    if (!validTypes.includes(clause.type)) {
      errors.push(`Clause has invalid type: ${clause.type}`);
    }
  }

  if (Array.isArray(clause.effects)) {
    // Validate each effect in the clause
    for (let i = 0; i < clause.effects.length; i++) {
      const effectValidation = validateParsedEffect(clause.effects[i]);
      if (!effectValidation.isValid) {
        errors.push(
          `Effect ${i + 1} in clause is invalid: ${effectValidation.errors.join(", ")}`,
        );
      }
    }
  } else {
    errors.push(
      'Clause is missing required "effects" array or effects is not an array',
    );
  }

  if (
    clause.dependencies !== undefined &&
    !Array.isArray(clause.dependencies)
  ) {
    errors.push("Clause dependencies must be an array if present");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates that a ResolutionAbility conforms to the expected TypeScript interface
 */
export function validateResolutionAbility(ability: ResolutionAbility): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!ability || typeof ability !== "object") {
    errors.push("Ability is not a valid object");
    return { isValid: false, errors, warnings };
  }

  if (ability.type !== "resolution") {
    errors.push(`Expected resolution ability, got type: ${ability.type}`);
  }

  if (ability.effects && Array.isArray(ability.effects)) {
    if (ability.effects.length === 0) {
      warnings.push("Resolution ability has no effects");
    }

    // Validate each effect
    for (let i = 0; i < ability.effects.length; i++) {
      const effect = ability.effects[i];

      if (!effect || typeof effect !== "object") {
        errors.push(`Effect ${i + 1} is not a valid object`);
        continue;
      }

      if (!effect.type) {
        errors.push(`Effect ${i + 1} is missing required "type" property`);
      }

      // Validate effect-specific properties
      switch (effect.type) {
        case "draw":
          if (!effect.target) {
            errors.push(
              `Draw effect ${i + 1} is missing required "target" property`,
            );
          }
          if (effect.amount === undefined) {
            warnings.push(
              `Draw effect ${i + 1} is missing "amount" property, defaulting to 1`,
            );
          }
          break;

        case "damage":
          if (!effect.target) {
            errors.push(
              `Damage effect ${i + 1} is missing required "target" property`,
            );
          }
          if (!effect.amount) {
            errors.push(
              `Damage effect ${i + 1} is missing required "amount" property`,
            );
          }
          break;

        case "banish":
          if (!effect.target) {
            errors.push(
              `Banish effect ${i + 1} is missing required "target" property`,
            );
          }
          break;

        case "attribute":
          if (!effect.target) {
            errors.push(
              `Attribute effect ${i + 1} is missing required "target" property`,
            );
          }
          if (!effect.amount) {
            errors.push(
              `Attribute effect ${i + 1} is missing required "amount" property`,
            );
          }
          if (!(effect as any).attribute) {
            errors.push(
              `Attribute effect ${i + 1} is missing required "attribute" property`,
            );
          }
          break;

        case "modal": {
          const modalEffect = effect as any;
          if (!(modalEffect.modes && Array.isArray(modalEffect.modes))) {
            errors.push(
              `Modal effect ${i + 1} is missing required "modes" array`,
            );
          } else if (modalEffect.modes.length === 0) {
            errors.push(`Modal effect ${i + 1} has no modes`);
          }
          break;
        }

        default:
          warnings.push(`Effect ${i + 1} has unknown type: ${effect.type}`);
      }
    }
  } else {
    errors.push('Resolution ability is missing required "effects" array');
  }

  // Validate optional properties
  if (ability.text !== undefined && typeof ability.text !== "string") {
    errors.push('Ability "text" property must be a string if present');
  }

  if (ability.optional !== undefined && typeof ability.optional !== "boolean") {
    errors.push('Ability "optional" property must be a boolean if present');
  }

  if (ability.responder !== undefined) {
    const validResponders = ["self", "opponent"];
    if (!validResponders.includes(ability.responder)) {
      errors.push(`Ability has invalid responder: ${ability.responder}`);
    }
  }

  if (
    ability.resolveEffectsIndividually !== undefined &&
    typeof ability.resolveEffectsIndividually !== "boolean"
  ) {
    errors.push(
      'Ability "resolveEffectsIndividually" property must be a boolean if present',
    );
  }

  if (
    ability.dependentEffects !== undefined &&
    typeof ability.dependentEffects !== "boolean"
  ) {
    errors.push(
      'Ability "dependentEffects" property must be a boolean if present',
    );
  }

  if (
    ability.detrimental !== undefined &&
    typeof ability.detrimental !== "boolean"
  ) {
    errors.push('Ability "detrimental" property must be a boolean if present');
  }

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Validates that generated abilities match existing effect types from the engine
 */
export function validateAgainstEngineTypes(abilities: ResolutionAbility[]): {
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Known effect types from the engine
  const knownEffectTypes = [
    "draw",
    "damage",
    "banish",
    "attribute",
    "modal",
    "move",
    "heal",
    "discard",
    "search",
    "shuffle",
    "reveal",
    "look",
    "choose",
  ];

  // Known attribute types
  const knownAttributes = [
    "strength",
    "willpower",
    "lore",
    "cost",
    "moveCost",
    "singCost",
  ];

  for (let i = 0; i < abilities.length; i++) {
    const ability = abilities[i];
    if (!ability) continue;

    if (ability?.type === "resolution" && ability?.effects) {
      for (let j = 0; j < ability.effects.length; j++) {
        const effect = ability.effects[j];

        if (!effect) continue;

        // Check if effect type is known
        if (effect.type && !knownEffectTypes.includes(effect.type)) {
          warnings.push(
            `Effect ${j + 1} in ability ${i + 1} uses unknown type: ${effect.type}`,
          );
        }

        // Check attribute effects specifically
        if (effect.type === "attribute") {
          const attributeEffect = effect as any;
          if (
            attributeEffect.attribute &&
            !knownAttributes.includes(attributeEffect.attribute)
          ) {
            warnings.push(
              `Attribute effect ${j + 1} in ability ${i + 1} uses unknown attribute: ${attributeEffect.attribute}`,
            );
          }
        }

        // Check for required target property
        if (
          effect.type &&
          ["damage", "banish", "attribute", "move", "heal"].includes(
            effect.type,
          )
        ) {
          if (!effect.target) {
            errors.push(
              `${effect.type} effect ${j + 1} in ability ${i + 1} is missing required target`,
            );
          }
        }

        // Check for required amount property
        if (
          effect.type &&
          ["damage", "attribute", "heal"].includes(effect.type)
        ) {
          if (!(effect as any).amount) {
            errors.push(
              `${effect.type} effect ${j + 1} in ability ${i + 1} is missing required amount`,
            );
          }
        }
      }
    }
  }

  return { warnings, errors };
}

/**
 * Comprehensive validation function that runs all validation checks
 */
export function validateParseResult(result: ParseResult): {
  isValid: boolean;
  enhancedWarnings: string[];
  enhancedErrors: string[];
} {
  const enhancedWarnings: string[] = [...result.warnings];
  const enhancedErrors: string[] = [...result.errors];

  // Validate parsed clauses
  for (let i = 0; i < result.clauses.length; i++) {
    const clause = result.clauses[i];
    if (!clause) continue;
    const clauseValidation = validateParsedClause(clause);
    if (!clauseValidation.isValid) {
      enhancedErrors.push(
        `Clause ${i + 1} validation failed: ${clauseValidation.errors.join(", ")}`,
      );
    }
  }

  // Validate generated abilities
  for (let i = 0; i < result.abilities.length; i++) {
    const ability = result.abilities[i];

    if (ability?.type === "resolution") {
      const abilityValidation = validateResolutionAbility(
        ability as ResolutionAbility,
      );
      enhancedWarnings.push(
        ...abilityValidation.warnings.map((w) => `Ability ${i + 1}: ${w}`),
      );
      enhancedErrors.push(
        ...abilityValidation.errors.map((e) => `Ability ${i + 1}: ${e}`),
      );
    }
  }

  // Validate against engine types
  const engineValidation = validateAgainstEngineTypes(result.abilities);
  enhancedWarnings.push(...engineValidation.warnings);
  enhancedErrors.push(...engineValidation.errors);

  return {
    isValid: enhancedErrors.length === 0,
    enhancedWarnings,
    enhancedErrors,
  };
}

/**
 * Type guard to check if an object is a valid ResolutionAbility
 */
export function isValidResolutionAbility(obj: any): obj is ResolutionAbility {
  if (!obj || typeof obj !== "object") return false;
  if (obj.type !== "resolution") return false;
  if (!(obj.effects && Array.isArray(obj.effects))) return false;

  // Check that all effects have required properties
  return obj.effects.every(
    (effect: any) =>
      effect && typeof effect === "object" && typeof effect.type === "string",
  );
}

/**
 * Type guard to check if an object is a valid ParsedEffect
 */
export function isValidParsedEffect(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.type !== "string") return false;
  if (!obj.parameters || typeof obj.parameters !== "object") return false;
  return true;
}

/**
 * Type guard to check if an object is a valid ParsedClause
 */
export function isValidParsedClause(obj: any): obj is ParsedClause {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.text !== "string") return false;
  if (typeof obj.type !== "string") return false;
  if (!Array.isArray(obj.effects)) return false;

  // Check that all effects are valid
  return obj.effects.every((effect: any) => isValidParsedEffect(effect));
}
