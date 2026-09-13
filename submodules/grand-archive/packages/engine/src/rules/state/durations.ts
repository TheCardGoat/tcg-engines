import type { GrandArchiveDuration, GrandArchivePhase } from "@tcg/grand-archive-types";
import {
  evaluateGrandArchiveCondition,
  GrandArchiveUnsupportedRuleError,
  resolveGrandArchivePlayers,
  type GrandArchiveEvaluationContext,
} from "../../procedures/effects/evaluation.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveDurationAnchors, GrandArchiveMatchState } from "../../game/model.ts";

export type GrandArchiveDurationStatus = "pending" | "active" | "expired";

export interface GrandArchiveDurationInstance {
  readonly sourceId?: GrandArchiveObjectId;
  readonly createdAtVersion: number;
  readonly createdTurnNumber: number;
  readonly createdPhase: GrandArchivePhase;
  readonly durationAnchors: GrandArchiveDurationAnchors;
}

export interface GrandArchiveDurationEvaluation {
  readonly conditionMet?: boolean;
  readonly subjectsRemainInZone?: boolean;
}

interface GrandArchiveDurationContext {
  readonly state: GrandArchiveMatchState;
}

export function anchorGrandArchiveDuration(
  duration: GrandArchiveDuration,
  context: GrandArchiveEvaluationContext,
): GrandArchiveDurationAnchors {
  switch (duration.kind) {
    case "until-end-of-turn":
    case "until-end-of-next-turn":
    case "until-start-of-turn":
    case "during-next-turn":
      return { whosePlayerIds: resolveSingleDurationPlayer(duration.whose, context) };
    case "until-end-of-next-phase":
      return duration.whose
        ? { whosePlayerIds: resolveSingleDurationPlayer(duration.whose, context) }
        : {};
    case "for-next-event":
      return {
        ...(duration.starts
          ? { startsPlayerIds: resolveSingleDurationPlayer(duration.starts.whose, context) }
          : {}),
        ...(duration.expires
          ? { expires: anchorGrandArchiveDuration(duration.expires, context) }
          : {}),
      };
    case "this-turn":
    case "this-attack":
    case "until-end-of-phase":
    case "while-source-on-field":
    case "while-source-in-functional-zone":
    case "while-subjects-in-zone":
    case "while-condition":
    case "permanent":
      return {};
    default:
      return assertNever(duration);
  }
}

function resolveSingleDurationPlayer(
  whose: Parameters<typeof resolveGrandArchivePlayers>[0],
  context: GrandArchiveEvaluationContext,
): readonly GrandArchivePlayerId[] {
  const players = resolveGrandArchivePlayers(whose, context);
  if (players.length !== 1) {
    throw new GrandArchiveUnsupportedRuleError("temporal duration requires exactly one player");
  }
  return players;
}

function anchoredPlayers(
  players: readonly GrandArchivePlayerId[] | undefined,
  label: string,
): readonly GrandArchivePlayerId[] {
  if (!players || players.length !== 1) {
    throw new Error(`Grand Archive ${label} duration has no anchored player`);
  }
  return players;
}

function firstTurnStartedAfter(
  instance: GrandArchiveDurationInstance,
  context: GrandArchiveDurationContext,
  playerIds: readonly GrandArchivePlayerId[],
):
  | Extract<GrandArchiveMatchState["eventHistory"][number], { readonly type: "turn-started" }>
  | undefined {
  return context.state.eventHistory.find(
    (event): event is Extract<typeof event, { readonly type: "turn-started" }> =>
      event.stateVersion > instance.createdAtVersion &&
      event.type === "turn-started" &&
      playerIds.includes(event.playerId),
  );
}

function turnEndedAfter(turnNumber: number, context: GrandArchiveDurationContext): boolean {
  return context.state.eventHistory.some(
    (event) => event.type === "turn-started" && event.turnNumber > turnNumber,
  );
}

function turnCleanupStartedAfter(
  turnNumber: number,
  stateVersion: number,
  context: GrandArchiveDurationContext,
): boolean {
  let currentTurnNumber = 1;
  for (const event of context.state.eventHistory) {
    if (event.type === "turn-started") currentTurnNumber = event.turnNumber;
    if (
      event.stateVersion > stateVersion &&
      currentTurnNumber === turnNumber &&
      event.type === "turn-cleanup-pending-changed" &&
      event.value
    ) {
      return true;
    }
  }
  return false;
}

function phaseBoundary(event: GrandArchiveMatchState["eventHistory"][number]) {
  return (
    event.type === "phase-changed" ||
    event.type === "turn-started" ||
    event.type === "combat-started" ||
    event.type === "combat-ended"
  );
}

function nextPhaseStatus(
  phase: GrandArchivePhase,
  whosePlayerIds: readonly GrandArchivePlayerId[] | undefined,
  instance: GrandArchiveDurationInstance,
  context: GrandArchiveDurationContext,
): GrandArchiveDurationStatus {
  let turnPlayerId = context.state.turnOrder[0];
  let enteredAtVersion: number | undefined;
  for (const event of context.state.eventHistory) {
    if (event.type === "turn-started") turnPlayerId = event.playerId;
    if (event.stateVersion <= instance.createdAtVersion) continue;
    const beginsPhase =
      (event.type === "phase-changed" && event.phase === phase) ||
      (event.type === "combat-started" && phase === "combat");
    if (
      enteredAtVersion === undefined &&
      beginsPhase &&
      (!whosePlayerIds || (turnPlayerId !== undefined && whosePlayerIds.includes(turnPlayerId)))
    ) {
      enteredAtVersion = event.stateVersion;
      continue;
    }
    if (
      enteredAtVersion !== undefined &&
      event.stateVersion > enteredAtVersion &&
      phaseBoundary(event)
    ) {
      return "expired";
    }
  }
  return "active";
}

export function grandArchiveDurationStatus(
  duration: GrandArchiveDuration,
  instance: GrandArchiveDurationInstance,
  context: GrandArchiveDurationContext,
  evaluation: GrandArchiveDurationEvaluation = {},
  anchors: GrandArchiveDurationAnchors = instance.durationAnchors,
): GrandArchiveDurationStatus {
  switch (duration.kind) {
    case "while-source-on-field":
      return instance.sourceId && context.state.objects[instance.sourceId]?.zone === "field"
        ? "active"
        : "expired";
    case "while-source-in-functional-zone":
      return instance.sourceId && context.state.objects[instance.sourceId] ? "active" : "expired";
    case "this-attack":
      return context.state.combat ? "active" : "expired";
    case "this-turn":
      return context.state.turn.number === instance.createdTurnNumber &&
        !turnCleanupStartedAfter(instance.createdTurnNumber, instance.createdAtVersion, context)
        ? "active"
        : "expired";
    case "until-end-of-turn": {
      const players = anchoredPlayers(anchors.whosePlayerIds, duration.kind);
      const createdTurnPlayerId = turnPlayerAtVersion(instance.createdAtVersion, context);
      const targetTurn = players.includes(createdTurnPlayerId)
        ? instance.createdTurnNumber
        : firstTurnStartedAfter(instance, context, players)?.turnNumber;
      return targetTurn !== undefined &&
        (turnCleanupStartedAfter(targetTurn, instance.createdAtVersion, context) ||
          turnEndedAfter(targetTurn, context))
        ? "expired"
        : "active";
    }
    case "until-end-of-next-turn": {
      const targetTurn = firstTurnStartedAfter(
        instance,
        context,
        anchoredPlayers(anchors.whosePlayerIds, duration.kind),
      )?.turnNumber;
      return targetTurn !== undefined &&
        (turnCleanupStartedAfter(targetTurn, instance.createdAtVersion, context) ||
          turnEndedAfter(targetTurn, context))
        ? "expired"
        : "active";
    }
    case "until-start-of-turn":
      return firstTurnStartedAfter(
        instance,
        context,
        anchoredPlayers(anchors.whosePlayerIds, duration.kind),
      )
        ? "expired"
        : "active";
    case "until-end-of-phase":
      if (instance.createdPhase !== duration.phase) return "expired";
      return context.state.eventHistory.some(
        (event) => event.stateVersion > instance.createdAtVersion && phaseBoundary(event),
      )
        ? "expired"
        : "active";
    case "until-end-of-next-phase":
      return nextPhaseStatus(duration.phase, anchors.whosePlayerIds, instance, context);
    case "during-next-turn": {
      const targetTurn = firstTurnStartedAfter(
        instance,
        context,
        anchoredPlayers(anchors.whosePlayerIds, duration.kind),
      )?.turnNumber;
      if (targetTurn === undefined) return "pending";
      return turnEndedAfter(targetTurn, context) ? "expired" : "active";
    }
    case "for-next-event": {
      if (duration.starts) {
        const start = firstTurnStartedAfter(
          instance,
          context,
          anchoredPlayers(anchors.startsPlayerIds, `${duration.kind} start`),
        );
        if (!start) return "pending";
      }
      return duration.expires
        ? grandArchiveDurationStatus(
            duration.expires,
            instance,
            context,
            evaluation,
            anchors.expires ?? {},
          )
        : "active";
    }
    case "while-subjects-in-zone":
      return evaluation.subjectsRemainInZone ? "active" : "expired";
    case "while-condition":
      return evaluation.conditionMet ? "active" : "pending";
    case "permanent":
      return "active";
    default:
      return assertNever(duration);
  }
}

function turnPlayerAtVersion(
  stateVersion: number,
  context: GrandArchiveDurationContext,
): GrandArchivePlayerId {
  let playerId = context.state.turnOrder[0];
  if (!playerId) throw new Error("Grand Archive match has no turn player");
  for (const event of context.state.eventHistory) {
    if (event.stateVersion > stateVersion) break;
    if (event.type === "turn-started") playerId = event.playerId;
  }
  return playerId;
}

export function grandArchiveDurationConditionMet(
  condition: Parameters<typeof evaluateGrandArchiveCondition>[0] | undefined,
  context: GrandArchiveEvaluationContext,
): boolean {
  return !condition || evaluateGrandArchiveCondition(condition, context);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive duration: ${JSON.stringify(value)}`);
}
