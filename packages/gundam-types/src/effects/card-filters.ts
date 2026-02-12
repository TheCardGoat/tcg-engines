/**
 * Card Filter Types
 *
 * Similar to TargetFilter but used for searching zones rather than
 * selecting targets for effects.
 */

import type { KeywordEffect } from "./effect-keywords";
import type {
  CardType,
  Color,
  CostFilter,
  LevelFilter,
} from "./targeting-types";

/**
 * Card Filter
 *
 * Defines criteria for filtering cards when searching zones.
 */
export interface CardFilter {
  readonly cardType?: CardType;
  readonly color?: Color;
  readonly trait?: string[];
  readonly name?: string;
  readonly cost?: CostFilter;
  readonly level?: LevelFilter;
  readonly hasKeyword?: KeywordEffect;
}
