import { advanceFabClock, type FabClock } from "./clock.ts";
import {
  FAB_FACE_DOWN,
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
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import {
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import { commandForFabSubmission, projectFabInteraction } from "./interaction.ts";
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
  readonly runtime: FabMatchRuntime;

  private clock?: FabClock;
  private readonly transferSources = new WeakMap<
    AnimationPlanV2,
    ReadonlyMap<string, ReadonlySet<string>>
  >();

  constructor(runtime: FabMatchRuntime, clock?: FabClock) {
    this.runtime = runtime;
    this.clock = clock;
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
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
    const result = this.toDispatchResult(
      this.runtime.applyCommand(actorId, command, {
        commandId: `${context.gameId}:${actorId}:${this.runtime.getStateID() + 1}`,
        timestamp,
      }),
      context,
      previousTurn,
      previousLocations,
      previousAnnouncementState,
    );
    if (result.success && result.animationPlan)
      this.transferSources.set(result.animationPlan, sourceIds);
    return result;
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
    return projectFabInteraction(this.runtime, actorId).view;
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
    const view = this.getInteractionView(actorId);
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
      undoable: result.undoBarrier === null,
      transition: "move",
      acceptedMoveRecord,
      engineLogRecords,
      analyticsFactBatchRecords,
      processedCommand: result.processedCommand,
    };
  }
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
