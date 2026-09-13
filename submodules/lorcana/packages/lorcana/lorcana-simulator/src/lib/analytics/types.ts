/**
 * GA4 analytics event types and parameter definitions.
 *
 * All custom events use snake_case, domain-prefixed naming.
 * Parameter values are strings or numbers only (GA4 constraint).
 *
 * PRIVACY: Never put free-text user input (deck names, chat, usernames, emails)
 * into event params. Only structured/enumerated values and bounded numerics.
 * Error messages must be truncated via `truncateForAnalytics()` from analytics.ts.
 */

// ── Auth Events ──────────────────────────────────────────────
export type AuthSignInMethod = "discord" | "email" | "metafy";
export interface AuthSignInStartParams {
  method: AuthSignInMethod;
}
export interface AuthSignInCompleteParams {
  method: AuthSignInMethod;
}
// auth_sign_out has no params

// ── Game Events ──────────────────────────────────────────────
export interface GameJoinParams {
  mode: "ranked" | "practice" | "spectator" | "unknown";
}
export interface GamePregameFirstParams {
  /** GA4 only supports string/number values — use "true"/"false" instead of boolean. */
  chose_first: "true" | "false";
}
export interface GameMulliganParams {
  cards_mulliganed: number;
}
export interface GameMoveParams {
  move_id: string;
  turn: number;
  /** Card identifier (cardId / instanceId) when the move acts on a card. */
  card_id?: string;
  /** Ink cost paid for the move when applicable. */
  ink_cost?: number;
  /** Milliseconds since the previous tracked move; useful for pace-of-play analysis. */
  ms_since_prev_move?: number;
  /**
   * Side that initiated the move. Currently only "self" is emitted because the
   * local client only dispatches its own moves; opponent move tracking would
   * require wiring through the WebSocket inbound handler.
   */
  actor_side?: "self";
}
// game_concede has no params
export interface GameEndParams {
  result: "win" | "loss" | "draw";
  turns: number;
  duration_seconds: number;
  mode: string;
  /** Format of the match (e.g. "core_constructed", "draft"). */
  format?: string;
  /** Local player's deck identifier — non-PII opaque ID, never deck name. */
  deck_id?: string;
}
export interface GameStateRecoveryParams {
  cause: "stale_state" | "delivery_unknown";
  move_type: string;
  duration_ms?: number;
}

// ── Performance & Quality Signals ────────────────────────────
export interface WebVitalParams {
  /** Vital name: LCP, INP, CLS, FCP, TTFB. */
  name: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  /** Vital value in ms (or unitless for CLS). */
  value: number;
  /** Google's bucket rating. */
  rating: "good" | "needs-improvement" | "poor";
}
export interface WsLatencySampleParams {
  latency_ms: number;
  namespace: string;
  authenticated: boolean;
  connection_auth_state: "authenticated" | "anonymous";
  /** Disconnect transitions observed since the previous latency sample. */
  disconnects_since_last_probe: number;
}
export interface TimeToFirstMoveParams {
  duration_ms: number;
}
export interface TimeToMulliganParams {
  duration_ms: number;
}
export interface MoveExecutionLatencySummaryParams {
  executions_total: number;
  over_200_count: number;
  over_500_count: number;
  max_duration_ms: number;
  flush_reason: "interval" | "game_end" | "destroy";
  mode?: string;
  format?: string;
  deck_id?: string;
}

// ── Exception / Error Events ─────────────────────────────────
export interface AppExceptionParams {
  /** Subsystem the exception originated from. */
  source: string;
  /** Structured error code; "unknown" if none available. */
  code: string;
  /** Truncated error message (≤ 100 chars). Never include free-text user input. */
  message?: string;
  /** "true" if the error was unrecoverable. GA4 stores booleans as strings. */
  fatal: "true" | "false";
}

// ── Connection Events ────────────────────────────────────────
// ws_connect has no params
export interface WsDisconnectParams {
  reason: string;
}
export interface WsReconnectParams {
  attempts: number;
}
export interface WsReconnectFailedParams {
  attempts: number;
  last_error?: string;
}
export interface WsDisconnectCountSampleParams {
  /** Disconnect transitions observed in the previous window. */
  count: number;
  /** Length of the reporting window in seconds. */
  window_seconds: number;
}

// ── Replay & Spectator Events ────────────────────────────────
// replay_view has no params

// ── Engagement Events ────────────────────────────────────────
// session_start has no params
export interface SessionEndParams {
  duration_seconds: number;
}

// ── Manual Mode (Board State Correction) Events ─────────────
export interface ManualModeProposalParams {
  game_id: string;
  role: "sender" | "recipient";
  /** Which side of the toggle was requested. Only present on `manual_mode_requested`. */
  intent?: "enable" | "disable";
}
export interface ManualModeRejectedParams {
  game_id: string;
  role: "sender" | "recipient";
  reason: "declined" | "expired" | "failed";
}
export interface ManualModeDisabledParams {
  game_id: string;
  by: "self" | "opponent";
}
export interface ManualModeCorrectionParams {
  game_id: string;
  kind: "lore" | "damage" | "move";
}

// ── Event Map ────────────────────────────────────────────────

export interface AnalyticsEventMap {
  // Auth
  auth_sign_in_start: AuthSignInStartParams;
  auth_sign_in_complete: AuthSignInCompleteParams;
  auth_sign_out: Record<string, never>;

  // Game
  game_join: GameJoinParams;
  game_pregame_first: GamePregameFirstParams;
  game_mulligan: GameMulliganParams;
  game_move: GameMoveParams;
  game_concede: Record<string, never>;
  game_end: GameEndParams;
  game_state_recovery_started: GameStateRecoveryParams;
  game_state_recovery_completed: GameStateRecoveryParams;
  game_state_recovery_failed: GameStateRecoveryParams;

  // Connection
  ws_connect: Record<string, never>;
  ws_disconnect: WsDisconnectParams;
  ws_reconnect: WsReconnectParams;
  ws_reconnect_failed: WsReconnectFailedParams;
  ws_latency_sample: WsLatencySampleParams;
  ws_disconnect_count_sample: WsDisconnectCountSampleParams;

  // Performance
  web_vital: WebVitalParams;
  time_to_first_move: TimeToFirstMoveParams;
  time_to_mulligan: TimeToMulliganParams;
  move_execution_latency_summary: MoveExecutionLatencySummaryParams;

  // Exceptions
  app_exception: AppExceptionParams;

  // Replay & Spectator
  replay_view: Record<string, never>;
  replay_fork: { step: number; humanSide: string };

  // Engagement
  session_start: Record<string, never>;
  session_end: SessionEndParams;

  // Manual Mode (Board State Correction)
  manual_mode_requested: ManualModeProposalParams;
  manual_mode_accepted: ManualModeProposalParams;
  manual_mode_rejected: ManualModeRejectedParams;
  manual_mode_disabled: ManualModeDisabledParams;
  manual_mode_correction_applied: ManualModeCorrectionParams;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export interface AnalyticsUserProperties {
  auth_state: "authenticated" | "anonymous";
  has_profile: "true" | "false";
  locale: string;
  /** Most-used format inferred from completed games (e.g. "core_constructed"). */
  preferred_format: string;
  /** Total games completed by this user across sessions. */
  total_games: number;
  /** Bucketed win rate to keep cardinality low for GA4 segments. */
  win_rate_bucket: "<40%" | "40-60%" | ">60%" | "unknown";
}
