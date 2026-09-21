import type { CardsMaps, PlayableGameSlug } from "../game-adapter/types.js";
import type { TimeControlConfig } from "./time-control.js";
import type {
  AnimationPlanV2,
  DropReasonCode,
  EngineInteractionView,
  InteractionSubmission,
  TimeoutFacts,
} from "@tcg/protocol";

/**
 * Engine-native animation record retained for persistence and replay.
 * Game-specific kinds never cross the shared gateway boundary; each server
 * adapter must also project them into a viewer-safe `AnimationPlanV2`.
 */
export interface PacketAnimation<TKind extends string = string, TPayload = unknown> {
  id: string;
  kind: TKind;
  durationMs?: number;
  payload: TPayload;
}

/**
 * Source authority for moves and logs persisted into Redis.
 *
 * Mirrors the Lorcana-engine MoveHistorySourceAuthority shape but lives in
 * shared so non-Lorcana adapters can return records of the same shape without
 * importing from `@tcg/lorcana-engine`.
 */
export type MoveHistorySourceAuthority = "server" | "client";

/**
 * Game-agnostic accepted-move record stored in Redis. Shape matches the
 * existing schema in `apps/api/src/modules/play/types/schemas.ts` so the
 * persistence layer remains shared across games.
 */
export interface AcceptedMoveRecord {
  gameId: string;
  stateVersion: number;
  turnNumber: number;
  actorId: string;
  moveId: string;
  input?: unknown;
  processedCommand: unknown;
  timestamp: number;
  sourceAuthority: MoveHistorySourceAuthority;
  transitionType?: "move" | "undo";
  newStateID?: number;
  undoneStateID?: number;
  restoredCheckpointStateID?: number;
  undoneMoveId?: string;
}

/**
 * Game-agnostic engine-log record stored in Redis.
 */
export interface EngineLogRecord {
  gameId: string;
  stateVersion: number;
  timestamp: number;
  sourceAuthority: MoveHistorySourceAuthority;
  log: unknown;
}

/**
 * Private, game-owned analytics facts produced by one accepted transition.
 * The host persists the opaque payload; only the matching game adapter may
 * interpret it. It must never be projected through the player gateway.
 */
export interface AnalyticsFactBatchRecord {
  gameId: string;
  gameSlug: PlayableGameSlug;
  schemaVersion: number;
  stateVersion: number;
  commandId: string;
  timestamp: number;
  sourceAuthority: MoveHistorySourceAuthority;
  facts: readonly unknown[];
}

/**
 * Result of executing a move (or move-shaped action like forfeit / bot action)
 * on a {@link ServerGameEngine}. Adapters build the records below using
 * their game's helpers and return them ready-to-store.
 *
 * Discriminated on `success` so the play module can rely on `stateID` and
 * `acceptedMoveRecord` being present after a successful dispatch — adapters
 * cannot silently omit them.
 */
export type DispatchResult = DispatchSuccess | DispatchFailure;

/** Operational timeline position for a committed rules-action reversal. */
export interface ReversedActionRecord {
  stateVersion: number;
  turnNumber: number;
  actorId: string;
  timestamp: number;
}

export type DispatchSuccess = DispatchSuccessState &
  (
    | { transition: "move"; acceptedMoveRecord: AcceptedMoveRecord }
    | { transition: "reversal"; reversalRecord: ReversedActionRecord; acceptedMoveRecord?: never }
  );

interface DispatchSuccessState {
  success: true;
  /**
   * Game-owned semantic outcome for an accepted command. The shared host
   * persists and forwards this opaquely; only the matching game adapter and
   * client may interpret it.
   */
  outcome?: unknown;
  /** New state version after the dispatch. Strictly monotonic on success. */
  stateID: number;
  /** Engine state snapshot after dispatch (opaque to the play module). */
  state: unknown;
  /** Patches relative to the previous state. Opaque structure. */
  patches?: readonly unknown[];
  /** Animation packets emitted by the engine. */
  animations?: readonly PacketAnimation[];
  /** Canonical, gateway-safe animation plan for this accepted transition. */
  animationPlan?: AnimationPlanV2 | null;
  /** Pre-built engine-log records emitted during this dispatch. */
  engineLogRecords?: readonly EngineLogRecord[];
  /** Private game analytics facts; never expose these to a viewer. */
  analyticsFactBatchRecords?: readonly AnalyticsFactBatchRecord[];
  /** Whether the move can be undone by its actor. */
  undoable?: boolean;
  /** Adapter-private hint for bot loops; opaque to the play module. */
  processedCommand?: unknown;
}

export interface DispatchFailure {
  success: false;
  error?: string;
  errorCode?: string;
  /** Current state version at the time the dispatch was rejected. */
  stateID?: number;
}

export interface BotDecisionDiagnostics {
  kind: "search";
  strategyId: string;
  candidateCount: number;
  nodesEvaluated: number;
  depthReached: number;
  scoreGap: number | null;
  cutoffReason: "complete" | "depth" | "node-budget" | "hidden-information";
}

/**
 * Result of running a single bot action on behalf of the current actor.
 * Mirrors the Lorcana shape; non-Lorcana adapters either populate it
 * naturally or omit `takeAutomatedAction` entirely.
 */
export interface BotActionResult {
  finalResult: DispatchResult;
  blocked?: { reason: string };
  /** Concrete engine strategy that ran after resolving aliases and promotions. */
  strategyId?: string;
  selectedCandidate?: { family: string };
  fallbackTaken?: string;
  /** Bounded, public-information-only decision telemetry. */
  decisionDiagnostics?: BotDecisionDiagnostics;
  /** Strategy/resolver execution time, excluding command dispatch and persistence. */
  decisionDurationMs?: number;
}

export interface BotActionOptions {
  strategyId?: string;
}

export interface PublicGameEndPlayerSummary {
  playerId: string;
  seat: 1 | 2;
  streetCred?: number;
  gigCount?: number;
}

export interface PublicGameEndSummary {
  game: PlayableGameSlug;
  endReason?: string;
  overtimeActive?: boolean;
  players: [PublicGameEndPlayerSummary, PublicGameEndPlayerSummary];
}

/**
 * Game-owned timeout projection used by skip-turn recovery and timeout drops.
 * Engines that do not expose clock semantics omit the capability; skip is
 * rejected cleanly and drop falls through to disconnect-only eligibility.
 */
export type OpponentTimeoutSkipEvaluation =
  | {
      allowed: false;
      reason: "no_time_control" | "requester_has_priority" | "within_limit" | "skip_unsupported";
    }
  | {
      allowed: true;
      timeout: "first" | "second";
      stallerPlayerId: string;
      timeoutCount: number;
      forceDrop: boolean;
      resetTimeOnSkipMs: number;
    };

export interface OpponentTimeoutDropEvaluation {
  allowed: boolean;
  reason: DropReasonCode;
  eligibleAtMs?: number;
  remainingMs?: number;
  facts: Omit<TimeoutFacts, "source">;
}

export interface OpponentTimeoutEvaluation {
  skip: OpponentTimeoutSkipEvaluation;
  drop: OpponentTimeoutDropEvaluation;
}

export interface EvaluateOpponentTimeoutInput {
  requesterPlayerId: string;
  opponentPlayerId: string;
  nowMs: number;
}

export interface SkipClockResetOptions {
  resetMs?: number;
  previousTimeoutCount: number;
}

export interface TurnSkippedLogInput {
  gameId: string;
  stateVersion: number;
  skipperPlayerId: string;
  stallerPlayerId: string;
  sourceAuthority: MoveHistorySourceAuthority;
}

/**
 * Game-agnostic engine handle. Adapters wrap their concrete engines (e.g.
 * `LorcanaServer`, Cyberpunk `LocalEngine`) into this interface so the play
 * module never imports a game-specific engine type.
 *
 * Required methods cover the move-execution / state-version / game-end path.
 * Optional methods are feature-detected by the play module — if a game
 * doesn't support undo or bot automation, the corresponding handler reports
 * a clean "not supported" error to the gateway.
 */
export interface ServerGameEngine {
  /** Apply a player-driven move. Returns a fully-built dispatch result. */
  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult;

  /** Current state version, monotonically increasing on each accepted dispatch. */
  getStateID(): number;

  /**
   * Current authoritative state snapshot, opaque to the play module. Used for
   * fallback paths where a dispatch produced no fresh state object (e.g.
   * forfeit short-circuited because the game already ended) but the caller
   * still needs to broadcast the terminal state to clients.
   */
  getState(): unknown;

  /** Private, game-owned continuation state. Never send through a viewer projection. */
  getReplayForkState?(): unknown;

  /**
   * Project the current state for a browser viewer. Implementations must hide
   * every object the selected player or a public spectator is not allowed to
   * inspect. The platform never falls back to getState() for server-authority
   * browser sessions.
   */
  getViewerState?(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown;
  /** Viewer-safe static references needed to render the projected state. */
  getViewerResources?(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown;
  /**
   * Project an accepted transition for one recipient before it crosses the
   * gateway boundary. Implementations must replace hidden entity references;
   * browser-side projection is only a rendering defence and is not transport
   * security.
   */
  getViewerAnimationPlan?(
    plan: AnimationPlanV2 | null,
    viewer: { role: "player"; actorId: string } | { role: "spectator" },
  ): AnimationPlanV2 | null;

  /** Current player whose turn it is, or undefined if no time control / no active player. */
  getActivePlayerId(): string | undefined;

  /** Whether the game has reached a terminal state. */
  hasGameEnded(): boolean;

  /** Winner + reason for a terminated game, or undefined while in progress. */
  getGameEndResult(): { winnerId?: string; reason?: string } | undefined;

  /**
   * Optional public, non-hidden terminal score details for match-history feeds.
   * Adapters must only expose information that is safe for all viewers after
   * the game has ended.
   */
  getPublicGameEndSummary?(): PublicGameEndSummary | undefined;

  /** Server-authoritative forfeit. Optional: omit to disable forfeit for this game. */
  forfeit?(winnerId: string, reason: string, context: DispatchContext): DispatchResult;

  /**
   * Run one bot action for the current actor. Optional: omit to disable
   * the "skip stalling opponent's turn" recovery for this game.
   */
  takeAutomatedAction?(options: BotActionOptions, context: DispatchContext): BotActionResult;

  /** Evaluate native clock semantics for opponent-triggered stall recovery. */
  evaluateOpponentTimeout?(input: EvaluateOpponentTimeoutInput): OpponentTimeoutEvaluation;

  /**
   * Apply the engine-native post-skip clock reset before the play module
   * commits the bot action and its fresh viewer projections in one CAS.
   */
  resetPlayerTimeAfterSkip?(playerId: string, options: SkipClockResetOptions): void;

  /** Build the game-native public event-log record for a skipped turn. */
  createTurnSkippedLog?(input: TurnSkippedLogInput): EngineLogRecord;

  canUndo?(playerId: string): boolean;
  undo?(playerId: string, context: DispatchContext, prevStateID?: number): DispatchResult;
  /** Whether this engine can restore the current turn's clean main-phase checkpoint. */
  canUndoToTurnStart?(playerId: string): boolean;
  /** Restore the current turn's clean main-phase checkpoint as a new state version. */
  undoToTurnStart?(
    playerId: string,
    context: DispatchContext,
    prevStateID?: number,
  ): DispatchResult;

  /** Build the current prompt/action projection for a seated actor. */
  getInteractionView?(actorId: string): EngineInteractionView | undefined;

  /** Actor ids that should receive player-specific interaction views after an interaction. */
  getInteractionActorIds?(): readonly string[];

  /** Execute a submitted protocol action. Adapters translate to native engine moves internally. */
  submitInteraction?(
    actorId: string,
    submission: InteractionSubmission,
    context: DispatchContext,
  ): DispatchResult;
}

/**
 * Per-dispatch context. Adapters need this to stamp game/state ids onto the
 * accepted-move and engine-log records they build.
 */
export interface DispatchContext {
  gameId: string;
  sourceAuthority: MoveHistorySourceAuthority;
}

/**
 * Inputs the play module hands to {@link GameAdapter.createServerEngine} when
 * starting a fresh game. Each adapter maps these into its engine's native
 * init params.
 */
export interface ServerEngineCreateInput {
  gameSlug: PlayableGameSlug;
  seed: string;
  player1Id: string;
  player2Id: string;
  cardsMaps: CardsMaps;
  matchID?: string;
  gameID?: string;
  /**
   * Universal time-control config. Adapters narrow on `mode` and translate
   * into their engine's native clock shape (Lorcana, Gundam) or reject any
   * non-`"none"` mode (Cyberpunk, until it grows clock support).
   */
  timeControl?: TimeControlConfig;
  /**
   * Player who has been granted the right to choose who goes first for this
   * game. Set by the play module for games 2+ of a best-of-N series — the
   * loser of the most recent decisive prior game. Omitted for game 1, in
   * which case the adapter falls back to its own default (e.g. coin flip).
   * Adapters that don't have a "choose first player" setup step ignore it.
   */
  firstPlayerChooserId?: string;
  /**
   * Player actually selected to take the first turn. This is deliberately
   * separate from firstPlayerChooserId, which grants the choice (FAB CR 4.1.3).
   */
  firstTurnPlayerId?: string;
  /**
   * Adapter-owned per-seat automation seed. Opaque to the play module — the
   * shape mirrors the `EngineSnapshot.state` opacity precedent (contrast
   * `timeControl`, the deliberately universal shape). Each adapter validates
   * and narrows the values it understands at creation and ignores the field
   * entirely when its engine has no in-engine automation. Only read at
   * creation: engines persist the seeded modes through their own snapshots,
   * so in-match toggles and restores never re-read this field.
   */
  automation?: Readonly<Record<string, unknown>>;
}

/**
 * Inputs for {@link GameAdapter.restoreEngine}. The play module knows the
 * gameSlug and seat ids; the adapter recombines them with its own catalog
 * and snapshot to rebuild a runnable engine.
 */
export interface ServerEngineRestoreContext {
  gameSlug: PlayableGameSlug;
  seed: string;
  player1Id: string;
  player2Id: string;
  /** Optional historic decks for legacy snapshots that don't carry cardsMaps. */
  historicDecks?: HistoricDecksForRestore;
}

export interface HistoricDecksForRestore {
  player1Deck: ReadonlyArray<{ cardPublicId: string; quantity: number }>;
  player2Deck: ReadonlyArray<{ cardPublicId: string; quantity: number }>;
}

/**
 * Persistence envelope written to Redis by the play module. The play module
 * treats `state` and `metadata` as opaque — only the adapter understands them.
 *
 * `gameSlug` discriminates which adapter to route to on restore. Legacy
 * snapshots without a slug are treated as Lorcana for backward compatibility.
 */
export interface EngineSnapshot {
  gameSlug?: PlayableGameSlug;
  /** Authoritative state payload — opaque to the play module. */
  state: unknown;
  /** Length of the move history at the time of snapshot. */
  historyLength: number;
  /** Card-instance map (some games rebuild zones from this). */
  cardsMaps?: CardsMaps;
  /** Adapter-private metadata (e.g. Lorcana undo stack). Opaque. */
  metadata?: unknown;
}
