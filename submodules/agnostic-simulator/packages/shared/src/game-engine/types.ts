import type { CardsMaps, PlayableGameSlug } from "../game-adapter/types.js";
import type { TimeControlConfig } from "./time-control.js";
import type { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";

/**
 * Generic animation packet emitted by an engine alongside a state update.
 * Game-specific animation kinds are encoded in `kind`/`payload`; the play
 * module passes these through to clients verbatim without inspecting them.
 */
export interface PacketAnimation<TKind extends string = string, TPayload = unknown> {
  id: string;
  kind: TKind;
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
 * Result of executing a move (or move-shaped action like forfeit / bot action)
 * on a {@link ServerGameEngine}. Adapters build the records below using
 * their game's helpers and return them ready-to-store.
 *
 * Discriminated on `success` so the play module can rely on `stateID` and
 * `acceptedMoveRecord` being present after a successful dispatch — adapters
 * cannot silently omit them.
 */
export type DispatchResult = DispatchSuccess | DispatchFailure;

export interface DispatchSuccess {
  success: true;
  /** New state version after the dispatch. Strictly monotonic on success. */
  stateID: number;
  /** Engine state snapshot after dispatch (opaque to the play module). */
  state: unknown;
  /** Patches relative to the previous state. Opaque structure. */
  patches?: readonly unknown[];
  /** Animation packets emitted by the engine. */
  animations?: readonly PacketAnimation[];
  /**
   * Pre-built accepted-move record for this dispatch. Adapters that produce a
   * meaningful move history entry MUST populate this so the play module can
   * persist the move alongside the state snapshot.
   */
  acceptedMoveRecord?: AcceptedMoveRecord;
  /** Pre-built engine-log records emitted during this dispatch. */
  engineLogRecords?: readonly EngineLogRecord[];
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

/**
 * Result of running a single bot action on behalf of the current actor.
 * Mirrors the Lorcana shape; non-Lorcana adapters either populate it
 * naturally or omit `takeAutomatedAction` entirely.
 */
export interface BotActionResult {
  finalResult: DispatchResult;
  blocked?: { reason: string };
  selectedCandidate?: { family: string };
  fallbackTaken?: string;
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

  canUndo?(playerId: string): boolean;
  undo?(playerId: string, context: DispatchContext, prevStateID?: number): DispatchResult;

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
