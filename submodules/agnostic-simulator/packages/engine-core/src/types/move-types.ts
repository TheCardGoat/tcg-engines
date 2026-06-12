import type { PlayerId } from "./branded.ts";
import type { CtxStatus } from "./match-state.ts";
import type { ZoneVisibility, ZoneRef } from "./zones.ts";
import type { BaseCardMeta } from "./base-card.ts";

export type DeepReadonly<T> = T extends (infer U)[]
  ? readonly DeepReadonly<U>[]
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

export type MoveValidationErrorEnvelope = {
  key: string;
  values: Record<string, unknown>;
};

export type MoveValidationResult =
  | { valid: true }
  | {
      valid: false;
      error: string;
      errorCode: string;
      envelope?: MoveValidationErrorEnvelope;
    };

export interface CardReadAPI {
  get: (cardId: string) => unknown;
  getByIdentifier: (id: string) => unknown;
  getDefinition: (cardId: string) => unknown;
  getMeta: (cardId: string) => BaseCardMeta | undefined;
  getZone: (cardId: string) => string | undefined;
  getOwner: (cardId: string) => PlayerId | undefined;
  getController: (cardId: string) => PlayerId | undefined;
}

export interface CardRuntimeAPI extends CardReadAPI {
  setMeta: (cardId: string, meta: BaseCardMeta) => void;
  patchMeta: (cardId: string, patch: Partial<BaseCardMeta>) => BaseCardMeta;
  clearMeta: (cardId: string) => void;
  registerDefinition: (instanceId: string, definition: unknown, ownerId: PlayerId) => void;
  deregisterDefinition: (instanceId: string) => void;
}

export interface ZoneQueryAPI {
  getCards: (zone: ZoneRef) => string[];
  getCardCount: (zone: ZoneRef) => number;
  getTopCard: (zone: ZoneRef) => string | undefined;
  getBottomCard: (zone: ZoneRef) => string | undefined;
  getCardZone: (cardId: string) => string | undefined;
  getCardOwner: (cardId: string) => PlayerId | undefined;
  getCardController: (cardId: string) => PlayerId | undefined;
  search: (zone: ZoneRef, predicate: (card: unknown) => boolean) => string[];
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
  placeToken: (instanceId: string, zone: ZoneRef, ownerId: PlayerId, meta?: BaseCardMeta) => void;
}

export type ZoneOperationsAPI = ZoneQueryAPI & ZoneMutationAPI;

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

export interface RandomAPI {
  random: () => number;
  shuffle: <T>(array: T[]) => T[];
  rollDie: (sides: number) => number;
  pick: <T>(array: readonly T[]) => T;
}

export interface GameEndResult {
  winner?: string;
  reason: string;
  metadata?: Record<string, unknown>;
}

export interface EventAPI {
  emit: (event: GameEvent) => void;
  endGame: (result: GameEndResult) => void;
}

export interface GameEvent {
  type: string;
  payload?: unknown;
  source?: string;
  targets?: string[];
}

export interface UndoAPI {
  markBarrier: (reason: string) => void;
  hasBarrier: () => boolean;
  getReasons: () => readonly string[];
}

export interface LogEntry {
  type: string;
  message: string;
  playerId?: PlayerId;
  cardIds?: string[];
  data?: Record<string, unknown>;
  visibleTo?: PlayerId[] | "all";
}

/**
 * Game-agnostic move log entry — the common envelope that every engine's
 * typed move-log union should satisfy.
 *
 * Games embed their own discriminated unions (e.g. Lorcana's {@link MoveLog},
 * Gundam's {@link GundamMoveLog}, Cyberpunk's {@link MoveLog}) by extending
 * this base directly or by placing game-specific payload in {@link details}.
 *
 * The platform only relies on the top-level metadata for indexing, replay
 * ordering, and basic display. Game-specific rendering uses the payload.
 */
export interface MoveLogEntry {
  /** Game-specific move type, e.g. "playCard", "attack", "turnStart". */
  type: string;
  /** Player attributed with the action. System logs use the active player. */
  playerId: PlayerId;
  /** Unix ms timestamp when the log was emitted. */
  timestamp: number;
  /** Turn number at the moment the log was emitted. */
  turnNumber: number;
}

export interface StatusAPI {
  readonly snapshot: DeepReadonly<CtxStatus>;
  patch: (patch: Partial<CtxStatus>) => void;
  setPhase: (phase?: string) => void;
  setStep: (step?: string) => void;
  setGameSegment: (segment?: string) => void;
  incrementTurn: (by?: number) => number;
}

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

export type MoveStepOption =
  | {
      readonly kind: "selectTarget";
      readonly role: string;
      readonly candidateIds: readonly string[];
      readonly minTargets: number;
      readonly maxTargets: number;
    }
  | {
      readonly kind: "selectCost";
      readonly costType: string;
      readonly candidateIds: readonly string[];
    }
  | {
      readonly kind: "selectMode";
      readonly modes: readonly { readonly id: string; readonly label: string }[];
    }
  | { readonly kind: "confirm" };

export interface MoveProcedureContext<TGame = object> {
  readonly G: DeepReadonly<TGame>;
  readonly playerId: PlayerId;
  readonly partialInput: DeepReadonly<Record<string, unknown>>;
  readonly cards: CardReadAPI;
  readonly framework: FrameworkReadAPI;
}

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
  readonly G: TGame;
  readonly playerId: PlayerId;
  readonly args: DeepReadonly<TArgs>;
  readonly params: DeepReadonly<TArgs>;
  readonly moveId: string;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
}

export interface MoveDefinition<TArgs = Record<string, never>, TGame = object> {
  available?: (context: MoveEnumerationContext<TGame>) => boolean;
  enumerateCandidates?: (context: MoveEnumerationContext<TGame>) => readonly string[];
  describeProcedure?: (context: MoveProcedureContext<TGame>) => readonly MoveStepOption[];
  validate?: (context: MoveValidationContext<TArgs, TGame>) => MoveValidationResult;
  execute: (context: MoveExecutionContext<TArgs, TGame>) => void;
  undoable?: boolean;
  redactInput?: boolean;
  optimistic?: boolean | "auto";
  ignoreStaleStateID?: boolean;
  serverOnly?: boolean;
  ignoreActivePlayer?: boolean;
  gatedByPendingEffects?: boolean;
}

export type MoveRecord = Record<string, MoveDefinition<any, any>>;
