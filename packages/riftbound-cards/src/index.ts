/**
 * @tcg/riftbound-cards
 *
 * Card definitions, parser, and tooling for Riftbound TCG.
 *
 * Types and builders are provided by @tcg/riftbound-types package.
 * This package provides:
 * - Parser for converting card text to ability objects
 * - Card data definitions
 *
 * @example Basic usage
 * ```typescript
 * import { parseAbilityText } from "@tcg/riftbound-cards";
 *
 * const result = parseAbilityText("Rush");
 * if (result.success) {
 *   console.log(result.ability);
 * }
 * ```
 *
 * @example Import from parser subpath
 * ```typescript
 * import { parseAbilityText } from "@tcg/riftbound-cards/parser";
 * ```
 */

// Re-export card data
export * from "./data";
// Re-export parser
export * from "./parser";
