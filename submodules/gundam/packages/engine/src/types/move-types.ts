import type { Card } from "@tcg/gundam-types";
import type { PlayerId } from "./branded.ts";
import type { RuntimeCard } from "./base-card.ts";
import type { ZoneVisibility, ZoneRef } from "./zone-types.ts";
import type { CtxStatus } from "./match-state.ts";
import type {
  DeepReadonly,
  MoveValidationResult,
  MoveStepOption,
  RandomAPI,
  EventAPI,
  UndoAPI,
} from "@tcg/engine-core";

export type {
  DeepReadonly,
  MoveValidationErrorEnvelope,
  MoveValidationResult,
  MoveStepOption,
  RandomAPI,
  GameEndResult,
  EventAPI,
  GameEvent,
  UndoAPI,
} from "@tcg/engine-core";

// --- Card APIs ---
export interface CardReadAPI {
  get: (cardId: string) => RuntimeCard | undefined;
  getByIdentifier: (id: string) => RuntimeCard | undefined;
  getDefinition: (cardId: string) => Card | undefined;
  getMeta: (cardId: string) => import("./base-card.ts").BaseCardMeta | undefined;
  getZone: (cardId: string) => string | undefined;
  getOwner: (cardId: string) => PlayerId | undefined;
  getController: (cardId: string) => PlayerId | undefined;
}

export interface CardRuntimeAPI extends CardReadAPI {
  setMeta: (cardId: string, meta: import("./base-card.ts").BaseCardMeta) => void;
  patchMeta: (
    cardId: string,
    patch: Partial<import("./base-card.ts").BaseCardMeta>,
  ) => import("./base-card.ts").BaseCardMeta;
  clearMeta: (cardId: string) => void;
  registerDefinition: (instanceId: string, definition: Card, ownerId: PlayerId) => void;
  deregisterDefinition: (instanceId: string) => void;
}

// --- Zone APIs ---
export interface ZoneQueryAPI {
  getCards: (zone: ZoneRef) => string[];
  getCardCount: (zone: ZoneRef) => number;
  getTopCard: (zone: ZoneRef) => string | undefined;
  getBottomCard: (zone: ZoneRef) => string | undefined;
  getCardZone: (cardId: string) => string | undefined;
  getCardOwner: (cardId: string) => PlayerId | undefined;
  getCardController: (cardId: string) => PlayerId | undefined;
  search: (zone: ZoneRef, predicate: (card: RuntimeCard) => boolean) => string[];
  isOrdered: (zone: ZoneRef) => boolean;
  getVisibility: (zone: ZoneRef) => ZoneVisibility;
}

export interface ZoneMutationAPI {
  moveCard: (
    cardId: string,
    toZone: ZoneRef,
    options?: { index?: number; faceDown?: boolean },
  ) => void;
  moveCards: (cardIds: string[], toZone: ZoneRef) => void;
  drawCards: (params: { from: ZoneRef; to: ZoneRef; count: number }) => string[];
  drawSpecificCard: (cardId: string, from: ZoneRef, to: ZoneRef) => boolean;
  mill: (from: ZoneRef, to: ZoneRef, count: number) => string[];
  shuffle: (zone: ZoneRef) => void;
  reveal: (
    cardIds: string[],
    visibleTo: "all" | string[],
    options?: { stateID?: number },
  ) => string;
  revealTop: (zone: ZoneRef, count: number, visibleTo: "all" | string[]) => string[];
  clearReveal: (revealId: string) => void;
  placeToken: (
    instanceId: string,
    zone: ZoneRef,
    ownerId: PlayerId,
    meta?: import("./base-card.ts").BaseCardMeta,
  ) => void;
}

export type ZoneOperationsAPI = ZoneQueryAPI & ZoneMutationAPI;

// --- Time APIs ---
export interface TimeQueryAPI {
  getPlayerTime: (playerId: PlayerId) => { reserveMsRemaining: number; totalConsumedMs: number };
  getMode: () => string;
  getActivePlayerId: () => string | undefined;
  getTimeoutStatus: (playerId: PlayerId, now?: number) => "first" | "second" | null;
  isInNegativeTime: (playerId: PlayerId) => boolean;
}

export interface TimeOperationsAPI extends TimeQueryAPI {
  consumeTime: (playerId: PlayerId, ms: number) => void;
  addTime: (playerId: PlayerId, ms: number) => void;
  pauseClock: (playerId: PlayerId) => void;
  resumeClock: (playerId: PlayerId) => void;
  resetPlayerTimeAfterSkip: (playerId: PlayerId, resetMs?: number) => void;
}

// --- Log API ---
export interface LogEntry {
  type: string;
  message: string;
  playerId?: PlayerId;
  cardIds?: string[];
  data?: Record<string, unknown>;
  /**
   * Visibility scope. Matches the storage-layer `GameLogEntry.visibleTo`:
   *   - omitted (undefined) — treated as public, same as `"all"`
   *   - `"all"`              — explicit public sentinel
   *   - `PlayerId[]`         — private, narrowed to the listed players
   *
   * Per-game-domain visibility models (e.g., the Gundam `LogVisibility`
   * union with PUBLIC / PRIVATE / PUBLIC_WITH_OVERRIDES) should translate
   * to this field when emitting. Richer modes (such as per-viewer
   * overrides) are preserved under `data` for the UI to interpret.
   */
  visibleTo?: PlayerId[] | "all";
}

// --- Status API ---
export interface StatusAPI {
  readonly snapshot: DeepReadonly<CtxStatus>;
  patch: (patch: Partial<CtxStatus>) => void;
  setPhase: (phase?: string) => void;
  setStep: (step?: string) => void;
  setGameSegment: (segment?: string) => void;
  incrementTurn: (by?: number) => number;
}

// --- Framework APIs ---
export interface FrameworkStateSnapshot {
  readonly status: DeepReadonly<CtxStatus>;
  readonly stateID: number;
  readonly playerIds: readonly PlayerId[];
}

export interface FrameworkReadAPI {
  readonly state: FrameworkStateSnapshot;
  readonly zones: ZoneQueryAPI;
  readonly time: TimeQueryAPI;
  readonly cards: CardReadAPI;
}

export interface FrameworkWriteAPI extends FrameworkReadAPI {
  readonly zones: ZoneOperationsAPI;
  readonly time: TimeOperationsAPI;
  readonly random: RandomAPI;
  readonly events: EventAPI;
  readonly undo: UndoAPI;
  readonly cards: CardRuntimeAPI;
  readonly log: (entry: LogEntry | readonly LogEntry[]) => void;
  readonly status: StatusAPI;
}

// --- Move Procedure (UI) ---
export interface MoveProcedureContext<TGame = object> {
  readonly G: DeepReadonly<TGame>;
  readonly playerId: PlayerId;
  readonly partialInput: DeepReadonly<Record<string, unknown>>;
  readonly cards: CardReadAPI;
  readonly framework: FrameworkReadAPI;
}

// --- Move Contexts ---
export interface MoveEnumerationContext<TGame = object> {
  readonly G: DeepReadonly<TGame>;
  readonly playerId: PlayerId;
  readonly cards: CardReadAPI;
  readonly framework: FrameworkReadAPI;
}

export interface MoveValidationContext<TArgs = Record<string, never>, TGame = object> {
  readonly G: DeepReadonly<TGame>;
  readonly playerId: PlayerId;
  readonly args: DeepReadonly<TArgs>;
  readonly params: DeepReadonly<TArgs>;
  readonly validationMode: "preflight" | "final";
  readonly cards: CardReadAPI;
  readonly framework: FrameworkReadAPI;
}

export interface MoveExecutionContext<TArgs = Record<string, never>, TGame = object> {
  readonly G: TGame; // Draft<TGame> at runtime
  readonly playerId: PlayerId;
  readonly args: DeepReadonly<TArgs>;
  readonly params: DeepReadonly<TArgs>;
  /**
   * The originating `CommandEnvelope.commandID`. Game-domain code can
   * use it to correlate side effects (queued pending effects, logs,
   * events) with the move that produced them — see
   * `PendingEffect.originatingMoveId` for the Gundam usage.
   */
  readonly moveId: string;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
}

// --- Move Definition ---
export interface MoveDefinition<TArgs = Record<string, never>, TGame = object> {
  available?: (context: MoveEnumerationContext<TGame>) => boolean;
  /**
   * Returns the card instance IDs that can serve as the primary selection
   * for this move in the current state. Used by the UI-facing query
   * `enumerateAvailableMovesDetailed` to power card highlighting.
   *
   * Moves that take no card (e.g. `passTurn`, `concede`) should omit this
   * hook; the detailed enumerator treats the absence as "no per-card
   * selection required".
   */
  enumerateCandidates?: (context: MoveEnumerationContext<TGame>) => readonly string[];
  /**
   * Describe the next-step options for a move once a primary selection has
   * been made. Used by the UI-facing `getMoveProcedure` query to drive
   * multi-step pickers (choose target, choose cost, choose mode, confirm).
   *
   * `partialInput` carries whatever the client has accumulated so far — the
   * hook decides what the next decision is based on that shape.
   */
  describeProcedure?: (context: MoveProcedureContext<TGame>) => readonly MoveStepOption[];
  validate?: (context: MoveValidationContext<TArgs, TGame>) => MoveValidationResult;
  execute: (context: MoveExecutionContext<TArgs, TGame>) => void;
  undoable?: boolean;
  redactInput?: boolean;
  optimistic?: boolean | "auto";
  ignoreStaleStateID?: boolean;
  serverOnly?: boolean;
  /**
   * Opt out of the runtime's active-player gate. Use sparingly: moves that
   * legitimately need this are out-of-band (e.g. `concede`, which either
   * player must always be allowed to submit). Priority-shifting flows
   * (effect resolution, responses) should instead keep `activePlayer`
   * synced to the player who currently holds priority — the runtime gate
   * then admits the correct actor without a blanket bypass.
   */
  ignoreActivePlayer?: boolean;
  /**
   * When true, the runtime rejects this move with `EFFECT_PENDING`
   * whenever the game state's `pendingEffects` queue is non-empty (rule
   * 5-2 / 10-1-6). The gate is enforced uniformly by `validateCommand`
   * and the candidate enumerators — moves with this flag do not need to
   * repeat the check in their own `available` / `validate` hooks.
   *
   * Read by the framework as `(state.G as { pendingEffects?: readonly
   * unknown[] }).pendingEffects?.length > 0` so the framework layer
   * stays decoupled from the Gundam-specific `GundamG` shape.
   */
  gatedByPendingEffects?: boolean;
}

export type MoveRecord = Record<string, MoveDefinition<any, any>>;
