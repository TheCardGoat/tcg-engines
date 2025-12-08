/**
 * @tcg/lorcana-cards
 *
 * Card definitions, parser, and tooling for Lorcana TCG.
 *
 * Types and builders are provided by @tcg/lorcana package.
 * This package provides:
 * - Parser for converting card text to ability objects
 * - Card data definitions (future)
 *
 * @example Basic usage
 * ```typescript
 * import { parseAbilityText } from "@tcg/lorcana-cards";
 *
 * const result = parseAbilityText("Rush");
 * if (result.success) {
 *   console.log(result.ability);
 * }
 * ```
 *
 * @example Import from parser subpath
 * ```typescript
 * import { parseAbilityText } from "@tcg/lorcana-cards/parser";
 * ```
 */

// Re-export parser
export * from "./parser";
