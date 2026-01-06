/**
 * Manual Override Registry
 *
 * Stores hand-converted cards for complex abilities that can't be auto-converted.
 * These are used as fallbacks when the automatic converter fails.
 */

import type {
  ActionCard,
  CharacterCard,
  ItemCard,
  LocationCard,
} from "@tcg/lorcana-types";

/**
 * Manual override entries
 *
 * Map of card ID to manually converted card
 */
const MANUAL_OVERRIDES: Map<
  string,
  CharacterCard | ActionCard | ItemCard | LocationCard
> = new Map();

/**
 * Get manual override for a card
 *
 * @param cardId - Card ID
 * @returns Manually converted card, or undefined if no override exists
 */
export function getManualOverride(
  cardId: string,
): CharacterCard | ActionCard | ItemCard | LocationCard | undefined {
  return MANUAL_OVERRIDES.get(cardId);
}

/**
 * Check if a card has a manual override
 *
 * @param cardId - Card ID
 * @returns True if manual override exists
 */
export function hasManualOverride(cardId: string): boolean {
  return MANUAL_OVERRIDES.has(cardId);
}

/**
 * Add a manual override
 *
 * @param card - Manually converted card
 */
export function addManualOverride(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): void {
  MANUAL_OVERRIDES.set(card.id, card);
}

/**
 * Get all manual override card IDs
 *
 * @returns Array of card IDs with manual overrides
 */
export function getManualOverrideIds(): string[] {
  return Array.from(MANUAL_OVERRIDES.keys());
}

/**
 * Clear all manual overrides (mainly for testing)
 */
export function clearManualOverrides(): void {
  MANUAL_OVERRIDES.clear();
}

/**
 * Cards that are known to need manual review
 *
 * These cards have complex abilities that don't convert well automatically.
 */
export const CARDS_NEEDING_MANUAL_REVIEW: Set<string> = new Set([
  // Add card IDs here as they're discovered
  // Example: "d6b" // Ariel - On Human Legs has voicelessAbility that needs special handling
]);

/**
 * Check if a card needs manual review
 *
 * @param cardId - Card ID
 * @returns True if card needs manual review
 */
export function needsManualReview(cardId: string): boolean {
  return CARDS_NEEDING_MANUAL_REVIEW.has(cardId);
}

/**
 * Get all cards needing manual review
 *
 * @returns Array of card IDs
 */
export function getCardsNeedingManualReview(): string[] {
  return Array.from(CARDS_NEEDING_MANUAL_REVIEW);
}

/**
 * Add a card to the manual review list
 *
 * @param cardId - Card ID
 */
export function addToManualReviewList(cardId: string): void {
  CARDS_NEEDING_MANUAL_REVIEW.add(cardId);
}

/**
 * Complexity metrics for a card
 */
export interface CardComplexity {
  /** Total number of abilities */
  abilityCount: number;
  /** Number of complex effects (scry, tutor, etc.) */
  complexEffects: number;
  /** Number of nested or conditional effects */
  nestedEffects: number;
  /** Number of dynamic values (variable amounts) */
  dynamicValues: number;
  /** Overall complexity score (0-100+) */
  score: number;
}

/**
 * Analyze card complexity
 *
 * @param card - Card to analyze
 * @returns Complexity metrics
 */
export function analyzeCardComplexity(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): CardComplexity {
  const complexity: CardComplexity = {
    abilityCount: card.abilities?.length ?? 0,
    complexEffects: 0,
    nestedEffects: 0,
    dynamicValues: 0,
    score: 0,
  };

  // Count complex effects
  if (card.abilities) {
    for (const ability of card.abilities) {
      const abilityRecord = ability as unknown as Record<string, unknown>;
      complexity.complexEffects += countComplexEffects(abilityRecord);
      complexity.nestedEffects += countNestedEffects(abilityRecord);
      complexity.dynamicValues += countDynamicValues(abilityRecord);
    }
  }

  // Calculate overall score
  complexity.score =
    complexity.abilityCount * 5 +
    complexity.complexEffects * 10 +
    complexity.nestedEffects * 15 +
    complexity.dynamicValues * 20;

  return complexity;
}

/**
 * Count complex effects in an ability
 */
function countComplexEffects(ability: Record<string, unknown>): number {
  let count = 0;

  // Check for known complex effect types
  const effect = ability.effect as Record<string, unknown> | undefined;
  if (effect) {
    if (effect.type === "look-at-cards") {
      count += 1;
      // Scry with tutor is more complex
      if (effect.then) {
        count += 1;
      }
    }

    if (effect.type === "sequence") {
      const steps = effect.steps as unknown[];
      if (steps && steps.length > 2) {
        count += steps.length;
      }
    }

    if (effect.type === "conditional" || effect.type === "for-each") {
      count += 1;
    }
  }

  return count;
}

/**
 * Count nested effects in an ability
 */
function countNestedEffects(ability: Record<string, unknown>): number {
  let count = 0;

  const effect = ability.effect as Record<string, unknown> | undefined;
  if (effect) {
    // Nested effects in sequences
    if (effect.type === "sequence") {
      const steps = effect.steps as unknown[];
      if (steps) {
        count += steps.length - 1;
      }
    }

    // Nested effects in conditionals
    if (effect.type === "conditional") {
      count += 1;
      if (effect.else) {
        count += 1;
      }
    }

    // Nested effects in optionals
    if (effect.type === "optional") {
      count += 1;
    }
  }

  return count;
}

/**
 * Count dynamic values in an ability
 */
function countDynamicValues(ability: Record<string, unknown>): number {
  let count = 0;

  const checkForDynamic = (obj: unknown): void => {
    if (typeof obj === "object" && obj !== null) {
      for (const value of Object.values(obj)) {
        if (typeof value === "object" && value !== null) {
          if ("type" in value && typeof value.type === "string") {
            // Check for variable amount types
            const variableTypes = [
              "damage-on-target",
              "cards-in-hand",
              "characters-in-play",
              "strength-of",
              "willpower-of",
            ];
            if (variableTypes.some((vt) => value.type === vt)) {
              count += 1;
            }
          }
          // Recurse into nested objects
          checkForDynamic(value);
        }
      }
    }
  };

  checkForDynamic(ability);

  return count;
}

/**
 * Get cards that exceed complexity threshold
 *
 * @param cards - Cards to check
 * @param threshold - Complexity threshold (default: 50)
 * @returns Cards exceeding threshold
 */
export function getComplexCards(
  cards: (CharacterCard | ActionCard | ItemCard | LocationCard)[],
  threshold = 50,
): (CharacterCard | ActionCard | ItemCard | LocationCard)[] {
  return cards.filter((card) => {
    const complexity = analyzeCardComplexity(card);
    return complexity.score >= threshold;
  });
}

/**
 * Generate complexity report
 *
 * @param cards - Cards to analyze
 * @returns Formatted report
 */
export function generateComplexityReport(
  cards: (CharacterCard | ActionCard | ItemCard | LocationCard)[],
): string {
  let report = "=== Card Complexity Report ===\n\n";

  const cardComplexities = cards.map((card) => ({
    card,
    complexity: analyzeCardComplexity(card),
  }));

  // Sort by complexity score
  cardComplexities.sort((a, b) => b.complexity.score - a.complexity.score);

  // Show top 20 most complex
  const topComplex = cardComplexities.slice(0, 20);

  report += `Top ${topComplex.length} Most Complex Cards:\n\n`;

  for (const { card, complexity } of topComplex) {
    report += `${card.name} (Score: ${complexity.score})\n`;
    report += `  Abilities: ${complexity.abilityCount}\n`;
    report += `  Complex effects: ${complexity.complexEffects}\n`;
    report += `  Nested effects: ${complexity.nestedEffects}\n`;
    report += `  Dynamic values: ${complexity.dynamicValues}\n`;
    report += "\n";
  }

  return report;
}
