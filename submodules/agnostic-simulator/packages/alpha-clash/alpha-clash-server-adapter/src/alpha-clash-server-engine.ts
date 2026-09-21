import { applyCommand, projectState } from "@tcg/alpha-clash-engine";
import type { AcCommand, MatchState, PlayerId, ProjectedState } from "@tcg/alpha-clash-engine";
import {
  validateInteractionSubmission,
  type AnimationPlanV2,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import { createCanonicalEngineMoveLog, createEngineLogMessage } from "@tcg/shared/game-engine";
import type {
  AcceptedMoveRecord,
  BotActionOptions,
  BotActionResult,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import {
  alphaClashSubmissionToPayload,
  buildAlphaClashInteractionView,
} from "./interaction-protocol";
import { alphaClashBotCommandCandidates } from "./bot";

/** The engine's two seats (rule 103.1); platform actor ids map onto them. */
type Seat = PlayerId;

export class AlphaClashServerEngine implements ServerGameEngine {
  private lastLoggedSequence: number;
  /**
   * Monotonic per-applied-command version. moveLog.length is NOT a valid
   * substitute: commands that apply without logging (startGame) would replay
   * the previous version and platform persistence would drop the update.
   */
  private versionCounter: number;

  state: MatchState;
  readonly playerIdToSeat: Record<string, Seat>;

  constructor(state: MatchState, playerIdToSeat: Record<string, Seat>) {
    this.state = state;
    this.playerIdToSeat = playerIdToSeat;
    this.lastLoggedSequence = state.moveLog.at(-1)?.sequence ?? 0;
    this.versionCounter = state.stateID ?? state.moveLog.length;
  }

  get seatToPlayerId(): Record<Seat, string> {
    const map: Partial<Record<Seat, string>> = {};
    for (const [playerId, seat] of Object.entries(this.playerIdToSeat)) {
      map[seat] = playerId;
    }
    return map as Record<Seat, string>;
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    const seat = this.playerIdToSeat[actorId];
    if (!seat) {
      return {
        success: false,
        error: `Unknown actor: ${actorId}`,
        errorCode: "INVALID_ARGUMENTS",
        stateID: this.getStateID(),
      };
    }

    const command = buildEngineCommand(moveType, seat, payload);
    if (!command) {
      return {
        success: false,
        error: `Unknown move type: ${moveType}`,
        errorCode: "UNKNOWN_MOVE",
        stateID: this.getStateID(),
      };
    }

    const result = applyCommand(this.state, command);
    if (!result.success) {
      return {
        success: false,
        error: result.error ?? "Command rejected",
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      };
    }

    this.state = result.state;
    this.versionCounter += 1;
    this.state.stateID = this.versionCounter;
    const stateVersion = this.getStateID();
    const timestamp = Date.now();
    const acceptedMoveRecord: AcceptedMoveRecord = {
      gameId: context.gameId,
      stateVersion,
      turnNumber: result.state.turnNumber,
      actorId,
      moveId: moveType,
      input: { args: payload },
      processedCommand: command,
      timestamp,
      sourceAuthority: context.sourceAuthority,
      newStateID: stateVersion,
      transitionType: "move",
    };

    // Public engine move log entries become canonical records; private
    // entries (hidden-zone moves) stay out of the public payload.
    const engineLogRecords: EngineLogRecord[] = result.state.moveLog
      .filter((entry) => entry.sequence > this.lastLoggedSequence)
      .map((entry) => ({
        gameId: context.gameId,
        stateVersion,
        timestamp,
        sourceAuthority: context.sourceAuthority,
        log: toCanonicalLog(entry, command.type, actorId, this.seatToPlayerId, timestamp),
      }));
    this.lastLoggedSequence = result.state.moveLog.at(-1)?.sequence ?? this.lastLoggedSequence;

    return {
      success: true,
      stateID: stateVersion,
      state: result.state,
      animations: [],
      animationPlan: this.nullAnimationPlan(),
      transition: "move",
      acceptedMoveRecord,
      engineLogRecords,
    };
  }

  /** Alpha Clash's engine emits no animation packets yet; the plan is empty. */
  private nullAnimationPlan(): AnimationPlanV2 | null {
    return null;
  }

  getStateID(): number {
    return this.versionCounter;
  }

  getState(): unknown {
    return this.state;
  }

  getViewerState(
    viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" },
  ): unknown {
    const seat = viewer.role === "player" ? this.playerIdToSeat[viewer.actorId] : "spectator";
    return projectState(this.state, seat ?? "spectator");
  }

  getActivePlayerId(): string | undefined {
    const pendingChoice = this.state.pendingChoices[0];
    if (pendingChoice) return this.seatToPlayerId[pendingChoice.playerId];
    if (this.state.responseWindow) {
      return this.seatToPlayerId[this.state.responseWindow.openFor];
    }
    if (this.state.clash) {
      const stepOwner = clashStepSeat(this.state);
      if (stepOwner) return this.seatToPlayerId[stepOwner];
      return undefined;
    }
    return this.seatToPlayerId[this.state.activePlayer];
  }

  hasGameEnded(): boolean {
    return this.state.phase.name === "complete";
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    if (this.state.phase.name !== "complete") return undefined;
    return {
      winnerId: this.seatToPlayerId[this.state.phase.winner],
      reason: this.state.phase.reason,
    };
  }

  getInteractionView(actorId: string): EngineInteractionView {
    const seat = this.playerIdToSeat[actorId] ?? "spectator";
    const playerView = projectState(this.state, seat);
    return buildAlphaClashInteractionView({
      actorId,
      seat,
      stateVersion: this.getStateID(),
      playerView,
    });
  }

  getInteractionActorIds(): readonly string[] {
    return Object.keys(this.playerIdToSeat);
  }

  takeAutomatedAction(_options: BotActionOptions, context: DispatchContext): BotActionResult {
    const actorId = this.seatToPlayerId[seatForAutomation(this.state)] ?? this.activeActorId();
    if (!actorId) {
      return {
        finalResult: {
          success: false,
          error: "Alpha Clash has no active bot actor.",
          errorCode: "MOVE_NOT_AVAILABLE",
          stateID: this.getStateID(),
        },
        blocked: { reason: "no-active-actor" },
      };
    }
    const seat = this.playerIdToSeat[actorId];
    // Try the policy's proposal first, then its fallbacks (endTurn, pass) so
    // one illegal proposal can no longer deadlock the automation pump.
    const candidates = alphaClashBotCommandCandidates(this.state, seat);
    let lastFailure: BotActionResult = {
      finalResult: {
        success: false,
        error: "The Alpha Clash automation policy could not produce an action.",
        errorCode: "MOVE_NOT_AVAILABLE",
        stateID: this.getStateID(),
      },
      blocked: { reason: "strategy-stuck" },
    };
    for (const command of candidates) {
      const payload: Record<string, unknown> = { ...command };
      delete payload.type;
      const finalResult = this.dispatch(command.type, actorId, payload, context);
      if (finalResult.success) {
        return {
          finalResult,
          selectedCandidate: { family: command.type },
        };
      }
      lastFailure = { finalResult };
    }
    return lastFailure;
  }

  private activeActorId(): string {
    return this.seatToPlayerId[this.state.activePlayer] ?? Object.keys(this.playerIdToSeat)[0];
  }

  submitInteraction(
    actorId: string,
    submission: InteractionSubmission,
    context: DispatchContext,
  ): DispatchResult {
    const currentStateID = this.getStateID();
    const view = this.getInteractionView(actorId);
    const validation = validateInteractionSubmission(view, submission);
    if (!validation.ok) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.issues.some((issue) => issue.code === "stale_state")
          ? "stale_interaction"
          : "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }

    try {
      const translated = alphaClashSubmissionToPayload(submission);
      return this.dispatch(translated.moveType, actorId, translated.payload, context);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid interaction submission.",
        errorCode: "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }
  }
}

/** The seat whose turn it is to act, from the engine's public pacing state. */
export function clashStepSeat(state: MatchState): Seat | undefined {
  const pendingChoice = state.pendingChoices[0];
  if (pendingChoice) return pendingChoice.playerId;
  if (state.responseWindow) return state.responseWindow.openFor;
  if (!state.clash) return state.activePlayer;
  const attacker = state.cards[state.clash.attackerId]?.controller;
  switch (state.clash.step) {
    case "attack":
    case "attackerBuff":
      return attacker ?? state.activePlayer;
    case "counter":
    case "obstruct":
    case "defenderBuff":
      return attacker ? (attacker === "player-one" ? "player-two" : "player-one") : undefined;
    case "beforeDamage":
      // Rule 504.2f (v8.0): the attacker holds priority until they pass;
      // afterwards the defender may act or pass into the damage step.
      if (state.clash.attackerPassedBeforeDamage) {
        return attacker ? (attacker === "player-one" ? "player-two" : "player-one") : undefined;
      }
      return attacker ?? state.activePlayer;
    default:
      return undefined;
  }
}

function seatForAutomation(state: MatchState): Seat {
  return clashStepSeat(state) ?? state.activePlayer;
}

function buildEngineCommand(
  moveType: string,
  seat: Seat,
  payload: Record<string, unknown>,
): AcCommand | null {
  const cardId = typeof payload.cardId === "string" ? payload.cardId : "";
  switch (moveType) {
    case "startGame":
      return { type: "startGame" };
    case "mulligan":
      return { type: "mulligan", playerId: seat };
    case "deployResource":
      return { type: "deployResource", playerId: seat, cardId };
    case "playCard": {
      if (!cardId) return null;
      return {
        type: "playCard",
        playerId: seat,
        cardId,
        ...(typeof payload.targetId === "string" ? { targetId: payload.targetId } : {}),
        ...(Array.isArray(payload.targetIds)
          ? { targetIds: payload.targetIds.filter((id): id is string => typeof id === "string") }
          : {}),
        ...(typeof payload.xValue === "number" ? { xValue: payload.xValue } : {}),
        ...(Array.isArray(payload.alternateCostSacrificeIds)
          ? {
              alternateCostSacrificeIds: payload.alternateCostSacrificeIds.filter(
                (id): id is string => typeof id === "string",
              ),
            }
          : {}),
      };
    }
    case "setCard":
      return cardId ? { type: "setCard", playerId: seat, cardId } : null;
    case "respond":
      return cardId
        ? {
            type: "respond",
            playerId: seat,
            cardId,
            ...(typeof payload.targetId === "string" ? { targetId: payload.targetId } : {}),
            ...(typeof payload.xValue === "number" ? { xValue: payload.xValue } : {}),
          }
        : null;
    case "activatePortal":
      return { type: "activatePortal", playerId: seat };
    case "attachWeapon": {
      const targetId = typeof payload.targetId === "string" ? payload.targetId : "";
      return cardId && targetId
        ? { type: "attachWeapon", playerId: seat, weaponId: cardId, targetId }
        : null;
    }
    case "detachWeapon":
      return cardId ? { type: "detachWeapon", playerId: seat, weaponId: cardId } : null;
    case "initiateClash": {
      const attackerId = typeof payload.attackerId === "string" ? payload.attackerId : "";
      const targetId = typeof payload.targetId === "string" ? payload.targetId : "";
      return attackerId && targetId
        ? { type: "initiateClash", playerId: seat, attackerId, targetId }
        : null;
    }
    case "declareObstructors":
      return {
        type: "declareObstructors",
        playerId: seat,
        obstructorIds: Array.isArray(payload.obstructorIds)
          ? payload.obstructorIds.filter((id): id is string => typeof id === "string")
          : [],
      };
    case "activateAbility": {
      if (!cardId || typeof payload.abilityIndex !== "number") return null;
      return {
        type: "activateAbility",
        playerId: seat,
        cardId,
        abilityIndex: payload.abilityIndex,
        ...(typeof payload.targetId === "string" ? { targetId: payload.targetId } : {}),
        ...(Array.isArray(payload.targetIds)
          ? { targetIds: payload.targetIds.filter((id): id is string => typeof id === "string") }
          : {}),
        ...(typeof payload.xValue === "number" ? { xValue: payload.xValue } : {}),
      };
    }
    case "pass":
      return { type: "pass", playerId: seat };
    case "endTurn":
      return { type: "endTurn", playerId: seat };
    case "resolveChoice":
      return typeof payload.choiceId === "string"
        ? {
            type: "resolveChoice",
            playerId: seat,
            choiceId: payload.choiceId,
            ...(typeof payload.optionId === "string" ? { optionId: payload.optionId } : {}),
            ...(payload.division && typeof payload.division === "object"
              ? { division: payload.division as Record<string, number> }
              : {}),
          }
        : null;
    case "concede":
      return { type: "concede", playerId: seat };
    default:
      return null;
  }
}

function toCanonicalLog(
  entry: MatchState["moveLog"][number],
  moveType: string,
  actorId: string,
  seatToPlayerId: Record<Seat, string>,
  timestamp: number,
) {
  // Framework entries (state-based actions, phase moves) carry no playerId;
  // they are attributed to the dispatching actor.
  const playerId = entry.playerId ? seatToPlayerId[entry.playerId] : actorId;
  const key = "alpha-clash.log.entry";
  return createCanonicalEngineMoveLog({
    moveType,
    playerId,
    timestamp,
    turnNumber: undefined,
    messages:
      entry.public || entry.playerId === undefined
        ? [
            createEngineLogMessage({
              key,
              defaultMessage: entry.message,
              values: { logType: entry.type },
            }),
          ]
        : [],
    ...(entry.public || entry.playerId === undefined
      ? {}
      : {
          privateByPlayerId: {
            [seatToPlayerId[entry.playerId] ?? entry.playerId]: [
              createEngineLogMessage({
                key,
                defaultMessage: entry.message,
                values: { logType: entry.type },
              }),
            ],
          },
        }),
  });
}

export type { ProjectedState };
