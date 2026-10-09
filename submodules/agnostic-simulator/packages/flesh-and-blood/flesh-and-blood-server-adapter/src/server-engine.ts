import {
  nextFabUndoCheckpoint,
  type FabTurnStartCheckpoint,
  type FabUndoCheckpoint,
} from "./undo.ts";
import { evaluateReserveTimeoutDrop } from "@tcg/protocol";
import { advanceFabClock, fabRemainingMs, type FabClock } from "./clock.ts";
import {
  FAB_FACE_DOWN,
  createFabMatchContext,
  restoreFabMatchSnapshot,
  type FabPlayerLog,
  FabMatchRuntime,
  decodeFabCommand,
  isFabMoveName,
  type FabViewerResources,
  type FabViewerState,
} from "@tcg/flesh-and-blood-engine/runtime";
import {
  chooseAutomatedAction,
  passOnlyStrategy,
  resolveFabAutomatedActionStrategyOption,
} from "@tcg/flesh-and-blood-engine/automation";
import type {
  AcceptedMoveRecord,
  AnalyticsFactBatchRecord,
  BotActionOptions,
  BotActionResult,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  EvaluateOpponentTimeoutInput,
  OpponentTimeoutEvaluation,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import {
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import { commandForFabSubmission, projectFabInteractionCached } from "./interaction.ts";
import {
  captureFabZoneLocations,
  fabLatestAnnouncementTransition,
  fabHiddenZoneTransfers,
  redactFabTransferLocations,
  type FabAnnouncementState,
  type FabZoneLocations,
} from "./state-transfers";
import type { AnimationPlanV2 } from "@tcg/protocol";
import { FAB_ANALYTICS_SCHEMA_VERSION_V2, projectFabAnalyticsFactsV2 } from "./analytics-v2.ts";

/**
 * Wraps a Flesh and Blood {@link FabMatchRuntime} into the game-agnostic
 * {@link ServerGameEngine} contract. The runtime owns game-native rules;
 * this class only translates dispatch results and viewer projections.
 */
export class FleshAndBloodServerEngine implements ServerGameEngine {
  runtime: FabMatchRuntime;
  private undoCheckpoints: FabUndoCheckpoint[];
  private turnStartCheckpoint: FabTurnStartCheckpoint | null;

  private clock?: FabClock;
  private readonly transferSources = new WeakMap<
    AnimationPlanV2,
    ReadonlyMap<string, ReadonlySet<string>>
  >();

  constructor(
    runtime: FabMatchRuntime,
    clock?: FabClock,
    undoCheckpoints: readonly FabUndoCheckpoint[] = [],
    turnStartCheckpoint?: FabTurnStartCheckpoint | null,
  ) {
    this.undoCheckpoints = [...undoCheckpoints];
    this.runtime = runtime;
    this.clock = clock;
    const actorId = runtime.getActivePlayerId();
    this.turnStartCheckpoint =
      turnStartCheckpoint === undefined && actorId && !runtime.getState().decision
        ? { actorId, snapshot: runtime.snapshot(), clockBonuses: {} }
        : (turnStartCheckpoint ?? null);
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    // Hosted dispatch is version-checked by the platform runtime cache and CAS.
    // Direct undo callers can additionally supply expectedVersion below.
    if (moveType === "undo") return this.undo(actorId, context);
    if (moveType === "undoToTurnStart") return this.undoToTurnStart(actorId, context);
    if (!isFabMoveName(moveType)) {
      return {
        success: false,
        error: `Unknown move: ${moveType}`,
        errorCode: "unknown_move",
        stateID: this.runtime.getStateID(),
      };
    }
    const command = decodeFabCommand(moveType, payload);
    if (!command) {
      return {
        success: false,
        error: "FAB command payload is malformed or uses a legacy field.",
        errorCode: "invalid_command_payload",
        stateID: this.runtime.getStateID(),
      };
    }
    const before =
      this.runtime.getState().decision || command.move === "concede"
        ? null
        : this.runtime.snapshot();
    const previousClock = this.clock;
    const previousLocations = captureFabZoneLocations(this.runtime.getState());
    const sourceIds = new Map<string, ReadonlySet<string>>();
    sourceIds.set("spectator", visibleCardIds(this.runtime.viewer({ role: "spectator" })));
    for (const id of this.runtime.playerIds()) {
      sourceIds.set(
        `player:${id}`,
        visibleCardIds(this.runtime.viewer({ role: "player", actorId: id })),
      );
    }
    const previousTurn = this.runtime.getState().turnNumber;
    const previousActivePlayerId = this.runtime.getActivePlayerId();
    const previousAnnouncementState: FabAnnouncementState = {
      activePlayerId: previousActivePlayerId ?? null,
      turnNumber: previousTurn,
      combatStep: this.runtime.getState().combat?.step ?? null,
    };
    const timestamp = Date.now();
    const applied = this.runtime.applyCommand(actorId, command, {
      commandId: `${context.gameId}:${actorId}:${this.runtime.getStateID() + 1}`,
      timestamp,
    });
    const result = this.toDispatchResult(
      applied,
      context,
      previousTurn,
      previousLocations,
      previousAnnouncementState,
    );
    if (applied.success && result.success && result.transition !== "reversal") {
      const currentCheckpoint = this.undoCheckpoints.at(-1) ?? null;
      const nextCheckpoint = nextFabUndoCheckpoint({
        current: currentCheckpoint,
        before,
        actorId,
        move: command.move,
        barrier: applied.undoBarrier,
        ended: this.hasGameEnded(),
      });
      if (this.runtime.getState().turnNumber !== previousTurn) {
        this.undoCheckpoints = [];
        const nextActorId = this.getActivePlayerId();
        this.turnStartCheckpoint = nextActorId
          ? { actorId: nextActorId, snapshot: this.runtime.snapshot(), clockBonuses: {} }
          : null;
      } else if (!nextCheckpoint) {
        this.undoCheckpoints = [];
        this.turnStartCheckpoint = null;
      } else if (nextCheckpoint !== currentCheckpoint) {
        this.undoCheckpoints =
          currentCheckpoint?.actorId === actorId
            ? [...this.undoCheckpoints, nextCheckpoint]
            : [nextCheckpoint];
        if (this.turnStartCheckpoint?.actorId !== actorId) this.turnStartCheckpoint = null;
      }
      if (previousClock && this.clock) {
        const now = applied.execution.timestamp;
        const awardedBonuses: Record<string, number> = {};
        for (const id of this.runtime.playerIds()) {
          const awarded =
            fabRemainingMs(this.clock, id, now) - fabRemainingMs(previousClock, id, now);
          awardedBonuses[id] = Math.max(0, awarded);
        }
        const latest = this.undoCheckpoints.at(-1);
        if (latest) {
          this.undoCheckpoints[this.undoCheckpoints.length - 1] = {
            ...latest,
            clockBonuses: addClockBonuses(latest.clockBonuses, awardedBonuses),
          };
        }
        if (this.turnStartCheckpoint && this.runtime.getState().turnNumber === previousTurn) {
          this.turnStartCheckpoint = {
            ...this.turnStartCheckpoint,
            clockBonuses: addClockBonuses(this.turnStartCheckpoint.clockBonuses, awardedBonuses),
          };
        }
      }
      result.undoable = this.canUndo(actorId);
    }
    if (result.success && result.animationPlan)
      this.transferSources.set(result.animationPlan, sourceIds);
    return result;
  }

  getUndoCheckpoint(): FabUndoCheckpoint | null {
    return this.undoCheckpoints.at(-1) ?? null;
  }

  getUndoCheckpoints(): readonly FabUndoCheckpoint[] {
    return this.undoCheckpoints;
  }

  getTurnStartCheckpoint(): FabTurnStartCheckpoint | null {
    return this.turnStartCheckpoint;
  }

  canUndo(actorId: string): boolean {
    return !this.hasGameEnded() && this.getUndoCheckpoint()?.actorId === actorId;
  }

  canUndoToTurnStart(actorId: string): boolean {
    const checkpoint = this.turnStartCheckpoint;
    return (
      !this.hasGameEnded() &&
      checkpoint?.actorId === actorId &&
      checkpoint.snapshot.turnNumber === this.runtime.getState().turnNumber &&
      this.undoCheckpoints.length > 0
    );
  }

  undo(actorId: string, context: DispatchContext, expectedVersion?: number): DispatchResult {
    return this.restoreUndo(actorId, context, "last_move", expectedVersion);
  }

  undoToTurnStart(
    actorId: string,
    context: DispatchContext,
    expectedVersion?: number,
  ): DispatchResult {
    return this.restoreUndo(actorId, context, "turn_start", expectedVersion);
  }

  private restoreUndo(
    actorId: string,
    context: DispatchContext,
    scope: "last_move" | "turn_start",
    expectedVersion?: number,
  ): DispatchResult {
    const undoneMoveId = scope === "last_move" ? this.getUndoCheckpoint()?.move : undefined;
    const checkpoint = scope === "last_move" ? this.getUndoCheckpoint() : this.turnStartCheckpoint;
    const restoresTurnStart = checkpoint?.snapshot.stateID === this.turnStartCheckpoint?.snapshot.stateID;
    const previousStateID = this.getStateID();
    if (
      !checkpoint ||
      !(scope === "last_move" ? this.canUndo(actorId) : this.canUndoToTurnStart(actorId)) ||
      (expectedVersion !== undefined && expectedVersion !== previousStateID)
    ) {
      return {
        success: false,
        stateID: previousStateID,
        errorCode: "undo_unavailable",
        error: "No action is available to undo.",
      };
    }
    const current = this.runtime.getState();
    const stateID = previousStateID + 1;
    const restored = restoreFabMatchSnapshot(
      {
        ...checkpoint.snapshot,
        stateID,
        automationPreferences: current.automationPreferences,
        optionalTriggerAutomation: current.optionalTriggerAutomation,
        priorityHoldArmed: current.priorityHoldArmed,
      },
      createFabMatchContext(current.cardDefinitions, current.publicCardIdentities),
    );
    this.runtime = new FabMatchRuntime(restored);
    if (scope === "turn_start") {
      this.undoCheckpoints = [];
      this.turnStartCheckpoint = null;
    } else {
      this.undoCheckpoints.pop();
      if (this.turnStartCheckpoint) {
        this.turnStartCheckpoint = {
          ...this.turnStartCheckpoint,
          clockBonuses: subtractClockBonuses(
            this.turnStartCheckpoint.clockBonuses,
            checkpoint.clockBonuses,
          ),
        };
        if (checkpoint.snapshot.stateID === this.turnStartCheckpoint.snapshot.stateID) {
          this.turnStartCheckpoint = null;
        }
      }
    }
    const timestamp = Date.now();
    if (this.clock) {
      const clock = advanceFabClock(this.clock, {
        actorId,
        activeId: this.getActivePlayerId(),
        now: timestamp,
        actionBonus: false,
        turnEnded: false,
      });
      this.clock = {
        ...clock,
        clockState: Object.fromEntries(
          Object.entries(clock.clockState).map(([id, value]) => [
            id,
            {
              ...value,
              reserveMsRemaining: value.reserveMsRemaining - (checkpoint.clockBonuses[id] ?? 0),
            },
          ]),
        ),
      };
    }
    if (restoresTurnStart) {
      this.turnStartCheckpoint = {
        actorId,
        snapshot: this.runtime.snapshot(),
        clockBonuses: {},
      };
    }
    const commandId = `${context.gameId}:${actorId}:${stateID}`;
    const log: FabPlayerLog = {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId,
      moveType: "undo",
      actorId,
      timestamp,
      restoredCheckpointStateID: checkpoint.snapshot.stateID,
      turnNumber: restored.turnNumber,
      turnPlayerId: restored.activePlayerId,
      phase: restored.phase,
      entries: [
        {
          entryId: `${commandId}:undo`,
          publicMessage: {
            key: "flesh-and-blood.undo",
            category: "action",
            values: { actorId },
          },
        },
      ],
    };
    return {
      success: true,
      stateID,
      state: this.getStateSnapshot(),
      transition: "move",
      undoable: this.canUndo(actorId),
      animationPlan: null,
      acceptedMoveRecord: {
        gameId: context.gameId,
        stateVersion: stateID,
        turnNumber: restored.turnNumber,
        actorId,
        moveId: scope === "turn_start" ? "undoToTurnStart" : "undo",
        input: { args: {} },
        processedCommand: {
          commandID: commandId,
          move: scope === "turn_start" ? "undoToTurnStart" : "undo",
        },
        timestamp,
        sourceAuthority: context.sourceAuthority,
        transitionType: "undo",
        newStateID: stateID,
        undoneStateID: previousStateID,
        restoredCheckpointStateID: checkpoint.snapshot.stateID,
        ...(undoneMoveId ? { undoneMoveId } : {}),
      },
      engineLogRecords: [
        {
          gameId: context.gameId,
          stateVersion: stateID,
          timestamp,
          sourceAuthority: context.sourceAuthority,
          log,
        },
      ],
      analyticsFactBatchRecords: [
        {
          gameId: context.gameId,
          gameSlug: "flesh-and-blood",
          schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
          stateVersion: stateID,
          commandId,
          timestamp,
          sourceAuthority: context.sourceAuthority,
          facts: [
            {
              schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
              kind: "undo",
              eventId: `${commandId}:undo`,
              turn: restored.turnNumber,
              activePlayerId: restored.activePlayerId,
              phase: restored.phase,
              combatNumber: null,
              chainLinkNumber: null,
              restoredCheckpointStateID: checkpoint.snapshot.stateID,
            },
          ],
        },
      ],
    };
  }

  getStateID(): number {
    return this.runtime.getStateID();
  }

  getState(): unknown {
    return this.getStateSnapshot();
  }

  getReplayForkState(): unknown {
    return {
      snapshot: this.runtime.snapshot(),
      cardDefinitionIds: Object.keys(this.runtime.getState().cardDefinitions),
    };
  }

  private getStateSnapshot() {
    return { ...this.runtime.snapshot(), ...(this.clock ? { ctx: this.clock } : {}) };
  }

  getViewerState(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): FabViewerState & { ctx?: FabClock } {
    return { ...this.runtime.viewer(viewer), ...(this.clock ? { ctx: this.clock } : {}) };
  }

  getViewerResources(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): FabViewerResources {
    return this.runtime.viewerResources(viewer);
  }

  getViewerAnimationPlan(
    plan: AnimationPlanV2 | null,
    viewer: { role: "player"; actorId: string } | { role: "spectator" },
  ): AnimationPlanV2 | null {
    const knownIds = visibleCardIds(this.runtime.viewer(viewer));
    const key = viewer.role === "player" ? `player:${viewer.actorId}` : "spectator";
    for (const id of plan ? (this.transferSources.get(plan)?.get(key) ?? []) : []) knownIds.add(id);
    return redactFabTransferLocations(plan, knownIds);
  }

  getActivePlayerId(): string | undefined {
    const wait = this.runtime.waitState();
    return (
      (wait.kind === "decision" ? wait.decision.actorId : undefined) ??
      (wait.kind === "defense-declaration" ? wait.defenderId : undefined) ??
      this.runtime.getPriorityPlayerId() ??
      this.runtime.getActivePlayerId()
    );
  }

  getInteractionActorIds(): readonly string[] {
    return this.runtime.playerIds();
  }

  getInteractionView(actorId: string): EngineInteractionView {
    return projectFabInteractionCached(this.runtime, actorId).view;
  }

  takeAutomatedAction(options: BotActionOptions, context: DispatchContext): BotActionResult {
    const actorId = this.getActivePlayerId();
    if (!actorId) {
      return {
        finalResult: {
          success: false,
          error: "Flesh and Blood has no active bot actor.",
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "no-active-actor" },
      };
    }
    const strategy = resolveFabAutomatedActionStrategyOption(options.strategyId);
    const command = chooseAutomatedAction(this.runtime, actorId, strategy.strategy);
    if (!command) {
      return {
        finalResult: {
          success: false,
          error: "The selected Flesh and Blood strategy could not produce an action.",
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "strategy-stuck" },
        strategyId: strategy.id,
      };
    }
    let finalResult = this.dispatch(command.move, actorId, command.payload, context);
    if (!finalResult.success) {
      const fallback = chooseAutomatedAction(this.runtime, actorId, passOnlyStrategy);
      if (fallback && fallback.move !== "concede") {
        finalResult = this.dispatch(fallback.move, actorId, fallback.payload, context);
      }
    }
    return {
      finalResult,
      strategyId: strategy.id,
      selectedCandidate: { family: command.move },
    };
  }

  submitInteraction(
    actorId: string,
    submission: InteractionSubmission,
    context: DispatchContext,
  ): DispatchResult {
    const view = projectFabInteractionCached(this.runtime, actorId).view;
    const validation = validateInteractionSubmission(view, submission);
    if (!validation.ok) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.issues.some((issue) => issue.code === "stale_state")
          ? "stale_interaction"
          : "invalid_interaction_submission",
        stateID: this.getStateID(),
      };
    }
    const command = commandForFabSubmission(this.runtime, actorId, submission);
    if (!command) {
      return {
        success: false,
        error: "The selected Flesh and Blood action is no longer legal.",
        errorCode: "stale_interaction",
        stateID: this.getStateID(),
      };
    }
    return this.dispatch(command.move, actorId, command.payload, context);
  }

  hasGameEnded(): boolean {
    return this.runtime.hasGameEnded();
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    return this.runtime.getGameEndResult();
  }

  forfeit(winnerId: string, reason: string, context: DispatchContext): DispatchResult {
    const playerIds = this.runtime.playerIds();
    const loserId = playerIds.find((id) => id !== winnerId);
    const winnerSeated = playerIds.some((id) => id === winnerId);
    if (!winnerSeated || !loserId) {
      return {
        success: false,
        error: `Cannot forfeit Flesh and Blood game to unknown winner ${winnerId}.`,
        errorCode: "invalid_forfeit_winner",
        stateID: this.runtime.getStateID(),
      };
    }
    const timestamp = Date.now();
    return this.toDispatchResult(
      this.runtime.applyCommand(
        loserId,
        { move: "concede", reason },
        {
          commandId: `${context.gameId}:${loserId}:${this.runtime.getStateID() + 1}`,
          timestamp,
        },
      ),
      context,
    );
  }

  evaluateOpponentTimeout(input: EvaluateOpponentTimeoutInput): OpponentTimeoutEvaluation {
    const clock = this.clock;
    if (!clock) {
      return {
        skip: { allowed: false, reason: "no_time_control" },
        drop: { allowed: false, reason: "no_time_control", facts: {} },
      };
    }
    const player = clock.clockState[input.opponentPlayerId];
    if (!player) {
      return {
        skip: { allowed: false, reason: "skip_unsupported" },
        drop: {
          allowed: false,
          reason: "clock_unavailable",
          facts: { mode: clock.timeControl.mode },
        },
      };
    }
    return {
      skip: { allowed: false, reason: "skip_unsupported" },
      drop: evaluateReserveTimeoutDrop({
        nowMs: input.nowMs,
        mode: clock.timeControl.mode,
        graceMs: clock.timeControl.config.graceMs,
        effectiveReserveMs: fabRemainingMs(clock, input.opponentPlayerId, input.nowMs),
        isActive: player.isOnClock,
        skipSupported: false,
      }),
    };
  }

  private toDispatchResult(
    result: ReturnType<FabMatchRuntime["applyCommand"]>,
    context: DispatchContext,
    previousTurn?: number,
    previousLocations?: FabZoneLocations,
    previousAnnouncementState?: FabAnnouncementState,
  ): DispatchResult {
    if (!result.success) {
      return {
        success: false,
        error: result.error,
        errorCode: result.errorCode,
        stateID: result.currentStateID,
      };
    }

    if (this.clock) {
      // Award time only after the rules transaction commits. Announcing and
      // reversing an unpaid play, settings, and priority passing earn nothing.
      const actionBonus = result.committedEvents.some(
        (event) =>
          (event.name === "play" || event.name === "activate" || event.name === "defend") &&
          event.data.actorId === result.actorId,
      );
      this.clock = advanceFabClock(this.clock, {
        actorId: result.actorId,
        activeId: this.hasGameEnded() ? undefined : this.getActivePlayerId(),
        now: result.execution.timestamp,
        actionBonus: result.outcome.kind !== "rules-action-reversed" && actionBonus,
        turnEnded:
          result.outcome.kind !== "rules-action-reversed" &&
          previousTurn !== undefined &&
          this.runtime.getState().turnNumber > previousTurn,
      });
    }
    const persisted = this.getStateSnapshot();
    const stateVersion = persisted.stateID;
    const timestamp = result.execution.timestamp;
    const nextActivePlayerId = this.runtime.getActivePlayerId();
    const announcement = previousAnnouncementState
      ? fabLatestAnnouncementTransition(previousAnnouncementState, {
          activePlayerId: nextActivePlayerId ?? null,
          turnNumber: persisted.turnNumber,
          combatStep: this.runtime.getState().combat?.step ?? null,
        })
      : undefined;
    if (result.outcome.kind === "rules-action-reversed") {
      const analyticsFactBatchRecords: AnalyticsFactBatchRecord[] = [
        {
          gameId: context.gameId,
          gameSlug: "flesh-and-blood",
          schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
          stateVersion,
          commandId: result.execution.commandId,
          timestamp,
          sourceAuthority: context.sourceAuthority,
          facts: [],
        },
      ];
      return {
        success: true,
        transition: "reversal",
        reversalRecord: {
          stateVersion,
          turnNumber: persisted.turnNumber,
          actorId: result.actorId,
          timestamp,
        },
        stateID: stateVersion,
        state: persisted,
        outcome: result.outcome,
        animationPlan: null,
        analyticsFactBatchRecords,
        undoable: false,
        processedCommand: result.processedCommand,
      };
    }
    const acceptedCommand = viewerSafeAcceptedCommand(result.processedCommand);
    const acceptedMoveRecord: AcceptedMoveRecord = {
      gameId: context.gameId,
      stateVersion,
      turnNumber: persisted.turnNumber,
      actorId: result.actorId,
      moveId: result.processedCommand.move,
      input: { args: commandPayload(acceptedCommand) },
      processedCommand: acceptedCommand,
      timestamp,
      sourceAuthority: context.sourceAuthority,
      newStateID: stateVersion,
      transitionType: "move",
    };
    const engineLogRecords: EngineLogRecord[] = [
      {
        gameId: context.gameId,
        stateVersion,
        timestamp: result.playerLog.timestamp,
        sourceAuthority: context.sourceAuthority,
        // The platform treats this as an opaque, game-owned player narrative.
        // Viewer projection replaces public fallbacks with only that viewer's
        // private message before the record crosses the gateway.
        log: result.playerLog,
      },
    ];
    const analyticsFactBatchRecords: AnalyticsFactBatchRecord[] = [
      {
        gameId: context.gameId,
        gameSlug: "flesh-and-blood",
        schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
        stateVersion,
        commandId: result.execution.commandId,
        timestamp,
        sourceAuthority: context.sourceAuthority,
        facts: projectFabAnalyticsFactsV2(result.committedEvents),
      },
    ];

    return {
      success: true,
      stateID: stateVersion,
      state: persisted,
      outcome: result.outcome,
      animationPlan: previousLocations
        ? fabHiddenZoneTransfers(
            previousLocations,
            captureFabZoneLocations(this.runtime.getState()),
            result.execution.commandId,
            announcement,
          )
        : null,
      undoable: false,
      transition: "move",
      acceptedMoveRecord,
      engineLogRecords,
      analyticsFactBatchRecords,
      processedCommand: result.processedCommand,
    };
  }
}

function addClockBonuses(
  current: Readonly<Record<string, number>>,
  awarded: Readonly<Record<string, number>>,
): Record<string, number> {
  return Object.fromEntries(
    Object.keys(awarded).map((id) => [id, (current[id] ?? 0) + (awarded[id] ?? 0)]),
  );
}

function subtractClockBonuses(
  current: Readonly<Record<string, number>>,
  removed: Readonly<Record<string, number>>,
): Record<string, number> {
  return Object.fromEntries(
    Object.keys(current).map((id) => [id, Math.max(0, (current[id] ?? 0) - (removed[id] ?? 0))]),
  );
}

function visibleCardIds(state: FabViewerState): Set<string> {
  return new Set(
    Object.values(state.players).flatMap((player) =>
      Object.values(player.zones).flatMap((ids) => ids.filter((id) => id !== FAB_FACE_DOWN)),
    ),
  );
}

function commandPayload(command: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const { move: _move, ...payload } = command as Record<string, unknown>;
  return payload;
}

function viewerSafeAcceptedCommand(
  command: import("@tcg/flesh-and-blood-engine/runtime").FabCommand,
): Readonly<Record<string, unknown>> {
  switch (command.move) {
    case "set-optional-trigger-automation":
      return { move: command.move };
    case "answer-decision":
      return { move: command.move };
    case "end-turn":
      return { move: command.move };
    default:
      return command;
  }
}
