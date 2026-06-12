/**
 * MatchRuntime Types
 *
 * All type definitions for the match runtime module.
 */

import type { Draft } from "mutative";
import type {
  MatchState,
  GameEvent,
  PublishedGameEvent,
  LogMessage,
  MoveInput,
  CommandEnvelope,
  PacketAnimation,
  TimeControlConfig,
  RuntimeValidationResult,
  ViewRoleContext,
  FilteredMatchView,
  TCGCtx,
  CtxStatus,
  CtxPriority,
  ZoneRuntimeState,
} from "./types";
import type { PlayerId } from "../types";
import type { LorcanaGameLogEntry } from "../../types/log-messages";
import type { ZoneOperationsAPI, ZoneQueryAPI } from "./zone-operations";
import type { CardQueryAPI, RuntimeCardDeriver } from "./card-runtime";
import type { CardCatalog, CardsMaps, MatchStaticResources } from "./static-resources";
import type { BaseCardMeta } from "./card-contracts";
import type { EngineMoveId } from "../engine/contracts";
import type { LorcanaG } from "../../types/runtime-state";

/**
 * A record of named move definitions.
 *
 * The `any` type parameters are intentional and unavoidable: `MoveRecord` is a heterogeneous
 * container of move functions each with distinct `args` types. TypeScript's function-parameter
 * contravariance makes it impossible to express this without `any` — `unknown` breaks
 * definition-side assignability and `never` breaks call-site invocations.
 * Type safety is enforced at the definition boundary (LorcanaMoveDefinition) and at specific
 * call sites, not at the collection level.
 */
// oxlint-disable-next-line no-explicit-any
export type MoveRecord = Record<string, MoveDefinition<any, any>>;

// =============================================================================
// Runtime Configuration
// =============================================================================

export interface RuntimeBoardProjectionContext {
  serverTimestamp: number;
  runtimeCardCache?: import("./state-scoped-value-cache").StateScopedValueCache<unknown>;
}

interface MatchRuntimeConfigCore {
  name: string;
  moves: MoveRecord;
  flow: RuntimeFlowDefinition;
  timeControl?: TimeControlConfig;
  zones: ZoneDefinitions;
  playerView: (state: MatchState, roleCtx: ViewRoleContext) => FilteredMatchView;
  projectBoard: (
    state: MatchState,
    roleCtx: ViewRoleContext,
    staticResources: MatchStaticResources,
    projectionCtx?: RuntimeBoardProjectionContext,
  ) => FilteredMatchView;
  deriveRuntimeCard: RuntimeCardDeriver;
  // TODO: Setup should also include ctx
  setup: (args: SetupArgs) => LorcanaG;
  /** Optional one-time hook to populate zones (e.g. put all instances into deck). Runs after setup, inside Mutative create. */
  boardSetup?: (draft: Draft<MatchState>, ctx: BoardSetupContext) => void;
  derivePacketAnimations?: (context: PacketAnimationContext) => readonly PacketAnimation[];
}

export type MatchRuntimeConfig = MatchRuntimeConfigCore;

export interface SetupArgs {
  players: Player[];
  seed?: string;
  staticResources: MatchStaticResources;
}

export interface BoardSetupContext {
  players: Player[];
  staticResources: MatchStaticResources;
  random: RandomAPI;
}

export interface LogProjectionContext {
  state: MatchState;
}

export interface PacketAnimationContext {
  command: CommandEnvelope;
  playerId: string;
  role: RuntimeActorRole;
  previousState: MatchState;
  nextState: MatchState;
  staticResources: MatchStaticResources;
}

export type ProjectedLogEntry = {
  category: "action" | "rules" | "system";
  visibility: import("./types").LogVisibility;
  defaultMessage?: LogMessage;
  typedEntry?: LorcanaGameLogEntry;
};

export interface Player {
  id: string;
  name?: string;
}

export type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends string | number | boolean | bigint | symbol | undefined | null
    ? T
    : T extends readonly (infer U)[]
      ? readonly DeepReadonly<U>[]
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

export interface RuntimeStateView {
  readonly G: DeepReadonly<LorcanaG>;
  readonly ctx: DeepReadonly<TCGCtx>;
  readonly playerId: PlayerId;
  readonly playerIds: PlayerId[];
  readonly turn: number;
  readonly phase?: string;
  readonly step?: string;
  readonly gameSegment?: string;
  readonly currentPlayer?: PlayerId;
  readonly stateID: number;
  readonly matchID: string;
  readonly gameID: string;
  readonly gameEnded: boolean;
}

export interface RuntimeLifecycleContext {
  readonly G: Draft<LorcanaG>;
  readonly playerId?: PlayerId;
  readonly query: QueryAPI;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
}

export type RuntimeLifecycleHook =
  | ((context: RuntimeLifecycleContext) => unknown)
  | ((state: MatchState) => MatchState | void);

export type MoveStateView = RuntimeStateView;

export interface MoveInputView<TInput extends MoveInput = MoveInput> {
  readonly input: DeepReadonly<TInput>;
  readonly args: DeepReadonly<TInput["args"]>;
  readonly params: DeepReadonly<TInput["args"]>;
}

export interface FrameworkStateSnapshot {
  readonly priority: DeepReadonly<CtxPriority>;
  readonly status: DeepReadonly<CtxStatus>;
  /** @internal Projection layer only — do not use in move handlers. */
  readonly _zonesPrivate: DeepReadonly<ZoneRuntimeState["private"]>;
  /** @internal Public zone summaries (card counts). Available on both server and client. */
  readonly _zonesPublic: DeepReadonly<ZoneRuntimeState["public"]>;
  readonly playerIds: PlayerId[];
  readonly turn: number;
  readonly phase?: string;
  readonly step?: string;
  readonly gameSegment?: string;
  readonly currentPlayer?: PlayerId;
  readonly stateID: number;
  readonly matchID: string;
  readonly gameID: string;
  readonly gameEnded: boolean;
}

export interface CardRuntimeReadAPI extends CardQueryAPI {}

export interface CardRuntimeAPI extends CardRuntimeReadAPI {
  setMeta: (cardId: string, meta: BaseCardMeta) => void;
  patchMeta: (cardId: string, patch: Partial<BaseCardMeta>) => BaseCardMeta;
  clearMeta: (cardId: string) => void;
  entriesMeta: () => readonly (readonly [cardId: string, meta: BaseCardMeta])[];
}

export interface FrameworkReadAPI {
  readonly state: FrameworkStateSnapshot;
  readonly zones: ZoneQueryAPI;
  readonly time: TimeQueryAPI;
  readonly cards: CardRuntimeReadAPI;
}

export type UndoBarrierReason =
  | "draw"
  | "mill"
  | "mulligan"
  | "reveal"
  | "look-hidden-zone"
  | "search-hidden-zone";

export interface UndoAPI {
  markBarrier: (reason: UndoBarrierReason) => void;
  hasBarrier: () => boolean;
  getReasons: () => readonly UndoBarrierReason[];
}

export interface FrameworkWriteAPI extends FrameworkReadAPI {
  readonly zones: ZoneOperationsAPI;
  readonly time: TimeOperationsAPI;
  readonly random: RandomAPI;
  readonly events: EventAPI;
  readonly undo: UndoAPI;
  readonly status: {
    readonly snapshot: DeepReadonly<CtxStatus>;
    patch: (patch: Partial<CtxStatus>) => void;
    setPhase: (phase?: string) => void;
    setStep: (step?: string) => void;
    setGameSegment: (segment?: string) => void;
    incrementTurn: (by?: number) => number;
  };
  readonly priority: {
    readonly snapshot: DeepReadonly<CtxPriority>;
    patch: (patch: Partial<CtxPriority>) => void;
    setHolder: (playerId?: PlayerId) => void;
    openWindow: (holder?: PlayerId) => void;
    closeWindow: () => void;
    resetPasses: () => void;
  };
  readonly cards: CardRuntimeAPI;
  readonly log: (entry: ProjectedLogEntry | readonly ProjectedLogEntry[]) => void;
  logPublicWithOverrides(entry: {
    category: ProjectedLogEntry["category"];
    defaultMessage: LogMessage;
    overrides?: Record<string, LogMessage>;
  }): void;
}

export interface MoveValidationContext<
  TInput extends MoveInput = MoveInput,
> extends MoveInputView<TInput> {
  readonly G: DeepReadonly<LorcanaG>;
  readonly playerId: PlayerId;
  readonly validationMode: "preflight" | "final";
  readonly query: QueryAPI;
  readonly cards: CardRuntimeReadAPI;
  readonly framework: FrameworkReadAPI;
}

export interface MoveExecutionContext<
  TInput extends MoveInput = MoveInput,
> extends MoveInputView<TInput> {
  readonly G: Draft<LorcanaG>;
  readonly playerId: PlayerId;
  readonly query: QueryAPI;
  readonly cards: CardRuntimeAPI;
  readonly framework: FrameworkWriteAPI;
}

export interface MoveEnumerationContext {
  readonly G: DeepReadonly<LorcanaG>;
  readonly playerId: PlayerId;
  readonly query: QueryAPI;
  readonly cards: CardRuntimeReadAPI;
  readonly framework: FrameworkReadAPI;
}

export interface QueryAPI {
  getActionIntents: () => readonly unknown[];
  getLegalActions: () => readonly unknown[];
  explainIllegal: () => string | undefined;
}

export interface MoveDefinition<TInput extends MoveInput = MoveInput, TTargetDSL = unknown> {
  available?: (context: MoveEnumerationContext) => boolean;
  validate?: (context: MoveValidationContext<TInput>) => RuntimeValidationResult;
  execute: (context: MoveExecutionContext<TInput>) => void;
  undoable?: boolean;
  redactInput?: boolean;
  optimistic?: boolean | "auto";
  ignoreStaleStateID?: boolean;
  serverOnly?: boolean;
  ignorePriority?: boolean;
}

export type RuntimeMoveInputMap<Moves extends MoveRecord> = {
  [K in keyof Moves]: Moves[K] extends MoveDefinition<infer TInput, any> ? TInput : MoveInput;
};

export type RuntimeLegalMove<Moves extends MoveRecord> = EngineMoveId<RuntimeMoveInputMap<Moves>>;

export type RuntimeActorRole = "player" | "judge";

export type MoveContext<TInput extends MoveInput = MoveInput> = MoveExecutionContext<TInput>;

export interface MatchRuntimeInit {
  players: Player[];
  cardsMaps: CardsMaps;
  cardCatalog: CardCatalog;
  capturePatches?: boolean;
  seed?: string;
  matchID?: string;
  gameID?: string;
  choosingFirstPlayer?: string;
  /**
   * When true, skip `initializeMatchState()` and static resource building.
   * Used by the deserialization path that will immediately call `loadState()`.
   * Must be paired with `_prebuiltStaticResources`.
   */
  _skipInitialization?: boolean;
  /** Pre-built static resources — avoids rebuilding from cardsMaps when `_skipInitialization` is set. */
  _prebuiltStaticResources?: MatchStaticResources;
}

/** Runtime step definition for steps within phases. */
export interface RuntimeStepDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: RuntimeLifecycleHook;
  onExit?: RuntimeLifecycleHook;
  endIf?: (state: MatchState) => boolean;
  next?: string;
  validMoves?: string[];
}

/** Runtime turn definition for turn structure within game segments. */
export interface RuntimeTurnDefinition {
  initialPhase?: string;
  onBegin?: RuntimeLifecycleHook;
  onEnd?: RuntimeLifecycleHook;
  endIf?: (state: MatchState) => boolean;
  phases: Record<string, RuntimePhaseDefinition>;
  validMoves?: string[];
}

/** Runtime game segment definition for high-level game divisions. */
export interface RuntimeGameSegmentDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: RuntimeLifecycleHook;
  onExit?: RuntimeLifecycleHook;
  endIf?: (state: MatchState) => GameEndResult | undefined;
  validMoves?: string[];
  next?: string;
  turn: RuntimeTurnDefinition;
}

export type RuntimeFlowDefinition = {
  gameSegments: Record<string, RuntimeGameSegmentDefinition>;
  initialGameSegment?: string;
};

export interface RuntimePhaseDefinition {
  id: string;
  name: string;
  order: number;
  onEnter?: RuntimeLifecycleHook;
  onExit?: RuntimeLifecycleHook;
  validMoves?: string[];
  endIf?: (state: MatchState) => boolean | string;
  nextPhase?: string | ((state: MatchState) => string);
  steps?: Record<string, RuntimeStepDefinition>;
  next?: string;
}

export interface GameEndResult {
  winner?: string;
  reason: string;
  metadata?: Record<string, unknown>;
}

export interface ZoneDefinitions {
  [zoneId: string]: ZoneConfig;
}

export interface ZoneConfig {
  id: string;
  name: string;
  visibility: "public" | "private" | "secret";
  ordered: boolean;
  ownerScoped: boolean;
  faceDown?: boolean;
  maxSize?: number;
}

// Re-export ZoneOperationsAPI from zone-operations for convenience
export type { ZoneOperationsAPI, ZoneQueryAPI, ZoneMutationAPI } from "./zone-operations";

// Re-export view-related types from types.ts
export type { ViewRoleContext, FilteredMatchView } from "./types";

export interface TimeQueryAPI {
  getRemainingTime: (playerId: string) => number;
}

export interface TimeOperationsAPI extends TimeQueryAPI {
  pause: (reason: string) => void;
  resume: () => void;
}

export interface RandomAPI {
  random: () => number;
  shuffle: <T>(array: T[]) => T[];
}

export interface EventAPI {
  emit: (event: GameEvent) => void;
  endGame: (result: GameEndResult) => void;
}

// =============================================================================
// Command Result Types
// =============================================================================

export type CommandResult<T = unknown> = CommandSuccess<T> | CommandFailure;

export interface CommandSuccess<T> {
  success: true;
  stateID: number;
  state: MatchState;
  patches: import("mutative").Patch[];
  gameEvents: PublishedGameEvent[];
  /** Unified move log entries produced by this command. */
  moveLogs?: import("../../types/move-log").MoveLog[];
  processedCommand: CommandEnvelope;
  animations: PacketAnimation[];
  undoable: boolean;
}

export interface RuntimeSnapshot {
  publishedGameEventsLength: number;
  moveLogHistoryLength: number;
  nextGameEventSeq: number;
  gameEnded: boolean;
  gameEndResult?: GameEndResult;
}

export interface CommandFailure {
  success: false;
  error: string;
  errorCode: string;
  currentStateID: number;
}
