/**
 * MatchRuntime Utilities
 *
 * Context builders and utility functions.
 */

import type { Draft } from "mutative";
import type { GameEvent, MatchState, MoveInput } from "./types";
import type {
  MatchRuntimeConfig,
  DeepReadonly,
  FrameworkStateSnapshot,
  RuntimeLifecycleContext,
  MoveInputView,
  MoveValidationContext,
  MoveExecutionContext,
  QueryAPI,
  GameEndResult,
  ProjectedLogEntry,
  UndoAPI,
} from "./match-runtime.types";
import type { MatchStaticResources } from "./static-resources";
import type { PlayerId } from "../types";
import { createCardQueryAPIForState, createEventAPI } from "./match-runtime.apis";
import { createTimeQueryAPI, createTimeOperationsForDraft } from "./match-runtime.time-apis";
import { createRandomAPIForDraft } from "./match-runtime.random-apis";
import { createZoneQueryAPI } from "./match-runtime.zone-apis";
import { createZoneOperations } from "./zone-operations";
import { buildZoneRegistry } from "./zone-registry";
import {
  createCardRuntimeAPI,
  createFrameworkReadAPI,
  createFrameworkWriteAPI,
} from "./match-runtime.framework-api";
import type { LorcanaG } from "../../types/runtime-state";
import type { StateScopedValueCache } from "./state-scoped-value-cache";
import {
  isDiscardZoneKey,
  recordCardPutIntoDiscardThisTurn,
} from "../../runtime-moves/state/turn-metrics";

// =============================================================================
// Context Builders
// =============================================================================

export function createFrameworkStateSnapshot(
  state: MatchState | Draft<MatchState>,
  gameEnded: boolean,
): FrameworkStateSnapshot {
  const ctx = state.ctx;

  return {
    priority: ctx.priority,
    status: ctx.status,
    _zonesPrivate: ctx.zones.private,
    _zonesPublic: ctx.zones.public,
    playerIds: ctx.playerIds,
    turn: ctx.status.turn,
    phase: ctx.status.phase,
    step: ctx.status.step,
    gameSegment: ctx.status.gameSegment,
    currentPlayer: ctx.priority.holder as PlayerId | undefined,
    stateID: ctx._stateID,
    matchID: ctx.matchID,
    gameID: ctx.gameID,
    gameEnded: gameEnded || ctx.status.gameEnded,
  };
}

function createMoveInputView<TInput extends MoveInput>(input: TInput): MoveInputView<TInput> {
  const args = input.args;
  return {
    input: input as DeepReadonly<TInput>,
    args: args as DeepReadonly<TInput["args"]>,
    params: args as DeepReadonly<TInput["args"]>,
  };
}

const EMPTY_QUERY_API: QueryAPI = {
  getActionIntents: () => [],
  getLegalActions: () => [],
  explainIllegal: () => undefined,
};

/**
 * Per-runtime caches the context builders thread through to downstream APIs.
 *
 * - `runtimeCard`: optional state-scoped cache for derived-card projections.
 *   `MatchRuntime` owns one and passes it through; ad-hoc callers (tests,
 *   automation) typically omit it and let the cards API rebuild on demand.
 *
 * The static-effect registry is currently a process-wide singleton accessed
 * via {@link defaultRegistryProvider}. A `caches.registry` field intentionally
 * does *not* live on this interface: the downstream APIs that would consume a
 * per-runtime provider (cards / static-ability evaluation / warm-up) all read
 * the singleton today. Adding a field that nothing reads would be misleading.
 * When per-instance ownership is genuinely needed, plumb the provider through
 * the consuming APIs first, then add it back here.
 */
export interface BuildContextCaches {
  runtimeCard?: StateScopedValueCache<unknown>;
}

export interface BuildContextOptions {
  state: MatchState | Draft<MatchState>;
  playerId?: string;
  config: MatchRuntimeConfig;
  staticResources: MatchStaticResources;
  gameEnded: boolean;
  caches?: BuildContextCaches;
  moveLogSink?: (entries: readonly ProjectedLogEntry[]) => void;
}

export interface BuildValidationContextOptions<
  TInput extends MoveInput = MoveInput,
> extends BuildContextOptions {
  state: MatchState;
  playerId: string;
  input: TInput;
  validationMode?: "preflight" | "final";
}

export interface BuildWriteContextOptions extends BuildContextOptions {
  state: Draft<MatchState>;
  emit: (event: GameEvent) => void;
  undo: UndoAPI;
  gameEndTracker: { ended: boolean; result?: GameEndResult };
}

export interface BuildExecutionContextOptions<
  TInput extends MoveInput = MoveInput,
> extends BuildWriteContextOptions {
  playerId: string;
  input: TInput;
}

function createReadContextBase(
  opts: BuildContextOptions & { playerId: string },
): Omit<MoveValidationContext<MoveInput>, keyof MoveInputView> {
  const { state, playerId, config, staticResources, gameEnded } = opts;
  const runtimeCard = opts.caches?.runtimeCard;
  const readState = state as MatchState;
  const zoneRegistry = buildZoneRegistry(config.zones, readState.ctx.playerIds);
  const cardsApi = createCardQueryAPIForState(
    readState,
    staticResources,
    config.deriveRuntimeCard,
    playerId,
    runtimeCard,
    true,
  );
  const frameworkState = createFrameworkStateSnapshot(readState, gameEnded);
  const zones = createZoneQueryAPI(readState, cardsApi, zoneRegistry);
  const time = createTimeQueryAPI(readState);
  const framework = createFrameworkReadAPI(frameworkState, zones, time, cardsApi);

  return {
    G: readState.G as DeepReadonly<LorcanaG>,
    playerId: playerId as PlayerId,
    query: EMPTY_QUERY_API,
    cards: cardsApi,
    framework,
    validationMode: "final",
  };
}

function createWriteContextBase(opts: BuildWriteContextOptions): RuntimeLifecycleContext {
  const {
    state: draft,
    playerId,
    config,
    staticResources,
    gameEnded,
    emit: emitGameEvent,
    gameEndTracker,
    undo,
    moveLogSink,
  } = opts;
  const effectiveGameEnded = gameEnded || draft.ctx.status.gameEnded;
  const zoneRegistry = buildZoneRegistry(config.zones, draft.ctx.playerIds);
  const cardsApi = createCardQueryAPIForState(
    draft,
    staticResources,
    config.deriveRuntimeCard,
    playerId,
    undefined,
    false,
  );
  const cardRuntimeApi = createCardRuntimeAPI(draft, cardsApi);
  const random = createRandomAPIForDraft(draft);
  const zones = createZoneOperations(draft, zoneRegistry, emitGameEvent, {
    cardQuery: cardsApi,
    onUndoBarrier: undo.markBarrier,
    random: random.random,
    onCardEnteredZone: (_cardId, toZone, ownerId) => {
      if (isDiscardZoneKey(toZone)) {
        recordCardPutIntoDiscardThisTurn(
          { G: draft.G as unknown as Pick<LorcanaG, "turnMetadata"> },
          ownerId as PlayerId,
        );
      }
    },
  });
  const time = createTimeOperationsForDraft(draft);
  const events = createEventAPI(emitGameEvent, draft, gameEndTracker);
  const frameworkState = createFrameworkStateSnapshot(draft, effectiveGameEnded);
  const framework = createFrameworkWriteAPI(
    draft,
    frameworkState,
    zones,
    time,
    random,
    events,
    undo,
    cardRuntimeApi,
    moveLogSink,
  );

  return {
    G: draft.G,
    playerId: playerId as PlayerId | undefined,
    query: EMPTY_QUERY_API,
    cards: cardRuntimeApi,
    framework,
  };
}

export function buildValidationContext<TInput extends MoveInput = MoveInput>(
  opts: BuildValidationContextOptions<TInput>,
): MoveValidationContext<TInput> {
  const base = createReadContextBase(opts);
  return {
    ...base,
    validationMode: opts.validationMode ?? "final",
    ...createMoveInputView(opts.input),
  };
}

export function buildLifecycleContext(opts: BuildWriteContextOptions): RuntimeLifecycleContext {
  return createWriteContextBase({
    ...opts,
    playerId: opts.playerId ?? opts.state.ctx.priority.holder,
  });
}

export function buildExecutionContext<TInput extends MoveInput = MoveInput>(
  opts: BuildExecutionContextOptions<TInput>,
): MoveExecutionContext<TInput> {
  const lifecycleContext = buildLifecycleContext(opts);
  return {
    playerId: opts.playerId as PlayerId,
    ...lifecycleContext,
    ...createMoveInputView(opts.input),
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

export function generateMatchID(): string {
  return `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateGameID(): string {
  return `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function computeRulesetHash(config: MatchRuntimeConfig): string {
  // Simplified - would hash game definition in real implementation
  return `ruleset-${config.name}-${Date.now()}`;
}

export function inferQueryPlayerId(state: MatchState): string | undefined {
  return state.ctx.priority.holder;
}
