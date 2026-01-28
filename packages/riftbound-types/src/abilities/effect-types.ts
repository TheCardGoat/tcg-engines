/**
 * Riftbound Effect Type Definitions
 *
 * Types for defining effects that abilities can produce.
 */

/**
 * Base effect type
 */
export interface BaseEffect {
  readonly type: string;
}

/**
 * Draw cards effect
 */
export interface DrawEffect extends BaseEffect {
  readonly type: "draw";
  readonly amount: number;
  readonly player?: "self" | "opponent" | "both";
}

/**
 * Deal damage effect
 */
export interface DamageEffect extends BaseEffect {
  readonly type: "damage";
  readonly amount: number;
  readonly target: unknown; // Will be refined with Target types
}

/**
 * Heal effect
 */
export interface HealEffect extends BaseEffect {
  readonly type: "heal";
  readonly amount: number;
  readonly target: unknown;
}

/**
 * Move card effect
 */
export interface MoveEffect extends BaseEffect {
  readonly type: "move";
  readonly target: unknown;
  readonly from: string;
  readonly to: string;
}

/**
 * Modify stats effect
 */
export interface ModifyStatsEffect extends BaseEffect {
  readonly type: "modifyStats";
  readonly target: unknown;
  readonly stat: string;
  readonly amount: number;
  readonly duration?: "permanent" | "turn" | "phase";
}

/**
 * Sequence effect - execute effects in order
 */
export interface SequenceEffect extends BaseEffect {
  readonly type: "sequence";
  readonly effects: Effect[];
}

/**
 * Choice effect - player chooses one effect
 */
export interface ChoiceEffect extends BaseEffect {
  readonly type: "choice";
  readonly options: Effect[];
}

/**
 * Optional effect - player may choose to apply
 */
export interface OptionalEffect extends BaseEffect {
  readonly type: "optional";
  readonly effect: Effect;
}

/**
 * Union type for all effect types
 */
export type Effect =
  | DrawEffect
  | DamageEffect
  | HealEffect
  | MoveEffect
  | ModifyStatsEffect
  | SequenceEffect
  | ChoiceEffect
  | OptionalEffect;

/**
 * Type guard for control flow effects
 */
export function isControlFlowEffect(
  effect: Effect,
): effect is SequenceEffect | ChoiceEffect | OptionalEffect {
  return (
    effect.type === "sequence" ||
    effect.type === "choice" ||
    effect.type === "optional"
  );
}
