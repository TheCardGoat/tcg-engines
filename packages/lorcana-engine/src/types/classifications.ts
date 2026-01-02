/**
 * Classifications (Rule 6.2.6)
 *
 * Re-exports classifications from @tcg/lorcana-types for backwards compatibility.
 * This file maintains the existing API while delegating to the new types package.
 */

// Import for local use
import { CLASSIFICATIONS as _CLASSIFICATIONS } from "@tcg/lorcana-types";

// Re-export from @tcg/lorcana-types
export type { Classification } from "@tcg/lorcana-types";

export {
  CLASSIFICATIONS,
  isClassification,
  isDreamborn,
  isFloodborn,
  isStoryborn,
} from "@tcg/lorcana-types";

// Local additions for backwards compatibility
/**
 * Get all classifications
 */
export function getAllClassifications(): readonly string[] {
  return _CLASSIFICATIONS;
}
