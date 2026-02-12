/**
 * Gundam Card Game Effect Timing Types
 *
 * Defines when effects can activate or resolve. Uses discriminated union with
 * `type` field for exhaustive type checking.
 *
 * See Official Rules Section 11-3: Effect Timing.
 */

/**
 * Effect Timing
 *
 * Defines when effects can activate or resolve. Uses discriminated union with
 * `type` field for exhaustive type checking.
 *
 * See Official Rules Section 11-3: Effect Timing.
 */
export type EffectTiming =
  | MainTiming
  | ActionTiming
  | DeployTiming
  | AttackTiming
  | DestroyedTiming
  | BurstTiming
  | ActivateMainTiming
  | ActivateActionTiming
  | StartOfTurnTiming
  | EndOfTurnTiming;

/**
 * Main phase timing - effects can activate during main phase
 */
export interface MainTiming {
  readonly type: "MAIN";
}

/**
 * Action phase timing - effects can activate during action phase
 */
export interface ActionTiming {
  readonly type: "ACTION";
}

/**
 * Deploy timing - effects trigger when a unit is deployed
 */
export interface DeployTiming {
  readonly type: "DEPLOY";
}

/**
 * Attack timing - effects trigger during attack declaration or combat
 */
export interface AttackTiming {
  readonly type: "ATTACK";
  readonly step?: "declaration" | "damage" | "end";
}

/**
 * Destroyed timing - effects trigger when a unit is destroyed
 */
export interface DestroyedTiming {
  readonly type: "DESTROYED";
}

/**
 * Burst timing - effects that can interrupt and respond to other effects
 */
export interface BurstTiming {
  readonly type: "BURST";
  readonly timing: "before" | "after";
}

/**
 * Activate Main timing - activated abilities usable during main phase
 */
export interface ActivateMainTiming {
  readonly type: "ACTIVATE_MAIN";
}

/**
 * Activate Action timing - activated abilities usable during action phase
 */
export interface ActivateActionTiming {
  readonly type: "ACTIVATE_ACTION";
}

/**
 * Start of turn timing - effects trigger at the beginning of a turn
 */
export interface StartOfTurnTiming {
  readonly type: "START_OF_TURN";
}

/**
 * End of turn timing - effects trigger at the end of a turn
 */
export interface EndOfTurnTiming {
  readonly type: "END_OF_TURN";
}
