/**
 * Parser API for v2.
 * Provides compatibility with the old parser API and adds multi-parse support.
 */

import { parserV2 } from "./index";
import {
  MANUAL_ENTRIES_BY_NAME,
  getManualEntries,
  tooComplexText,
} from "./manual-overrides";
import { normalizeText } from "./preprocessor";
import type { AbilityWithText, ParseResult } from "./types";

interface ParseOptions {
  cardName?: string;
  strict?: boolean;
  generateAbilityUids?: boolean;
  generateEffectUids?: boolean;
  /** Card ID prefix for generating ability IDs (e.g., "17t" for "17t-1", "17t-2") */
  cardId?: string;
}

/**
 * Generate an ability ID from card ID and index
 * @param cardId - Card ID prefix (e.g., "17t")
 * @param index - 1-based ability index
 * @returns Ability ID (e.g., "17t-1")
 */
function generateAbilityId(cardId: string, index: number): string {
  return `${cardId}-${index}`;
}

/**
 * Add ID to ability if generation is enabled
 * @param ability - Ability to add ID to
 * @param options - Parse options
 * @param index - 1-based ability index (for multi-ability parsing)
 * @param override - If true, override existing ID (default: false)
 * @returns Ability with ID if enabled, otherwise original ability
 */
function addAbilityIdIfEnabled(
  ability: AbilityWithText,
  options: ParseOptions | undefined,
  index = 1,
  override = false,
): AbilityWithText {
  if (
    options?.generateAbilityUids &&
    options?.cardId &&
    (override || !ability.id)
  ) {
    return {
      ...ability,
      id: generateAbilityId(options.cardId, index),
    };
  }
  return ability;
}

/**
 * Result for parsing multi-ability texts
 * Used when a single text contains multiple abilities
 */
export interface MultiParseResult {
  /** Whether parsing succeeded for all abilities */
  success: boolean;

  /** Parsed abilities (multiple for complex texts) */
  abilities: AbilityWithText[];

  /** Non-fatal warnings encountered during parsing */
  warnings?: string[];

  /** Fatal error message (if success is false) */
  error?: string;
}

/**
 * Parse ability text - old API compatibility.
 */
export function parseAbilityText(
  text: string,
  options?: ParseOptions,
): ParseResult {
  // Check for manual override by card name
  if (options?.cardName && MANUAL_ENTRIES_BY_NAME[options.cardName]) {
    const entry = MANUAL_ENTRIES_BY_NAME[options.cardName];
    // Entry can be AbilityWithText or AbilityWithText[]
    const singleEntry = Array.isArray(entry) ? entry[0] : entry;
    // Ensure we return the entry as AbilityWithText structure
    // Preserve existing id from manual entry if present
    const entryId = (singleEntry as { id?: string }).id;
    const entryName = (singleEntry as { name?: string }).name;
    const entryText = (singleEntry as { text?: string }).text || text;
    const ability: AbilityWithText = {
      ability: (singleEntry as { ability: unknown }).ability,
      ...(entryId && { id: entryId }),
      ...(entryName && entryName.trim() && { name: entryName }),
      ...(entryText && entryText.trim() && { text: entryText }),
    } as AbilityWithText;
    return {
      ability: addAbilityIdIfEnabled(ability, options, 1),
      success: true,
      warnings: [],
    };
  }

  // Normalize and check for manual override by text pattern
  const normalizedText = normalizeText(text);
  if (tooComplexText(normalizedText)) {
    const manualEntries = getManualEntries(normalizedText, options?.cardName);
    if (manualEntries && manualEntries.length > 0) {
      return {
        ability: addAbilityIdIfEnabled(manualEntries[0], options, 1),
        success: true,
        warnings: [],
      };
    }
  }

  const ability = parserV2.parseAbility(text);
  if (ability) {
    // Extract name from ability if present (for named abilities)
    const {name} = (ability as { name?: string });
    const abilityWithText: AbilityWithText = {
      ability: ability as AbilityWithText["ability"],
      // TODO: Type assertion needed because @tcg/lorcana-engine and @tcg/lorcana-types
      // Have incompatible Ability, Trigger, and Target types. This is a broader
      // Architectural issue that needs to be resolved by re-exporting all ability
      // Types from lorcana-types in the engine, similar to what was done for Condition.
      // See: packages/lorcana-engine/src/cards/abilities/types/condition-types.ts
      ...(name && name.trim() && { name: name }),
      ...(text && text.trim() && { text: text }),
    };
    return {
      ability: addAbilityIdIfEnabled(abilityWithText, options, 1),
      success: true,
      warnings: [],
    };
  }
  return {
    ability: null,
    success: false,
    warnings: ["Failed to parse ability"],
  };
}

interface BatchResult {
  results: ParseResult[];
  total: number;
  successful: number;
  failed: number;
}

/**
 * Parse multiple ability texts.
 */
export function parseAbilityTexts(
  texts: string[],
  options?: ParseOptions,
): BatchResult {
  const results = texts.map((text) => parseAbilityText(text, options));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    failed,
    results,
    successful,
    total: texts.length,
  };
}

/**
 * Parse ability text that may contain multiple abilities
 *
 * This function handles complex card texts that contain multiple abilities
 * separated by newlines (e.g., "ABILITY ONE Effect.\nABILITY TWO Other effect.").
 *
 * For manual override entries, returns all abilities defined in the entry.
 * For regular texts, splits by newline and parses each ability individually.
 *
 * @param text - Raw ability text from card (may contain multiple abilities)
 * @param options - Parser options
 * @returns Multi-parse result with array of abilities
 *
 * @example
 * ```typescript
 * const result = parseAbilityTextMulti("ABILITY ONE Effect.\nABILITY TWO Other.");
 * if (result.success) {
 *   console.log(`Found ${result.abilities.length} abilities`);
 * }
 * ```
 */
export function parseAbilityTextMulti(
  text: string,
  options?: ParseOptions,
): MultiParseResult {
  if (!(text && text.trim())) {
    return {
      abilities: [],
      error: "Empty ability text",
      success: false,
    };
  }

  // Step 1: Check for manual override by card name first
  if (options?.cardName && MANUAL_ENTRIES_BY_NAME[options.cardName]) {
    const entry = MANUAL_ENTRIES_BY_NAME[options.cardName];
    const entries = Array.isArray(entry) ? entry : [entry];
    // Add IDs if generation is enabled
    const abilitiesWithIds = entries.map((ability, index) =>
      addAbilityIdIfEnabled(ability as AbilityWithText, options, index + 1),
    );
    return {
      abilities: abilitiesWithIds,
      success: true,
    };
  }

  // Step 2: Check for manual override by text pattern (normalized)
  const normalizedText = normalizeText(text);
  if (tooComplexText(normalizedText)) {
    const manualEntries = getManualEntries(normalizedText, options?.cardName);
    if (manualEntries && manualEntries.length > 0) {
      // Add IDs if generation is enabled
      const abilitiesWithIds = manualEntries.map((ability, index) =>
        addAbilityIdIfEnabled(ability, options, index + 1),
      );
      return {
        abilities: abilitiesWithIds,
        success: true,
      };
    }
    return {
      abilities: [],
      error: `Text marked as complex but no manual entry found: "${normalizedText}"${options?.cardName ? ` (Card: ${options.cardName})` : ""}. Please add an entry to MANUAL_ENTRIES in manual-overrides.ts`,
      success: false,
    };
  }

  // Step 3: Split by newlines and parse each ability individually
  const abilityTexts = text
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  // If no newlines, parse as single ability
  if (abilityTexts.length <= 1) {
    const singleResult = parseAbilityText(text.trim(), options);

    if (singleResult.success && singleResult.ability) {
      // ID is already added in parseAbilityText with index 1
      return {
        abilities: [singleResult.ability],
        success: true,
        warnings: singleResult.warnings,
      };
    }

    return {
      abilities: [],
      error: singleResult.error || singleResult.warnings?.join(", "),
      success: false,
      warnings: singleResult.warnings,
    };
  }

  // Step 4: Parse each ability text individually
  const abilities: AbilityWithText[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < abilityTexts.length; i++) {
    const abilityText = abilityTexts[i];
    // Create options with ability index for ID generation
    const abilityIndex = i + 1;
    const result = parseAbilityText(abilityText, options);

    if (result.success && result.ability) {
      // Add ID if generation is enabled (parseAbilityText already adds it with index 1,
      // But we need to override with the correct index for multi-ability parsing)
      const abilityWithId = addAbilityIdIfEnabled(
        result.ability,
        options,
        abilityIndex,
        true, // Override existing ID from parseAbilityText
      );
      abilities.push(abilityWithId);
    } else {
      warnings.push(`Failed to parse: "${abilityText}"`);
    }
  }

  // Success if at least one ability parsed
  if (abilities.length > 0) {
    return {
      abilities,
      success: true,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  return {
    abilities: [],
    error: "Failed to parse any abilities",
    success: false,
    warnings,
  };
}
