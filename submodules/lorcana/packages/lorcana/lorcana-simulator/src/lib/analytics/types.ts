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

// ── Onboarding Events ────────────────────────────────────────
// onboard_start has no params
// onboard_complete has no params
export interface OnboardErrorParams {
  error: string;
}

// ── Deck & Profile Events ────────────────────────────────────
// profile_switch has no params
// deck_select has no params
// deck_import_start has no params
export interface DeckImportCompleteParams {
  card_count: number;
}
export interface DeckImportErrorParams {
  error: string;
  /** Optional structured error code (e.g. HTTP status, parser code). */
  error_code?: string;
  /** Truncated error message — never raw user-supplied text. */
  error_message?: string;
}

// ── Matchmaking Events ───────────────────────────────────────
export interface QueueJoinParams {
  format: string;
  mode: string;
  matchType: string;
}
export interface QueueJoinErrorParams {
  error: string;
  error_code?: string;
  error_message?: string;
}
export interface QueueJoinBlockedParams {
  reason: string;
}
export interface QueueLeaveParams {
  matchType: string;
}
export interface QueueMatchFoundParams {
  wait_seconds: number;
  matchType: string;
}
export interface QueueTimeoutParams {
  wait_seconds: number;
  matchType: string;
}
export interface QueueMatchReadyExpiredParams {
  reason: "declined" | "timeout";
  matchType: string;
}
export interface MatchForfeitParams {
  source: string;
  matchType?: string;
}
// practice_start has no params

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
// replay_save has no params
// replay_download has no params
// spectate_start has no params
export interface SpectateEndParams {
  duration_seconds: number;
}

// ── Matchmaking Lobby Events ─────────────────────────────────
export interface MatchmakingFormatSelectParams {
  format: string;
}
export interface MatchmakingModeSelectParams {
  mode: string;
}
// live_match_spectate has no params
// practice_error has no params

// ── Engagement Events ────────────────────────────────────────
export interface SettingsChangeParams {
  setting: string;
  value: string;
}
// install_nudge_shown has no params
// install_nudge_dismiss has no params
// session_start has no params
export interface SessionEndParams {
  duration_seconds: number;
}
export interface OnboardStepViewParams {
  step_id: string;
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

// ── Match History Events ────────────────────────────────────
export interface DeckRundownViewParams {
  deck_name: string;
}
export interface DeckRundownDeckSelectedParams {
  deck_name: string;
}
export interface DeckRundownSortChangedParams {
  sort_mode: string;
}

// ── Event Map ────────────────────────────────────────────────

export interface AnalyticsEventMap {
  // Auth
  auth_sign_in_start: AuthSignInStartParams;
  auth_sign_in_complete: AuthSignInCompleteParams;
  auth_sign_out: Record<string, never>;

  // Onboarding
  onboard_start: Record<string, never>;
  onboard_complete: Record<string, never>;
  onboard_error: OnboardErrorParams;

  // Deck & Profile
  profile_switch: Record<string, never>;
  deck_select: Record<string, never>;
  deck_import_start: Record<string, never>;
  deck_import_complete: DeckImportCompleteParams;
  deck_import_error: DeckImportErrorParams;
  deck_create: Record<string, never>;
  deck_delete: Record<string, never>;
  legacy_import_start: Record<string, never>;
  legacy_import_complete: Record<string, never>;
  legacy_import_error: { error: string; error_code?: string; error_message?: string };

  // Matchmaking
  queue_join: QueueJoinParams;
  queue_join_error: QueueJoinErrorParams;
  queue_join_blocked: QueueJoinBlockedParams;
  queue_leave: QueueLeaveParams;
  queue_match_found: QueueMatchFoundParams;
  queue_match_ready_expired: QueueMatchReadyExpiredParams;
  queue_timeout: QueueTimeoutParams;
  practice_start: Record<string, never>;
  match_forfeit: MatchForfeitParams;

  // Matchmaking Lobby
  matchmaking_format_select: MatchmakingFormatSelectParams;
  matchmaking_mode_select: MatchmakingModeSelectParams;
  matchmaking_match_type_select: { matchType: string };
  live_match_spectate: Record<string, never>;
  spectate_while_queued_open: Record<string, never>;

  // Game
  game_join: GameJoinParams;
  game_pregame_first: GamePregameFirstParams;
  game_mulligan: GameMulliganParams;
  game_move: GameMoveParams;
  game_concede: Record<string, never>;
  game_end: GameEndParams;

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

  // Exceptions
  app_exception: AppExceptionParams;

  // Replay & Spectator
  replay_view: Record<string, never>;
  replay_save: Record<string, never>;
  replay_download: Record<string, never>;
  replay_fork: { step: number; humanSide: string };
  spectate_start: Record<string, never>;
  spectate_end: SpectateEndParams;

  // Engagement
  settings_change: SettingsChangeParams;
  install_nudge_shown: Record<string, never>;
  install_nudge_dismiss: Record<string, never>;
  session_start: Record<string, never>;
  session_end: SessionEndParams;
  onboard_step_view: OnboardStepViewParams;

  // Manual Mode (Board State Correction)
  manual_mode_requested: ManualModeProposalParams;
  manual_mode_accepted: ManualModeProposalParams;
  manual_mode_rejected: ManualModeRejectedParams;
  manual_mode_disabled: ManualModeDisabledParams;
  manual_mode_correction_applied: ManualModeCorrectionParams;

  // Match History
  deck_rundown_view: DeckRundownViewParams;
  deck_rundown_deck_selected: DeckRundownDeckSelectedParams;
  deck_rundown_sort_changed: DeckRundownSortChangedParams;
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
