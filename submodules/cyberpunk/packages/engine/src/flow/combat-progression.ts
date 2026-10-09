import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import { buildPlayerPrompt } from "../view/player-prompt.ts";

export type CombatProgression = "automatic" | "manual";
export type CombatPriorityMode = "automatic" | "hold";

/** CR 9.6–9.20: mechanical steps settle; only the defender can react. */
export function automaticCombatActor(state: MatchState): PlayerId | null {
  const { attackState: attack, turnMetadata: turn } = state.G;
  if (
    state.G.gameEnded ||
    !attack ||
    turn.pendingChoice ||
    turn.currentTrigger ||
    turn.triggerQueue.length > 0
  )
    return null;
  const actor = attack.step === "react" ? attack.rivalId : turn.activePlayerId;
  const prompt = buildPlayerPrompt(state, actor);
  if (!prompt.availableMoves.some((move) => move.moveId === "resolveAttack")) return null;
  if (attack.step === "react") {
    if (state.G.players[actor]!.combatPriority === "hold") return null;
    const hasReaction = prompt.availableMoves.some(
      ({ moveId }) =>
        moveId === "callLegend" ||
        moveId === "useBlocker" ||
        moveId === "playCard" ||
        moveId === "activateAbility",
    );
    if (hasReaction) return null;
  }
  return actor;
}
