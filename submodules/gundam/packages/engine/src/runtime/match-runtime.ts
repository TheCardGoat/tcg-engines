/**
 * MatchRuntime — The core match runtime class that manages game state
 * and processes commands for the Gundam TCG engine.
 */

import { create, type Draft, type Patches } from "mutative";

import type { PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type {
  CommandEnvelope,
  CommandResult,
  CommandSuccess,
  CommandFailure,
} from "../types/command.ts";
import type {
  FrameworkReadAPI,
  FrameworkWriteAPI,
  FrameworkStateSnapshot,
  LogEntry,
  DeepReadonly,
  CardReadAPI,
  CardRuntimeAPI,
  ZoneQueryAPI,
  TimeQueryAPI,
  TimeOperationsAPI,
  RandomAPI,
  EventAPI,
  UndoAPI,
  StatusAPI,
  GameEndResult,
  MoveValidationResult,
} from "../types/move-types.ts";
import type {
  GameEvent as MoveGameEvent,
  MoveValidationErrorEnvelope,
} from "../types/move-types.ts";
import type { PacketAnimation } from "../types/animation.ts";
import type { PublishedGameEvent, GameLogEntry } from "../types/game-events.ts";
import type { ViewRoleContext, FilteredMatchView } from "../types/projection.ts";
import type { MoveHistoryEntry } from "../types/history.ts";
import type { GundamMoveLog } from "../types/move-log.ts";

import type { MatchStaticResources, Player } from "./static-resources.ts";
import { initializeMatchState } from "./match-runtime.init.ts";
import { validateCommand } from "./match-runtime.validation.ts";
import { resolveFlowTransitions, type LifecycleContextBuilder } from "./match-runtime.flow.ts";
import { enumerateAvailableMoves } from "./match-runtime.queries.ts";
import { createZoneOperations } from "./zone-operations.ts";
import {
  createCardReadAPI,
  createCardRuntimeAPI,
  type DeriveRuntimeCardFn,
} from "./card-runtime.ts";
import { createRandomAPI } from "./random.ts";

import type { GundamBoardView, GundamG, PendingChoicePrompt } from "../gundam/types.ts";
import { projectGundamBoardView } from "../gundam/projection/project-board.ts";
import { gundamZones } from "../gundam/zones.ts";
import { gundamFlow } from "../gundam/flow.ts";
import { getGundamMoveDefinition, isGundamMoveName } from "../gundam/moves/move-name.ts";
import { deriveGundamRuntimeCard } from "../gundam/config.ts";
import { filterMatchView } from "./view-filter.ts";
import { checkTimeout, settleClocks, updateClockForWaitingState } from "./time-control.ts";
import { projectGundamMoveLogs } from "./move-log-factory.ts";

// ── Supporting types ───────────────────────────────────────────────────────

export interface SetupArgs {
  players: Player[];
  seed: string;
  staticResources: MatchStaticResources;
}

export interface BoardSetupContext {
  players: Player[];
  staticResources: MatchStaticResources;
}

export interface PacketAnimationContext {
  prevState: MatchState<GundamG>;
  nextState: MatchState<GundamG>;
  command: CommandEnvelope;
  patches: Patches;
  gameEvents: PublishedGameEvent[];
}

export interface BoardProjectionContext {
  animationFrame?: number;
  interpolationT?: number;
}

// ── MatchRuntime class ─────────────────────────────────────────────────────

export class MatchRuntime {
  private staticResources: MatchStaticResources;

  public state!: MatchState<GundamG>;
  public commandHistory: CommandEnvelope[] = [];
  public undoStack: {
    state: MatchState<GundamG>;
    command: CommandEnvelope;
    playerId: PlayerId;
    moveLogCount: number;
  }[] = [];
  public undoBarriers: string[] = [];
  public moveHistory: MoveHistoryEntry[] = [];
  public moveLogHistory: GundamMoveLog[] = [];

  private eventCounter = 0;
  private logCounter = 0;

  // UI subscription handlers. Fired synchronously after each successful
  // state transition (executeCommand, undo, runTestMutation).
  private stateUpdateHandlers: Set<(stateId: number) => void> = new Set();
  private gameEventHandlers: Set<{
    filter?: (event: PublishedGameEvent) => boolean;
    handler: (event: PublishedGameEvent) => void;
  }> = new Set();

  constructor(staticResources: MatchStaticResources) {
    this.staticResources = staticResources;
  }

  /**
   * Read-only access to the static resources this runtime was initialized
   * with. Needed by the automation package's candidate enumerator and by
   * any external driver that wants to call
   * `enumerateAvailableMovesDetailed` / `getMoveProcedure` directly
   * against the runtime's state. Intentionally returns the same reference
   * — no cloning — because `MatchStaticResources` is already designed to
   * be shared (card catalogs + static maps never mutate).
   */
  getStaticResources(): MatchStaticResources {
    return this.staticResources;
  }

  // ── Initialization ─────────────────────────────────────────────────────

  initialize(
    players: Player[],
    seed?: string,
    initialActivePlayer?: string,
    timeConfig?: import("../types/match-state.ts").TimeControlConfig,
  ): void {
    const actualSeed = seed ?? `${Date.now()}-${Math.random()}`;
    this.state = initializeMatchState(
      players,
      this.staticResources,
      actualSeed,
      initialActivePlayer,
      timeConfig,
    );
    this.commandHistory = [];
    this.undoStack = [];
    this.undoBarriers = [];
    this.moveHistory = [];
    this.moveLogHistory = [];
    this.eventCounter = 0;
    this.logCounter = 0;
  }

  /**
   * Restore a previously-captured state into this runtime. Used for
   * SSR hydration and persisted-match replay — the server (or store)
   * builds a MatchRuntime via `initialize`, captures `getState()` +
   * optional auxiliary fields via serialization, and the client
   * reconstructs the runtime shell + calls `loadState` with the
   * rehydrated data.
   *
   * The auxiliary fields (commandHistory, undoStack, moveHistory,
   * counters) are optional: a freshly-initialized match only needs
   * `state` to re-render identically. Persisted matches that want
   * to preserve undo history or the log stream supply the rest.
   *
   * Fires `onStateUpdate` subscribers after assignment so UIs
   * already bound to this runtime re-render with the new state.
   * Pass `silent: true` to skip the notify — appropriate for the
   * post-construct hydration case (no subscribers yet) where the
   * extra notification is harmless but also pointless.
   */
  loadState(
    state: MatchState<GundamG>,
    options: {
      commandHistory?: readonly CommandEnvelope[];
      undoStack?: readonly {
        state: MatchState<GundamG>;
        command: CommandEnvelope;
        playerId: PlayerId;
        moveLogCount?: number;
      }[];
      undoBarriers?: readonly string[];
      moveHistory?: readonly MoveHistoryEntry[];
      moveLogHistory?: readonly GundamMoveLog[];
      eventCounter?: number;
      logCounter?: number;
      silent?: boolean;
    } = {},
  ): void {
    this.state = state;
    this.commandHistory = options.commandHistory ? [...options.commandHistory] : [];
    this.undoStack = options.undoStack
      ? options.undoStack.map((e) => ({ ...e, moveLogCount: e.moveLogCount ?? 0 }))
      : [];
    this.undoBarriers = options.undoBarriers ? [...options.undoBarriers] : [];
    this.moveHistory = options.moveHistory ? [...options.moveHistory] : [];
    this.moveLogHistory = options.moveLogHistory ? [...options.moveLogHistory] : [];
    this.eventCounter = options.eventCounter ?? 0;
    this.logCounter = options.logCounter ?? 0;
    if (!options.silent) {
      this.notifyStateUpdate();
    }
  }

  // ── Command execution ──────────────────────────────────────────────────

  executeCommand(envelope: CommandEnvelope, playerId: PlayerId): CommandResult {
    const timestamp = Date.now();
    // 1. Validate the command
    const validation = validateCommand(envelope, playerId, this.state as MatchState);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.errorCode,
        currentStateID: this.state.ctx._stateID,
        ...(validation.envelope ? { envelope: validation.envelope } : {}),
      } satisfies CommandFailure;
    }

    // `validateCommand` above already rejected unknown move names; the
    // `isGundamMoveName` narrowing satisfies the typed registry lookup
    // without re-running the catalog check.
    if (!isGundamMoveName(envelope.move)) {
      return {
        success: false,
        error: `Unknown move: ${envelope.move}`,
        errorCode: "UNKNOWN_MOVE",
        currentStateID: this.state.ctx._stateID,
      } satisfies CommandFailure;
    }
    const moveDef = getGundamMoveDefinition(envelope.move);
    const previousTime = this.state.ctx.time;
    const previousActivePlayerID =
      previousTime.mode !== "none" ? previousTime.activePlayerID : undefined;
    if (this.state.ctx.time.mode !== "none") {
      this.state = settleClocks(this.state, timestamp);
    }
    const prevState = this.state;

    // Collectors for events and logs emitted during execution
    const gameEvents: PublishedGameEvent[] = [];
    const logEntries: GameLogEntry[] = [];
    const undoBarriersCollected: string[] = [];

    try {
      // 2. Use mutative create() to produce next state + patches
      const [draftNextState, patches] = create(
        this.state,
        (draft) => {
          // Build framework APIs on top of the draft
          const frameworkWrite = this.buildFrameworkWriteAPI(
            draft as Draft<MatchState<GundamG>>,
            playerId,
            gameEvents,
            logEntries,
            undoBarriersCollected,
            timestamp,
          );

          const cardRuntimeAPI = this.buildCardRuntimeAPI(draft as Draft<MatchState<GundamG>>);

          // 3. Call move.validate in final mode if present
          if (moveDef.validate) {
            const cardReadAPI = this.buildCardReadAPI(draft as Draft<MatchState<GundamG>>);
            const frameworkRead = this.buildFrameworkReadAPI(
              draft as Draft<MatchState<GundamG>>,
              timestamp,
            );

            const valResult = moveDef.validate({
              G: draft.G as DeepReadonly<GundamG>,
              playerId,
              args: envelope.args,
              params: envelope.args,
              validationMode: "final",
              cards: cardReadAPI,
              framework: frameworkRead,
            });
            if (!valResult.valid) {
              throw new MoveValidationError(
                valResult.error,
                valResult.errorCode,
                valResult.envelope,
              );
            }
          }

          // 4. Execute the move
          moveDef.execute({
            G: draft.G as GundamG,
            playerId,
            args: envelope.args,
            params: envelope.args,
            moveId: envelope.commandID,
            cards: cardRuntimeAPI,
            framework: frameworkWrite,
          });

          // 5. Resolve flow transitions after the move, providing framework context
          // so that lifecycle hooks (onEnter, onExit, etc.) can perform zone
          // operations, draw cards, place tokens, etc. — following the same
          // pattern as Lorcana where hooks own automatic game actions.
          const buildCtx: LifecycleContextBuilder = () => ({
            G: draft.G as object,
            framework: frameworkWrite,
            cards: cardRuntimeAPI,
          });
          resolveFlowTransitions(draft as Draft<MatchState>, gundamFlow, buildCtx);

          // 6. Increment state ID
          draft.ctx._stateID++;
        },
        { enablePatches: true },
      );
      const nextState = updateClockForWaitingState(
        draftNextState,
        timestamp,
        previousActivePlayerID,
      );

      // 7. No packet animations for Gundam (reserved for future)
      const animations: PacketAnimation[] = [];
      const moveLogs = projectGundamMoveLogs({
        command: envelope,
        playerId,
        logEntries,
        timestamp,
      });
      const taggedMoveLogs = moveLogs.map((log) => ({
        ...log,
        stateID: nextState.ctx._stateID,
        turnNumber: nextState.ctx.status.turn,
      }));

      // 8. Manage undo stack (per-player: different player's move clears stack)
      const isUndoable = moveDef.undoable !== false;
      if (isUndoable && undoBarriersCollected.length === 0) {
        const topEntry = this.undoStack.at(-1);
        if (topEntry && topEntry.playerId !== playerId) {
          this.undoStack = [];
        }
        this.undoStack.push({
          state: prevState,
          command: envelope,
          playerId,
          moveLogCount: taggedMoveLogs.length,
        });
      } else {
        this.undoStack = [];
      }

      // Apply new undo barriers
      for (const barrier of undoBarriersCollected) {
        if (!this.undoBarriers.includes(barrier)) {
          this.undoBarriers.push(barrier);
        }
      }

      // 9. Push to command history, move history, and update state
      this.commandHistory.push(envelope);
      this.moveHistory.push({
        moveId: envelope.move,
        commandID: envelope.commandID,
        args: envelope.args,
        playerId,
        actorRole: envelope.actorRole,
        timestamp,
        stateID: nextState.ctx._stateID,
        turnNumber: nextState.ctx.status.turn,
        gameSegment: nextState.ctx.status.gameSegment,
        phase: nextState.ctx.status.phase,
        step: nextState.ctx.status.step,
      });
      this.moveLogHistory.push(...taggedMoveLogs);
      this.state = nextState;

      this.notifyGameEvents(gameEvents);
      this.notifyStateUpdate();

      return {
        success: true,
        stateID: nextState.ctx._stateID,
        state: nextState as MatchState,
        patches,
        gameEvents,
        logEntries,
        processedCommand: envelope,
        animations,
        undoable: isUndoable && this.undoBarriers.length === 0,
        moveLogs: taggedMoveLogs,
      } satisfies CommandSuccess;
    } catch (err) {
      if (err instanceof MoveValidationError) {
        return {
          success: false,
          error: err.message,
          errorCode: err.errorCode,
          currentStateID: this.state.ctx._stateID,
          ...(err.envelope ? { envelope: err.envelope } : {}),
        } satisfies CommandFailure;
      }
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
        errorCode: "EXECUTION_ERROR",
        currentStateID: this.state.ctx._stateID,
      } satisfies CommandFailure;
    }
  }

  // ── View ───────────────────────────────────────────────────────────────

  getFilteredView(roleCtx: ViewRoleContext): FilteredMatchView<GundamG> {
    return filterMatchView(this.state, roleCtx, gundamZones, {
      getDefinitionId: (instanceId: string) =>
        this.staticResources.cardsMaps.instances.get(instanceId)?.definitionId,
      getDefinition: (definitionId: string) => this.staticResources.getDefinition(definitionId),
    });
  }

  // ── Available moves ────────────────────────────────────────────────────

  getAvailableMoves(playerId: PlayerId): string[] {
    return enumerateAvailableMoves(this.state as MatchState, playerId, this.staticResources);
  }

  // ── Pending choice / board view ────────────────────────────────────────

  /**
   * Gundam-specific board projection (includes `pendingChoice` descriptor).
   * Separate from the framework-level `getFilteredView` because it bakes
   * in Gundam state shape and DSL-based derived views.
   */
  getBoardView(roleCtx: ViewRoleContext): GundamBoardView {
    return projectGundamBoardView(this.state as MatchState<GundamG>, roleCtx, this.staticResources);
  }

  /**
   * Descriptor for the pending choice visible to the provided viewer, or
   * `undefined` when nothing is waiting on a choice (or the viewer is
   * not entitled to see it). Delegates to the Gundam board projection so
   * pending-choice details follow the same role-based visibility rules
   * as the rest of the board view (only the effect's controller and
   * judges see `legalTargetIds`).
   */
  getPendingChoice(roleCtx: ViewRoleContext): PendingChoicePrompt | undefined {
    return this.getBoardView(roleCtx).pendingChoice;
  }

  /**
   * Read-only card API anchored on the current state. Returned API resolves
   * `getDefinition` / `getMeta` / `get` against the live `state.ctx.zones`
   * snapshot, so callers see effective stats and derived keywords (Blocker
   * grants, paired-pilot bonuses, continuous effects) — not just printed
   * definitions.
   *
   * Used by the automation planner so candidate strategies can call
   * `derived-state.hasKeyword(cardId, "Blocker", G, cards)` and align with
   * the engine's `declareBlock.validate` decision rather than re-deriving
   * the keyword effect aggregation.
   */
  getCardReadAPI(): CardReadAPI {
    return createCardReadAPI(
      this.state.ctx.zones,
      this.staticResources.cardsMaps,
      gundamZones,
      deriveGundamRuntimeCard as unknown as DeriveRuntimeCardFn,
    );
  }

  // ── Card lookup ────────────────────────────────────────────────────────

  getInstanceIdByDefinition(playerId: PlayerId, definitionId: string): string | undefined {
    const cardIndex = this.state.ctx.zones.private.cardIndex as
      | Map<string, unknown>
      | Record<string, unknown>
      | undefined;

    for (const entry of this.staticResources.cardsMaps.instances.entries()) {
      if (entry.ownerID !== (playerId as string) || entry.definitionId !== definitionId) {
        continue;
      }

      if (cardIndex instanceof Map) {
        if (cardIndex.has(entry.instanceId)) {
          return entry.instanceId;
        }
        continue;
      }

      if (
        cardIndex &&
        typeof cardIndex === "object" &&
        Object.prototype.hasOwnProperty.call(cardIndex, entry.instanceId)
      ) {
        return entry.instanceId;
      }
    }
    return undefined;
  }

  // ── Card instance registry (test / fixture use) ───────────────────────

  /**
   * Register a card instance in the static resource map.
   * Needed when test fixtures seed cards directly into zones (bypassing deck
   * initialisation), so that framework.cards.getDefinition() can resolve them.
   */
  registerCardInstance(instanceId: string, definitionId: string, ownerId: PlayerId): void {
    this.staticResources.cardsMaps.instances.register(instanceId, {
      definitionId,
      ownerID: ownerId as string,
    });
    if (!this.staticResources.cardsMaps.definitions.has(definitionId)) {
      const def = this.staticResources.catalog.get(definitionId);
      if (def) this.staticResources.cardsMaps.definitions.set(definitionId, def);
    }
  }

  /**
   * Test-only escape hatch. Runs `mutate` inside the same mutative draft
   * pipeline used by `executeCommand` — a full framework write API is
   * supplied so helpers can invoke `framework.zones.moveCard`, push onto
   * `G.pendingEffects`, etc. — and then runs `resolveFlowTransitions`
   * so that queued triggers drain against the freshly mutated state.
   *
   * Scoped to the `testing/` harness (e.g. `engine.fireShieldBurst`,
   * `engine.endTurn`). Production move code MUST go through
   * `executeCommand` — this hatch is never used from real client flows
   * and is marked `@internal` so it stays out of the public SDK surface.
   *
   * @internal
   */
  runTestMutation(
    actingPlayerId: PlayerId,
    mutate: (ctx: { G: GundamG; framework: FrameworkWriteAPI; cards: CardRuntimeAPI }) => void,
  ): void {
    const gameEvents: PublishedGameEvent[] = [];
    const logEntries: GameLogEntry[] = [];
    const undoBarriersCollected: string[] = [];

    const [nextState] = create(
      this.state,
      (draft) => {
        const frameworkWrite = this.buildFrameworkWriteAPI(
          draft as Draft<MatchState<GundamG>>,
          actingPlayerId,
          gameEvents,
          logEntries,
          undoBarriersCollected,
        );
        const cardRuntimeAPI = this.buildCardRuntimeAPI(draft as Draft<MatchState<GundamG>>);

        mutate({
          G: draft.G as unknown as GundamG,
          framework: frameworkWrite,
          cards: cardRuntimeAPI,
        });

        const buildCtx: LifecycleContextBuilder = () => ({
          G: draft.G as object,
          framework: frameworkWrite,
          cards: cardRuntimeAPI,
        });
        resolveFlowTransitions(draft as Draft<MatchState>, gundamFlow, buildCtx);

        draft.ctx._stateID++;
      },
      { enablePatches: true },
    );

    this.state = nextState;
    this.undoStack = [];

    this.notifyGameEvents(gameEvents);
    this.notifyStateUpdate();
  }

  // ── Undo ───────────────────────────────────────────────────────────────

  canUndo(playerId: PlayerId): boolean {
    if (this.undoBarriers.length > 0) return false;
    const topEntry = this.undoStack.at(-1);
    return topEntry !== undefined && topEntry.playerId === playerId;
  }

  undo(playerId: PlayerId): CommandResult | null {
    if (!this.canUndo(playerId)) return null;

    const entry = this.undoStack.pop()!;
    this.state = entry.state;
    this.commandHistory.pop();
    this.moveHistory.pop();
    if (entry.moveLogCount > 0) {
      this.moveLogHistory.splice(-entry.moveLogCount, entry.moveLogCount);
    }

    this.notifyStateUpdate();

    return {
      success: true,
      stateID: entry.state.ctx._stateID,
      state: entry.state as MatchState,
      patches: [],
      gameEvents: [],
      logEntries: [],
      processedCommand: entry.command,
      animations: [],
      undoable: this.undoStack.length > 0,
      moveLogs: [],
    } satisfies CommandSuccess;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  dispose(): void {
    this.stateUpdateHandlers.clear();
    this.gameEventHandlers.clear();
    this.undoStack = [];
    this.commandHistory = [];
    this.moveHistory = [];
    this.moveLogHistory = [];
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  getState(): MatchState<GundamG> {
    return this.state;
  }

  getCommandHistory(): readonly CommandEnvelope[] {
    return this.commandHistory;
  }

  getMoveHistory(): readonly MoveHistoryEntry[] {
    return this.moveHistory;
  }

  getMoveLogHistory(): readonly GundamMoveLog[] {
    return this.moveLogHistory;
  }

  /**
   * Read-only framework API suitable for queries outside of a move
   * (e.g. tests, UI projections). Backed by the current state.
   */
  getFrameworkReadAPI(): FrameworkReadAPI {
    return this.buildFrameworkReadAPI(this.state as Draft<MatchState<GundamG>>);
  }

  // ── UI: validation, subscriptions ──────────────────────────────────────

  /**
   * Public pre-flight validation for a command envelope. Returns the same
   * shape the engine uses internally (flow-level + move-level final validate)
   * without mutating state. UI clients call this to disable illegal actions
   * before dispatching.
   *
   * Note: `moveDef.validate` is invoked in "final" mode against a read-only
   * framework view. Moves whose validation depends on mid-execution draft
   * mutations will not be fully covered — those checks will still fail at
   * `executeCommand` time. In practice, Gundam moves evaluate legality from
   * read-only state, so this is a faithful pre-flight.
   */
  validateMove(envelope: CommandEnvelope, playerId: PlayerId): MoveValidationResult {
    const flowResult = validateCommand(envelope, playerId, this.state as MatchState);
    if (!flowResult.valid) {
      return { valid: false, error: flowResult.error, errorCode: flowResult.errorCode };
    }

    if (!isGundamMoveName(envelope.move)) {
      return { valid: false, error: "Unknown move", errorCode: "UNKNOWN_MOVE" };
    }
    const moveDef = getGundamMoveDefinition(envelope.move);
    if (!moveDef.validate) return { valid: true };

    if (envelope.args === undefined) {
      return {
        valid: false,
        error: "Move args are required for validation",
        errorCode: "MISSING_ARGS",
      };
    }
    if (
      envelope.args === null ||
      typeof envelope.args !== "object" ||
      Array.isArray(envelope.args)
    ) {
      return {
        valid: false,
        error: "Move args must be a non-null object",
        errorCode: "INVALID_ARGS",
      };
    }

    try {
      const cardReadAPI = this.buildCardReadAPI(this.state as Draft<MatchState<GundamG>>);
      const frameworkRead = this.buildFrameworkReadAPI(this.state as Draft<MatchState<GundamG>>);
      return moveDef.validate({
        G: this.state.G as DeepReadonly<GundamG>,
        playerId,
        args: envelope.args,
        params: envelope.args,
        validationMode: "final",
        cards: cardReadAPI,
        framework: frameworkRead,
      });
    } catch (err) {
      return {
        valid: false,
        error: err instanceof Error ? err.message : String(err),
        errorCode: "VALIDATION_ERROR",
      };
    }
  }

  /**
   * Subscribe to state-transition notifications. The handler fires after
   * each successful state change (executeCommand, undo, runTestMutation)
   * with the new stateID. Returns an unsubscribe function.
   */
  onStateUpdate(handler: (stateId: number) => void): () => void {
    this.stateUpdateHandlers.add(handler);
    return () => {
      this.stateUpdateHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to game events published during move execution. The handler
   * fires for each event in publication order. Pass `filter` to select a
   * subset (e.g. only `UNIT_DEPLOYED`).
   */
  onGameEvent(
    filter: ((event: PublishedGameEvent) => boolean) | undefined,
    handler: (event: PublishedGameEvent) => void,
  ): () => void {
    const entry = { filter, handler };
    this.gameEventHandlers.add(entry);
    return () => {
      this.gameEventHandlers.delete(entry);
    };
  }

  private notifyStateUpdate(): void {
    if (this.stateUpdateHandlers.size === 0) return;
    const stateId = this.state.ctx._stateID;
    for (const handler of this.stateUpdateHandlers) {
      try {
        handler(stateId);
      } catch {
        // Subscribers must not break the runtime.
      }
    }
  }

  private notifyGameEvents(events: readonly PublishedGameEvent[]): void {
    if (this.gameEventHandlers.size === 0 || events.length === 0) return;
    for (const event of events) {
      for (const { filter, handler } of this.gameEventHandlers) {
        if (filter && !filter(event)) continue;
        try {
          handler(event);
        } catch {
          // Subscribers must not break the runtime.
        }
      }
    }
  }

  // ── Private: API builders ──────────────────────────────────────────────

  private buildCardReadAPI(draft: Draft<MatchState<GundamG>>): CardReadAPI {
    return createCardReadAPI(
      draft.ctx.zones,
      this.staticResources.cardsMaps,
      gundamZones,
      deriveGundamRuntimeCard as any,
    );
  }

  private buildCardRuntimeAPI(draft: Draft<MatchState<GundamG>>): CardRuntimeAPI {
    return createCardRuntimeAPI(
      draft.ctx.zones,
      this.staticResources.cardsMaps,
      gundamZones,
      deriveGundamRuntimeCard as any,
    );
  }

  private buildFrameworkReadAPI(
    draft: Draft<MatchState<GundamG>>,
    clockNow = Date.now(),
  ): FrameworkReadAPI {
    const cardReadAPI = this.buildCardReadAPI(draft);
    const randomApi = createRandomAPI(draft.ctx.random.seed);

    const zoneOps = createZoneOperations(
      draft.ctx.zones,
      gundamZones,
      randomApi.random,
      draft.ctx._stateID,
    );

    const stateSnapshot: FrameworkStateSnapshot = {
      status: draft.ctx.status as DeepReadonly<typeof draft.ctx.status>,
      stateID: draft.ctx._stateID,
      playerIds: draft.ctx.playerIds as readonly PlayerId[],
    };

    const timeQuery: TimeQueryAPI = {
      getPlayerTime: (pid: PlayerId) => {
        const ps =
          draft.ctx.time.mode === "none" ? undefined : draft.ctx.time.players[pid as string];
        return {
          reserveMsRemaining: ps?.reserveMsRemaining ?? 0,
          totalConsumedMs: ps?.totalConsumedMs ?? 0,
        };
      },
      getMode: () => draft.ctx.time.mode,
      getActivePlayerId: () =>
        draft.ctx.time.mode === "none" ? undefined : draft.ctx.time.activePlayerID,
      getTimeoutStatus: (pid: PlayerId, now = clockNow) =>
        checkTimeout(draft as unknown as MatchState<GundamG>, pid as string, now),
      isInNegativeTime: (pid: PlayerId) => {
        if (draft.ctx.time.mode !== "chess" && draft.ctx.time.mode !== "dynamic") return false;
        return draft.ctx.time.players[pid as string]?.isInNegativeTime ?? false;
      },
    };

    return {
      state: stateSnapshot,
      zones: zoneOps as ZoneQueryAPI,
      time: timeQuery,
      cards: cardReadAPI,
    };
  }

  private buildFrameworkWriteAPI(
    draft: Draft<MatchState<GundamG>>,
    playerId: PlayerId,
    gameEvents: PublishedGameEvent[],
    logEntries: GameLogEntry[],
    undoBarriersCollected: string[],
    clockNow = Date.now(),
  ): FrameworkWriteAPI {
    const readAPI = this.buildFrameworkReadAPI(draft, clockNow);
    const cardRuntimeAPI = this.buildCardRuntimeAPI(draft);
    const randomApi = createRandomAPI(draft.ctx.random.seed);

    const zoneOps = createZoneOperations(
      draft.ctx.zones,
      gundamZones,
      randomApi.random,
      draft.ctx._stateID,
    );

    // Random API that also updates draft state
    const randomAPI: RandomAPI = {
      random: () => {
        const val = randomApi.random();
        const rngState = randomApi.getState();
        draft.ctx.random.state = rngState.state;
        draft.ctx.random.drawCount = rngState.drawCount;
        return val;
      },
      shuffle: <T>(array: T[]): T[] => {
        const result = randomApi.shuffle(array);
        const rngState = randomApi.getState();
        draft.ctx.random.state = rngState.state;
        draft.ctx.random.drawCount = rngState.drawCount;
        return result;
      },
      rollDie: (sides: number): number => {
        const val = randomApi.rollDie(sides);
        const rngState = randomApi.getState();
        draft.ctx.random.state = rngState.state;
        draft.ctx.random.drawCount = rngState.drawCount;
        return val;
      },
      pick: <T>(array: readonly T[]): T => {
        const val = randomApi.pick(array);
        const rngState = randomApi.getState();
        draft.ctx.random.state = rngState.state;
        draft.ctx.random.drawCount = rngState.drawCount;
        return val;
      },
    };

    const eventAPI: EventAPI = {
      emit: (event: MoveGameEvent) => {
        gameEvents.push({
          eventId: this.eventCounter++,
          stateID: draft.ctx._stateID,
          timestamp: Date.now(),
          event,
        });
      },
      endGame: (result: GameEndResult) => {
        draft.ctx.status.gameEnded = true;
        draft.ctx.status.winner = result.winner as PlayerId | undefined;
        draft.ctx.status.winReason = result.reason;
      },
    };

    const undoAPI: UndoAPI = {
      markBarrier: (reason: string) => {
        undoBarriersCollected.push(reason);
      },
      hasBarrier: () => undoBarriersCollected.length > 0,
      getReasons: () => undoBarriersCollected,
    };

    const statusAPI: StatusAPI = {
      get snapshot() {
        return draft.ctx.status as DeepReadonly<typeof draft.ctx.status>;
      },
      patch: (patch) => {
        Object.assign(draft.ctx.status, patch);
      },
      setPhase: (phase) => {
        draft.ctx.status.phase = phase;
      },
      setStep: (step) => {
        draft.ctx.status.step = step;
      },
      setGameSegment: (segment) => {
        draft.ctx.status.gameSegment = segment;
      },
      incrementTurn: (by = 1) => {
        draft.ctx.status.turn += by;
        return draft.ctx.status.turn;
      },
    };

    const timeOps: TimeOperationsAPI = {
      ...readAPI.time,
      consumeTime: (pid: PlayerId, ms: number) => {
        const ps =
          draft.ctx.time.mode === "none" ? undefined : draft.ctx.time.players[pid as string];
        if (ps) {
          ps.reserveMsRemaining -= ms;
          ps.totalConsumedMs += ms;
          ps.lastUpdatedAtMs = Date.now();
        }
      },
      addTime: (pid: PlayerId, ms: number) => {
        const ps =
          draft.ctx.time.mode === "none" ? undefined : draft.ctx.time.players[pid as string];
        if (ps) {
          ps.reserveMsRemaining += ms;
          ps.lastUpdatedAtMs = Date.now();
        }
      },
      pauseClock: (pid: PlayerId) => {
        const ps =
          draft.ctx.time.mode === "none" ? undefined : draft.ctx.time.players[pid as string];
        if (ps) {
          ps.lastUpdatedAtMs = Date.now();
        }
      },
      resumeClock: (pid: PlayerId) => {
        const ps =
          draft.ctx.time.mode === "none" ? undefined : draft.ctx.time.players[pid as string];
        if (ps) {
          ps.lastUpdatedAtMs = Date.now();
        }
      },
      resetPlayerTimeAfterSkip: (pid: PlayerId, resetMs?: number) => {
        if (draft.ctx.time.mode !== "chess" && draft.ctx.time.mode !== "dynamic") return;
        const ps = draft.ctx.time.players[pid as string];
        if (!ps) return;
        ps.reserveMsRemaining = resetMs ?? draft.ctx.time.config.resetTimeOnSkipMs;
        ps.isInNegativeTime = false;
        ps.timeoutCount++;
        if (draft.ctx.time.activePlayerID === (pid as string)) {
          draft.ctx.time.activePlayerAccumulatedMs = 0;
        }
      },
    };

    const logFn = (entry: LogEntry | readonly LogEntry[]) => {
      const entries = Array.isArray(entry) ? entry : [entry];
      for (const e of entries) {
        logEntries.push({
          id: this.logCounter++,
          stateID: draft.ctx._stateID,
          timestamp: Date.now(),
          type: e.type,
          message: e.message,
          playerId: e.playerId,
          cardIds: e.cardIds,
          data: e.data,
          visibleTo: e.visibleTo ?? "all",
        });
      }
    };

    return {
      state: readAPI.state,
      zones: zoneOps,
      time: timeOps,
      cards: cardRuntimeAPI,
      random: randomAPI,
      events: eventAPI,
      undo: undoAPI,
      log: logFn,
      status: statusAPI,
    };
  }
}

// ── Internal error class ─────────────────────────────────────────────────────

class MoveValidationError extends Error {
  public readonly errorCode: string;
  public readonly envelope?: MoveValidationErrorEnvelope;

  constructor(message: string, errorCode: string, envelope?: MoveValidationErrorEnvelope) {
    super(message);
    this.name = "MoveValidationError";
    this.errorCode = errorCode;
    this.envelope = envelope;
  }
}
