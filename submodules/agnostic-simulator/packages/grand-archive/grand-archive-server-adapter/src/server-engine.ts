import {
  decodeGrandArchiveCommand,
  describeGrandArchiveStructuredDecision,
  GrandArchiveMatchRuntime,
  isGrandArchiveMoveName,
  projectGrandArchiveViewerState,
  projectGrandArchiveViewerLog,
  readGrandArchiveWaitState,
  serializeGrandArchiveMatchSnapshot,
  type GrandArchiveCommand,
  type GrandArchiveMatchProgram,
  type GrandArchiveViewerPlayer,
  type GrandArchiveViewerState,
  type GrandArchiveViewerZone,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchiveObjectId, grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import {
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import type {
  AcceptedMoveRecord,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import {
  commandForGrandArchiveSubmission,
  grandArchiveCommandIncarnations,
  projectGrandArchiveInteraction,
} from "./interaction.ts";
import {
  appendGrandArchiveReplayCommand,
  createGrandArchiveReplayJournal,
  exportGrandArchiveReplay,
  fingerprintGrandArchiveValue,
  type GrandArchiveReplayV1,
  type GrandArchiveReplayJournalV1,
} from "./replay.ts";

function projectedZoneObjects(zone: GrandArchiveViewerZone) {
  return zone.visibility === "visible" ? zone.objects : zone.revealedObjects;
}

function projectedZoneCount(zone: GrandArchiveViewerZone): number {
  return zone.visibility === "visible" ? zone.objects.length + zone.hiddenCount : zone.count;
}

function intersectProjectedZones(zones: readonly GrandArchiveViewerZone[]): GrandArchiveViewerZone {
  const first = zones[0];
  if (!first) throw new Error("Grand Archive replay requires every player zone projection");
  const sharedObjects = projectedZoneObjects(first).filter((object) =>
    zones.every((zone) =>
      projectedZoneObjects(zone).some((candidate) => candidate.id === object.id),
    ),
  );
  const count = Math.max(...zones.map(projectedZoneCount));
  return zones.every((zone) => zone.visibility === "visible")
    ? { visibility: "visible", objects: sharedObjects, hiddenCount: count - sharedObjects.length }
    : { visibility: "hidden", count, revealedObjects: sharedObjects };
}

/** Public replay state is the visibility intersection of every player's projection. */
export function intersectGrandArchiveReplayProjections(
  projections: readonly GrandArchiveViewerState[],
  baseViewerId?: string,
): GrandArchiveViewerState {
  const base =
    projections.find((projection) => projection.selfId === baseViewerId) ?? projections[0];
  if (!base) throw new Error("Grand Archive replay requires at least one player");
  return {
    ...base,
    players: base.players.map((basePlayer): GrandArchiveViewerPlayer => {
      const projectedPlayers = projections.map((projection) => {
        const player = projection.players.find((candidate) => candidate.id === basePlayer.id);
        if (!player) throw new Error(`Grand Archive replay cannot project player ${basePlayer.id}`);
        return player;
      });
      const zones: Record<GrandArchiveZone, GrandArchiveViewerZone> = { ...basePlayer.zones };
      for (const zoneId of Object.keys(basePlayer.zones) as GrandArchiveZone[]) {
        zones[zoneId] = intersectProjectedZones(
          projectedPlayers.map((player) => player.zones[zoneId]),
        );
      }
      return { ...basePlayer, zones };
    }),
  };
}

function projectGrandArchivePublicReplayState(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchRuntime["state"],
): GrandArchiveViewerState {
  return intersectGrandArchiveReplayProjections(
    state.turnOrder.map((viewerId) => projectGrandArchiveViewerState(program, state, viewerId)),
    state.turnOrder.find((playerId) => playerId !== state.decision?.playerId),
  );
}

function visibleDefinitionIds(projected: GrandArchiveViewerState): Set<string> {
  return new Set(
    projected.players.flatMap((player) =>
      Object.values(player.zones).flatMap((zone) =>
        (zone.visibility === "visible" ? zone.objects : zone.revealedObjects).flatMap((object) => [
          object.definitionId,
          ...(object.activeDefinitionId ? [object.activeDefinitionId] : []),
        ]),
      ),
    ),
  );
}

function authorizedDecisionCardInstances(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchRuntime["state"],
  viewerId: string,
): {
  readonly definitionIds: Readonly<Record<string, string>>;
  readonly ownerIds: Readonly<Record<string, string>>;
  readonly names: Readonly<Record<string, string>>;
} {
  const decision = state.decision;
  if (!decision || decision.playerId !== grandArchivePlayerId(viewerId)) {
    return { definitionIds: {}, ownerIds: {}, names: {} };
  }
  const description = describeGrandArchiveStructuredDecision(program, state, decision);
  if (
    !description ||
    description.kind === "option-selection" ||
    description.kind === "boolean" ||
    description.kind === "semantic"
  ) {
    return { definitionIds: {}, ownerIds: {}, names: {} };
  }
  const candidateIds =
    description.kind === "allocation"
      ? description.candidates.map((candidate) => candidate.id)
      : description.candidateIds;
  const candidates = candidateIds.flatMap((candidateId) => {
    const object = state.objects[grandArchiveObjectId(candidateId)];
    return !object || (object.facing === "face-down" && object.zone === "banishment")
      ? []
      : [object];
  });
  return {
    definitionIds: Object.fromEntries(
      candidates.map((object) => [object.id, object.activeDefinitionId ?? object.definitionId]),
    ),
    ownerIds: Object.fromEntries(candidates.map((object) => [object.id, object.ownerId])),
    names: Object.fromEntries(
      candidates.flatMap((object) =>
        object.nameOverride ? [[object.id, object.nameOverride]] : [],
      ),
    ),
  };
}

export class GrandArchiveServerEngine implements ServerGameEngine {
  readonly program: GrandArchiveMatchProgram;
  readonly runtime: GrandArchiveMatchRuntime;
  #replayJournal: GrandArchiveReplayJournalV1;

  constructor(
    program: GrandArchiveMatchProgram,
    runtime: GrandArchiveMatchRuntime,
    replayJournal: GrandArchiveReplayJournalV1 = createGrandArchiveReplayJournal(
      serializeGrandArchiveMatchSnapshot(runtime.state),
      program.fingerprint,
    ),
  ) {
    this.program = program;
    this.runtime = runtime;
    this.#replayJournal = replayJournal;
  }

  get replayJournal(): GrandArchiveReplayJournalV1 {
    return this.#replayJournal;
  }
  exportReplay(): GrandArchiveReplayV1 {
    return exportGrandArchiveReplay(
      this.program,
      this.#replayJournal,
      serializeGrandArchiveMatchSnapshot(this.runtime.state),
    );
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    if (!isGrandArchiveMoveName(moveType)) {
      return {
        success: false,
        error: `Unknown move: ${moveType}`,
        errorCode: "unknown_move",
        stateID: this.getStateID(),
      };
    }
    const { expectedStateVersion, objectIncarnations, ...commandPayload } = payload;
    if (
      typeof expectedStateVersion !== "number" ||
      !Number.isSafeInteger(expectedStateVersion) ||
      expectedStateVersion < 0
    ) {
      return {
        success: false,
        error: "Grand Archive commands require a non-negative integer expectedStateVersion.",
        errorCode: "invalid_command_payload",
        stateID: this.getStateID(),
      };
    }
    // The envelope guards the current match version. A decision command's
    // stateVersion guards the pending decision and can be an earlier version.
    const command = decodeGrandArchiveCommand(moveType, commandPayload);
    if (!command) {
      return {
        success: false,
        error: "Grand Archive command payload is malformed.",
        errorCode: "invalid_command_payload",
        stateID: this.getStateID(),
      };
    }
    const expectedIncarnations = grandArchiveCommandIncarnations(this.runtime, command);
    if (Object.keys(expectedIncarnations).length > 0) {
      if (
        !objectIncarnations ||
        typeof objectIncarnations !== "object" ||
        Array.isArray(objectIncarnations)
      ) {
        return {
          success: false,
          error: "Object-targeting commands require incarnation guards.",
          errorCode: "missing_object_incarnation",
          stateID: this.getStateID(),
        };
      }
      for (const [objectId, incarnation] of Object.entries(expectedIncarnations)) {
        if ((objectIncarnations as Record<string, unknown>)[objectId] !== incarnation) {
          return {
            success: false,
            error: `Command targets a stale incarnation of ${objectId}.`,
            errorCode: "stale_interaction",
            stateID: this.getStateID(),
          };
        }
      }
    }
    return this.execute(command, actorId, expectedStateVersion, context);
  }

  getStateID(): number {
    return this.runtime.state.stateVersion;
  }
  getState(): unknown {
    return this.runtime.state;
  }

  getViewerState(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    if (viewer.role === "player") {
      return projectGrandArchiveViewerState(
        this.program,
        this.runtime.state,
        grandArchivePlayerId(viewer.actorId),
      );
    }
    if (viewer.role === "replay") {
      return projectGrandArchivePublicReplayState(this.program, this.runtime.state);
    }
    const state = this.runtime.state;
    return {
      schemaVersion: 1,
      stateVersion: state.stateVersion,
      mode: state.mode,
      status: state.status,
      winnerIds: state.winnerIds,
      turn: state.turn,
      players: state.turnOrder.map((id) => ({
        id,
        name: state.players[id]?.name,
        lost: state.players[id]?.lost,
      })),
    };
  }

  getViewerResources(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    if (viewer.role === "spectator") return { cardsById: {} };
    const projected =
      viewer.role === "player"
        ? projectGrandArchiveViewerState(
            this.program,
            this.runtime.state,
            grandArchivePlayerId(viewer.actorId),
          )
        : projectGrandArchivePublicReplayState(this.program, this.runtime.state);
    const visibleIds = visibleDefinitionIds(projected);
    const authorizedCards =
      viewer.role === "player"
        ? authorizedDecisionCardInstances(this.program, this.runtime.state, viewer.actorId)
        : { definitionIds: {}, ownerIds: {}, names: {} };
    const interactionCommandNamesByActionId =
      viewer.role === "player"
        ? Object.fromEntries(
            [
              ...projectGrandArchiveInteraction(this.runtime, viewer.actorId).commandsByActionId,
            ].map(([actionId, commands]) => [actionId, commands[0]?.command.move ?? "unknown"]),
          )
        : {};
    if (viewer.role === "player") {
      for (const definitionId of Object.values(authorizedCards.definitionIds)) {
        visibleIds.add(definitionId);
      }
    }
    return {
      cardsById: Object.fromEntries(
        [...visibleIds].flatMap((id) =>
          this.program.cardsById[id] ? [[id, this.program.cardsById[id]]] : [],
        ),
      ),
      authorizedCardDefinitionIds: authorizedCards.definitionIds,
      authorizedCardOwnerIds: authorizedCards.ownerIds,
      authorizedCardNames: authorizedCards.names,
      interactionCommandNamesByActionId,
    };
  }

  getActivePlayerId(): string | undefined {
    const wait = readGrandArchiveWaitState(this.runtime.state);
    return "playerId" in wait
      ? wait.playerId
      : wait.kind === "game-over"
        ? undefined
        : this.runtime.state.turn.playerId;
  }
  getInteractionActorIds(): readonly string[] {
    return this.runtime.state.turnOrder;
  }
  getInteractionView(actorId: string): EngineInteractionView {
    return projectGrandArchiveInteraction(this.runtime, actorId).view;
  }

  submitInteraction(
    actorId: string,
    submission: InteractionSubmission,
    context: DispatchContext,
  ): DispatchResult {
    if (
      submission.correlationId &&
      this.#replayJournal.acceptedCorrelationIds.includes(submission.correlationId)
    ) {
      return {
        success: false,
        error: "This interaction was already accepted.",
        errorCode: "duplicate_interaction",
        stateID: this.getStateID(),
      };
    }
    const view = this.getInteractionView(actorId);
    const validation = validateInteractionSubmission(view, submission);
    if (!validation.ok) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.issues.some(
          (issue) => issue.code === "stale_state" || issue.code === "stale_request",
        )
          ? "stale_interaction"
          : "invalid_interaction_submission",
        stateID: this.getStateID(),
      };
    }
    const legal = commandForGrandArchiveSubmission(this.runtime, actorId, submission);
    if (!legal || legal.stateVersion !== submission.stateVersion) {
      return {
        success: false,
        error: "The selected Grand Archive action is no longer legal.",
        errorCode: "stale_interaction",
        stateID: this.getStateID(),
      };
    }
    return this.execute(
      legal.command,
      actorId,
      submission.stateVersion,
      context,
      undefined,
      submission.correlationId,
    );
  }

  hasGameEnded(): boolean {
    return this.runtime.state.status === "finished";
  }
  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    if (!this.hasGameEnded()) return undefined;
    const winnerId =
      this.runtime.state.winnerIds.length === 1 ? this.runtime.state.winnerIds[0] : undefined;
    return {
      ...(winnerId ? { winnerId } : {}),
      reason: winnerId ? "Grand Archive game outcome" : "draw",
    };
  }
  forfeit(winnerId: string, reason: string, context: DispatchContext): DispatchResult {
    const loserId = this.runtime.state.turnOrder.find((id) => id !== winnerId);
    if (!loserId || !this.runtime.state.players[grandArchivePlayerId(winnerId)]) {
      return {
        success: false,
        error: "Forfeit winner is not seated.",
        errorCode: "invalid_forfeit_winner",
        stateID: this.getStateID(),
      };
    }
    return this.execute({ move: "concede" }, loserId, this.getStateID(), context, reason);
  }

  private execute(
    command: GrandArchiveCommand,
    actorId: string,
    expectedStateVersion: number,
    context: DispatchContext,
    reason?: string,
    correlationId?: string,
  ): DispatchResult {
    const transition = this.runtime.execute(command, {
      playerId: grandArchivePlayerId(actorId),
      expectedStateVersion,
    });
    if (!transition.ok) {
      return {
        success: false,
        error: transition.message,
        errorCode: transition.code === "stale-state" ? "stale_interaction" : transition.code,
        stateID: transition.state.stateVersion,
      };
    }
    const timestamp = Date.now();
    this.#replayJournal = appendGrandArchiveReplayCommand(this.#replayJournal, {
      sequence: this.#replayJournal.commands.length,
      actorId,
      expectedStateVersion,
      resultingStateVersion: transition.state.stateVersion,
      command,
      eventTypes: transition.events.map((event) => event.type),
      ...(correlationId ? { correlationId } : {}),
    });
    const safeCommand = { move: command.move };
    const acceptedMoveRecord: AcceptedMoveRecord = {
      gameId: context.gameId,
      stateVersion: transition.state.stateVersion,
      turnNumber: transition.state.turn.number,
      actorId,
      moveId: command.move,
      input: { stateVersion: expectedStateVersion },
      processedCommand: safeCommand,
      timestamp,
      sourceAuthority: context.sourceAuthority,
      newStateID: transition.state.stateVersion,
      transitionType: "move",
    };
    const projectedLogs = Object.fromEntries(
      transition.state.turnOrder.map((playerId) => [
        playerId,
        projectGrandArchiveViewerLog(this.program, transition.state, playerId, transition.events),
      ]),
    );
    const firstPlayerLogs = projectedLogs[transition.state.turnOrder[0]!] ?? [];
    const publicLogs = firstPlayerLogs.filter((message) => {
      const fingerprint = fingerprintGrandArchiveValue(message);
      return transition.state.turnOrder
        .slice(1)
        .every((playerId) =>
          projectedLogs[playerId]?.some(
            (candidate) => fingerprintGrandArchiveValue(candidate) === fingerprint,
          ),
        );
    });
    const publicFingerprints = new Set(publicLogs.map(fingerprintGrandArchiveValue));
    const privateByPlayerId = Object.fromEntries(
      Object.entries(projectedLogs).map(([playerId, messages]) => [
        playerId,
        messages.filter(
          (message) => !publicFingerprints.has(fingerprintGrandArchiveValue(message)),
        ),
      ]),
    );
    const engineLogRecords: EngineLogRecord[] = [
      {
        gameId: context.gameId,
        stateVersion: transition.state.stateVersion,
        timestamp,
        sourceAuthority: context.sourceAuthority,
        log: {
          moveType: command.move,
          playerId: actorId,
          timestamp,
          turnNumber: transition.state.turn.number,
          public: publicLogs,
          privateByPlayerId,
        },
      },
    ];
    return {
      success: true,
      stateID: transition.state.stateVersion,
      state: transition.state,
      transition: "move",
      acceptedMoveRecord,
      engineLogRecords,
      processedCommand: { ...safeCommand, ...(reason ? { reason } : {}) },
    };
  }
}
