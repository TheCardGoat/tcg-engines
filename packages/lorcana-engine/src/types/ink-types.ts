/**
 * Ink Types (Rule 2.1.1.2)
 *
 * Re-exports ink types from @tcg/lorcana-types for backwards compatibility.
 * This file maintains the existing API while delegating to the new types package.
 */

// Import for local use
import {
  INK_TYPES as _INK_TYPES,
  isValidInkType as _isValidInkType,
} from "@tcg/lorcana-types";

// Re-export from @tcg/lorcana-types
export type { InkType } from "@tcg/lorcana-types";

export {
  getInkColor,
  INK_COLORS,
  INK_TYPES,
  isValidInkType,
} from "@tcg/lorcana-types";

// Alias for backwards compatibility
export const isInkType = _isValidInkType;

// Local additions for backwards compatibility
/**
 * Get all ink types
 */
export function getAllInkTypes(): readonly string[] {
  return _INK_TYPES;
}
