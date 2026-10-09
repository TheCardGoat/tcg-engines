import { getEffectiveActivePlayerId, type PriorityView } from "@tcg/cyberpunk-engine";

/** Resolve priority from a replay snapshot using the same rule as the live engine. */
export function getCyberpunkPriorityOwner(snapshot: unknown): string | undefined {
  return isPriorityView(snapshot) ? getEffectiveActivePlayerId(snapshot) : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPriorityView(value: unknown): value is PriorityView<string> {
  if (!isRecord(value) || !isRecord(value.G) || !isRecord(value.ctx)) return false;
  const game = value.G;
  const turn = game.turnMetadata;
  if (
    typeof game.gameEnded !== "boolean" ||
    typeof game.gamePhase !== "string" ||
    !isRecord(turn) ||
    typeof turn.activePlayerId !== "string" ||
    !Array.isArray(value.ctx.playerIds) ||
    !value.ctx.playerIds.every((id: unknown) => typeof id === "string") ||
    !isRecord(game.players)
  )
    return false;

  if (
    turn.pendingChoice !== undefined &&
    (!isRecord(turn.pendingChoice) || typeof turn.pendingChoice.chooserId !== "string")
  )
    return false;
  if (
    game.attackState != null &&
    (!isRecord(game.attackState) ||
      typeof game.attackState.step !== "string" ||
      typeof game.attackState.rivalId !== "string")
  )
    return false;
  return Object.values(game.players).every(
    (player) => isRecord(player) && typeof player.mulliganDone === "boolean",
  );
}
