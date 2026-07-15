/**
 * Universal time-control vocabulary shared by every game's adapter.
 *
 * The play module (`apps/api/src/modules/play`) and route boundaries
 * validate against this shape; per-game adapters narrow the discriminated
 * union and translate it into their engine's native clock config.
 *
 * Modes
 * -----
 * - `none` — no clock. The default; safe for games that don't ship a clock
 *   yet (Cyberpunk today).
 * - `chess` — Fischer-style per-player reserve. Clock runs while a player
 *   holds priority and pauses when priority leaves them. `incrementMs` is
 *   added back after each move; an optional `maxDecisionTimeMs` caps any
 *   single decision so a stalling player can be skipped without burning
 *   their full reserve.
 * - `priority` — per-priority-window allotment plus a fallback reserve.
 *   `perPriorityWindowMs` is the soft per-decision cap; `initialReserveMs`
 *   covers overflow. Designed for games where a player's "turn" is a
 *   sequence of independent priority windows (Lorcana, Gundam).
 * - `dynamic` — Fischer-style reserve with bonus accruals from in-game
 *   actions (per-action bonus, end-turn bonus). Engines compute the bonus
 *   amounts; the universal config only carries the base parameters.
 *
 * Extras
 * ------
 * Every mode carries an optional `extras: Record<string, unknown>` slot for
 * game-specific tuning that doesn't map to the universal fields. The play
 * module never reads `extras`; only the originating adapter narrows it.
 */

export type TimeControlMode = "none" | "chess" | "priority" | "dynamic";

export interface TimeControlNoneConfig {
  mode: "none";
}

export interface TimeControlChessConfig {
  mode: "chess";
  /** Starting reserve, milliseconds, per player. Must be > 0. */
  initialReserveMs: number;
  /** Fischer-style increment added after each move. Defaults to 0. */
  incrementMs?: number;
  /** Bronstein delay before the clock starts charging. Defaults to 0. */
  delayMs?: number;
  /** Forgiveness window where overrun isn't immediately a loss. Defaults to 0. */
  graceMs?: number;
  /**
   * Hard cap on a single priority window. Burning past this trips a
   * "first" timeout the opponent can exploit (skip-opponent-turn) without
   * draining the staller's reserve.
   */
  maxDecisionTimeMs?: number;
  /** What to do when the reserve hits zero. Defaults to `"lose-on-time"`. */
  lossPolicy?: "lose-on-time";
  /** Game-specific tuning the universal contract doesn't model. */
  extras?: Record<string, unknown>;
}

export interface TimeControlPriorityConfig {
  mode: "priority";
  /** Soft per-priority-window cap. Required. */
  perPriorityWindowMs: number;
  /** Reserve drawn from when a window overflows. Required. */
  initialReserveMs: number;
  /** Bonus added back per accepted move. Defaults to 0. */
  perMoveBonusMs?: number;
  /** Forgiveness window. Defaults to 0. */
  graceMs?: number;
  /** What to do when a priority window expires mid-decision. */
  onWindowExpiry?: "auto-pass-if-legal-else-forfeit" | "lose-on-time";
  /** What to do when the reserve hits zero. Defaults to `"lose-on-time"`. */
  onReserveExpiry?: "lose-on-time";
  extras?: Record<string, unknown>;
}

export interface TimeControlDynamicConfig {
  mode: "dynamic";
  /** Starting reserve, milliseconds, per player. Required. */
  initialReserveMs: number;
  /** Bonus added back per accepted action. Defaults to 0. */
  perActionBonusMs?: number;
  /** Bonus added back when the player passes the turn. Defaults to 0. */
  turnPassBonusMs?: number;
  /** What to do when the reserve hits zero. Defaults to `"lose-on-time"`. */
  lossPolicy?: "lose-on-time";
  extras?: Record<string, unknown>;
}

/**
 * The universal time-control config carried in match-creation requests and
 * persisted on `MatchMeta`. Discriminated on `mode` so adapters can narrow
 * exhaustively.
 */
export type TimeControlConfig =
  | TimeControlNoneConfig
  | TimeControlChessConfig
  | TimeControlPriorityConfig
  | TimeControlDynamicConfig;

/**
 * Per-player runtime state for an in-progress clock. Adapters may extend
 * this via mode-specific projections; the universal shape covers what every
 * game can produce.
 */
export interface TimeControlPlayerState {
  /** Reserve remaining, milliseconds. Required. */
  reserveMsRemaining: number;
  /** Total time consumed since match start. Required. */
  totalConsumedMs: number;
  /** How many moves this player has committed under the clock. */
  movesMade: number;
  /** Wall-clock at the last tick. Used to compute "time spent right now". */
  lastUpdatedAtMs: number;
  /** True if this player currently has priority and the clock is running. */
  isOnClock?: boolean;
}

/**
 * Snapshot pair persisted alongside engine state. Optional: games running
 * `mode: "none"` omit the snapshot entirely.
 */
export interface TimeControlSnapshot {
  config: TimeControlConfig;
  players?: Record<string, TimeControlPlayerState>;
}
