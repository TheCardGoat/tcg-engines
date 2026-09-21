import type { Operations } from "../operations/index.ts";
import { getDefinitionFor } from "../state/lookups.ts";
import type { CardInstanceId } from "../types/branded.ts";
import type { AttackState, MatchState } from "../types/match-state.ts";

function cardIsOnField(state: MatchState, cardId: CardInstanceId | null): boolean {
  if (!cardId) return false;
  return state.G.cardIndex[cardId as string]?.zone === "field";
}

/** CR 9.26.1 / 9.26.2 — attacker gone, or fight target no longer in the field. */
export function attackMustEnd(state: MatchState, attack: AttackState): boolean {
  if (!cardIsOnField(state, attack.attackerId)) return true;
  if (attack.kind === "fight" && !cardIsOnField(state, attack.defenderId)) return true;
  return false;
}

/**
 * CR 9.6 / 9.13 / 9.26–9.28: after the current pending window is empty, end the
 * attack if a participant has left the field. Remaining queued triggers for
 * this window must finish first (9.27.2 / 9.28).
 */
export function maybeEndAttackIfParticipantsLeft(
  state: MatchState,
  operations: Operations,
): boolean {
  if (state.G.turnMetadata.pendingChoice) return false;
  if (state.G.turnMetadata.currentTrigger) return false;
  if (state.G.turnMetadata.triggerQueue.length > 0) return false;
  const attack = state.G.attackState;
  // Fight/Steal already own their end-of-step cleanup. Ending here would
  // overwrite a completed fight log when the loser leaves the field (9.19).
  if (!attack || attack.step === "fight" || attack.step === "steal") return false;
  if (!attackMustEnd(state, attack)) return false;

  const attacker = state.G.cardIndex[attack.attackerId as string];
  const attackerName = attacker
    ? getDefinitionFor(state.G, attack.attackerId as string).displayName
    : "";
  operations.event.emit({
    type: "actionLog",
    messageKey: "move.resolveAttack.ended",
    params: { attackerName },
    playerId: state.G.turnMetadata.activePlayerId,
  });
  operations.game.setAttackState(null);
  return true;
}
