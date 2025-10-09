/**
 * Abstract base class for card code generators
 *
 * Provides infrastructure for generating TypeScript card definition files
 * from structured card data.
 *
 * Game engines should extend this class to implement game-specific generation logic.
 *
 * @example
 * ```typescript
 * class GundamCardGenerator extends CardGenerator<GundamCard> {
 *   protected generateContent(card: GundamCard): string {
 *     return `export const ${this.variableName(card.name)}: UnitCard = { ... };`;
 *   }
 *
 *   protected generateFileName(card: GundamCard): string {
 *     return `${card.setCode}-${card.number}.ts`;
 *   }
 * }
 * ```
 */

import type { GeneratedFile } from "./types";

/**
 * Abstract card generator
 *
 * @template TCard - Card type to generate code from
 */
export abstract class CardGenerator<TCard> {
  /**
   * Generate TypeScript code for a single card
   *
   * @param card - Card to generate code for
   * @returns Generated TypeScript content
   */
  public generate(card: TCard): string {
    return this.generateContent(card);
  }

  /**
   * Generate code for multiple cards
   *
   * @param cards - Cards to generate code for
   * @returns Array of generated files
   */
  public generateBatch(cards: TCard[]): GeneratedFile[] {
    return cards.map((card) => ({
      fileName: this.generateFileName(card),
      content: this.generateContent(card),
    }));
  }

  /**
   * Generate content for a card (to be overridden by subclasses)
   *
   * @param card - Card to generate code for
   * @returns TypeScript code content
   */
  protected abstract generateContent(card: TCard): string;

  /**
   * Generate file name for a card (to be overridden by subclasses)
   *
   * @param card - Card to generate file name for
   * @returns File name (including extension)
   */
  protected abstract generateFileName(card: TCard): string;
}
