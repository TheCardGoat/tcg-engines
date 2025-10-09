/**
 * Abstract base class for card validators
 *
 * Provides infrastructure for validating card definitions to ensure
 * they meet game-specific requirements.
 *
 * Game engines should extend this class to implement game-specific validation logic.
 *
 * @example
 * ```typescript
 * class GundamCardValidator extends CardValidator<GundamCard> {
 *   protected doValidate(card: GundamCard): ValidationResult {
 *     const errors: string[] = [];
 *     const warnings: string[] = [];
 *
 *     if (!card.name) errors.push("Card must have a name");
 *     if (card.cost < 0) errors.push("Cost cannot be negative");
 *
 *     return { valid: errors.length === 0, errors, warnings };
 *   }
 * }
 * ```
 */

import type { ValidationResult } from "./types";

/**
 * Abstract card validator
 *
 * @template TCard - Card type to validate
 */
export abstract class CardValidator<TCard> {
  /**
   * Validate a single card
   *
   * @param card - Card to validate
   * @returns Validation result
   */
  public validate(card: TCard): ValidationResult {
    try {
      return this.doValidate(card);
    } catch (error) {
      return {
        valid: false,
        errors: [
          error instanceof Error
            ? `Validation error: ${error.message}`
            : "Unknown validation error occurred",
        ],
        warnings: [],
      };
    }
  }

  /**
   * Validate multiple cards in batch
   *
   * @param cards - Cards to validate
   * @returns Array of validation results
   */
  public validateBatch(cards: TCard[]): ValidationResult[] {
    return cards.map((card) => this.validate(card));
  }

  /**
   * Validate and return only valid cards
   *
   * @param cards - Cards to validate
   * @returns Array of valid cards
   */
  public filterValid(cards: TCard[]): TCard[] {
    const results = this.validateBatch(cards);
    return cards.filter((_, index) => results[index].valid);
  }

  /**
   * Validate and return cards with validation results
   *
   * @param cards - Cards to validate
   * @returns Array of cards with their validation results
   */
  public validateWithCards(
    cards: TCard[],
  ): Array<{ card: TCard; validation: ValidationResult }> {
    return cards.map((card) => ({
      card,
      validation: this.validate(card),
    }));
  }

  /**
   * Actual validation implementation (to be overridden by subclasses)
   *
   * @param card - Card to validate
   * @returns Validation result
   */
  protected abstract doValidate(card: TCard): ValidationResult;
}
