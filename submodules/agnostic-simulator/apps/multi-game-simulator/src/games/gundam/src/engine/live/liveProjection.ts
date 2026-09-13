import type { FilteredMatchView, GundamG } from "@tcg/gundam-engine";

/**
 * Decode the only state shape that a live Gundam player is allowed to consume.
 * Raw replay/runtime snapshots contain `ctx.zones.private` and must never enter
 * the live renderer, even if a server regression sends one over the gateway.
 */
export function parseGundamLiveProjection(value: unknown): FilteredMatchView<GundamG> | null {
  return isGundamLiveProjection(value) ? value : null;
}

function isGundamLiveProjection(value: unknown): value is FilteredMatchView<GundamG> {
  if (!isRecord(value) || Object.hasOwn(value, "ctx")) return false;
  if (!isGundamGameState(value.G)) return false;
  if (!isNonNegativeInteger(value.stateID)) return false;
  if (!isStatus(value.status)) return false;
  if (!isFilteredZones(value.zones)) return false;
  if (!Array.isArray(value.players) || !value.players.every(isFilteredPlayer)) return false;
  if (!isStringArray(value.availableMoves)) return false;
  if (value.myPlayerId !== undefined && typeof value.myPlayerId !== "string") return false;
  if (!isTimerView(value.timerView)) return false;
  return true;
}

function isStatus(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (
    (value.gameSegment !== undefined && typeof value.gameSegment !== "string") ||
    (value.phase !== undefined && typeof value.phase !== "string") ||
    (value.step !== undefined && typeof value.step !== "string") ||
    (value.turnPlayer !== undefined && typeof value.turnPlayer !== "string") ||
    (value.winner !== undefined && typeof value.winner !== "string") ||
    (value.winReason !== undefined && typeof value.winReason !== "string") ||
    (value.nextTurnPlayer !== undefined && typeof value.nextTurnPlayer !== "string")
  ) {
    return false;
  }
  return (
    isNonNegativeInteger(value.turn) &&
    typeof value.activePlayer === "string" &&
    typeof value.gameEnded === "boolean" &&
    isStringArray(value.pendingDecision)
  );
}

function isGundamGameState(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isRecordOf(value.players, isRecord) &&
    isRecordOf(value.damage, (entry) => typeof entry === "number") &&
    isRecordOf(value.exhausted, (entry) => typeof entry === "boolean") &&
    isRecordOf(value.pilotAssignments, (entry) => typeof entry === "string") &&
    isRecord(value.turnMetadata) &&
    Array.isArray(value.pendingEffects) &&
    value.pendingEffects.every(isRecord) &&
    Array.isArray(value.continuousEffects) &&
    value.continuousEffects.every(isRecord) &&
    isStringArray(value.resolvedThisTurn) &&
    isRecordOf(value.eventCounters, (entry) => typeof entry === "number") &&
    (value.pendingEffectPreHaltActor === undefined ||
      typeof value.pendingEffectPreHaltActor === "string") &&
    (value.pendingEffectCurrentMoveId === undefined ||
      typeof value.pendingEffectCurrentMoveId === "string") &&
    (value.pendingEffectCurrentPriorityGeneration === undefined ||
      typeof value.pendingEffectCurrentPriorityGeneration === "number")
  );
}

function isFilteredZones(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.zones)) return false;
  return Object.values(value.zones).every(isFilteredZone);
}

function isFilteredZone(value: unknown): boolean {
  if (!isRecord(value) || !isNonNegativeInteger(value.count) || !Array.isArray(value.cards)) {
    return false;
  }
  if (value.topCardId !== undefined && typeof value.topCardId !== "string") return false;
  return value.cards.every(isFilteredCard);
}

function isFilteredCard(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (
    typeof value.instanceId !== "string" ||
    typeof value.ownerId !== "string" ||
    typeof value.controllerId !== "string" ||
    typeof value.zoneId !== "string" ||
    typeof value.faceDown !== "boolean"
  ) {
    return false;
  }
  if (value.definition !== null && !isRecord(value.definition)) return false;
  if (value.definitionId !== null && typeof value.definitionId !== "string") return false;
  if (value.meta !== null && !isRecord(value.meta)) return false;

  // A face-down card carrying any identity or metadata is not a safe player
  // projection. Reject the whole snapshot instead of rendering partial data.
  return (
    !value.faceDown ||
    (value.definition === null && value.definitionId === null && value.meta === null)
  );
}

function isFilteredPlayer(value: unknown): boolean {
  return isRecord(value) && typeof value.playerId === "string" && isRecord(value.publicData);
}

function isTimerView(value: unknown): boolean {
  if (!isRecord(value) || typeof value.serverTimestamp !== "number") return false;
  if (value.players === undefined) return true;
  if (!isRecord(value.players)) return false;
  return Object.values(value.players).every(
    (clock) =>
      isRecord(clock) &&
      typeof clock.reserveMsRemaining === "number" &&
      typeof clock.isRunning === "boolean" &&
      typeof clock.timeoutCount === "number" &&
      typeof clock.isInNegativeTime === "boolean" &&
      (clock.startedAtMs === undefined || typeof clock.startedAtMs === "number") &&
      (clock.activePlayerAccumulatedMs === undefined ||
        typeof clock.activePlayerAccumulatedMs === "number") &&
      (clock.maxDecisionTimeMs === undefined || typeof clock.maxDecisionTimeMs === "number"),
  );
}

function isRecordOf(
  value: unknown,
  predicate: (entry: unknown) => boolean,
): value is Record<string, unknown> {
  return isRecord(value) && Object.values(value).every(predicate);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
