/**
 * Card Definition Extensions for Effects
 *
 * Base types for card definitions that include effects.
 */

import type { Effect } from "./effect-definition";
import type { KeywordEffect } from "./keywords";
import type { CardType } from "./targeting";

/**
 * Base Card Definition with Effects
 *
 * Common properties for all card types that can have effects.
 */
export interface BaseEffectCardDefinition {
  /** Unique card identifier */
  readonly id: string;

  /** Card name */
  readonly name: string;

  /** Card type */
  readonly cardType: CardType;

  /** Level (for units/commands/bases) */
  readonly lv: number;

  /** Resource cost to play */
  readonly cost: number;

  /** Card text displayed to players */
  readonly text?: string;

  /** Effects defined on this card */
  readonly effects: Effect[];
}

/**
 * Command Card Definition
 *
 * Command cards have effects that resolve when played.
 * Can have pilot effects and burst effects.
 */
export interface CommandCardDefinition extends BaseEffectCardDefinition {
  readonly cardType: "COMMAND";

  /** Pilot effect when paired with compatible unit */
  readonly pilotEffect?: PilotEffect;

  /** Burst effect that can activate at burst timing */
  readonly burstEffect?: Effect;
}

/**
 * Unit Card Definition
 *
 * Unit cards have stats and can have effects and keywords.
 */
export interface UnitCardDefinition extends BaseEffectCardDefinition {
  readonly cardType: "UNIT";

  /** Attack Power */
  readonly ap: number;

  /** Hit Points */
  readonly hp: number;

  /** Keywords inherent to this unit */
  readonly keywordEffects?: KeywordEffect[];

  /** Pilot that can pair with this unit (optional) */
  readonly compatiblePilot?: string;
}

/**
 * Pilot Effect Definition
 *
 * Modifier effects granted when a pilot is paired with a unit.
 */
export interface PilotEffect {
  /** AP modifier granted */
  readonly apModifier: number;

  /** HP modifier granted */
  readonly hpModifier: number;

  /** Additional effects granted */
  readonly effects: Effect[];
}

/**
 * Base Card Definition
 *
 * Base cards have effects and represent the player's base.
 */
export interface BaseCardDefinition extends BaseEffectCardDefinition {
  readonly cardType: "BASE";

  /** Base HP */
  readonly hp: number;

  /** Starting shield count */
  readonly startingShields: number;
}
