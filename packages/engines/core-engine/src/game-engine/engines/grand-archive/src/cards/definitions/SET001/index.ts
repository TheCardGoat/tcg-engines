/**
 * Grand Archive SET001 Card Exports
 *
 * Combines all card types from SET001 into a single export
 */

import type { GrandArchiveCard } from "../cardTypes";
import { ACTIONS } from "./actions/actions";
import { ALLIES } from "./allies/allies";
import { CHAMPIONS } from "./champions/champions";
import { WEAPONS } from "./weapons/weapons";

/**
 * All SET001 cards combined
 */
export const SET001_CARDS: Record<string, GrandArchiveCard> = {
  ...CHAMPIONS,
  ...ALLIES,
  ...ACTIONS,
  ...WEAPONS,
};

/**
 * Individual type exports for direct access
 */
export { CHAMPIONS, ALLIES, ACTIONS, WEAPONS };
