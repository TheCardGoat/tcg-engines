import type { FabMoveName } from "./moves.ts";
import type { FabMatchState } from "./state.ts";
import { optionalTriggerAutomationDecisionContext } from "./commands/optional-trigger-automation-decision.ts";
import {
  isForcedTargetDecisionActor,
  isTriggerOrderDecisionActor,
} from "./commands/trigger-order-automation-preference.ts";

/**
 * The move names a seat may currently take — deliberately coarse.
 *
 * This is move-*type* availability (is this kind of action offerable at
 * all?), which wait-state and the automation drains key on; it is a
 * different query from the fully-instantiated payloads enumerated per move
 * in `rules/legal-commands/`. Projecting one onto the other would change
 * behavior (e.g. `begin-play` would vanish whenever no card is currently
 * playable), so the two stay separate by design and are linked only through
 * `FabMoveName`.
 */
export function enumerateFabMoves(
  state: Readonly<FabMatchState>,
  actorId: string,
): readonly FabMoveName[] {
  if (state.gameEnded) return [];
  const moves: FabMoveName[] = ["concede"];

  if (state.decision) {
    if (state.decision.actorId === actorId) moves.push("answer-decision");
    if (optionalTriggerAutomationDecisionContext(state, actorId))
      moves.push("set-optional-trigger-automation");
    if (isTriggerOrderDecisionActor(state, actorId) || isForcedTargetDecisionActor(state, actorId))
      moves.push("set-automation-preferences");
    return moves;
  }
  if (actorId === state.activePlayerId && actorId === state.priority?.holderPlayerId) {
    moves.push("set-optional-trigger-automation");
  }
  if (actorId === state.priority?.holderPlayerId) {
    moves.push("set-automation-preferences");
    if (
      state.automationPreferences[actorId]?.priorityMode === "play-and-skip" &&
      !state.priorityHoldArmed[actorId]
    ) {
      moves.push("arm-priority-hold");
    }
  }

  if (state.rulesStack.length > 0) {
    if (actorId === state.priority?.holderPlayerId) {
      moves.push("pass", "begin-play", "activate");
    }
    return moves;
  }
  if (state.phase !== "action") return moves;

  const combat = state.combat;
  if (combat?.open) {
    if (combat.step === "defend" && combat.defenseDeclarationPending) {
      if (actorId === combat.activeLink?.defendingPlayerId) moves.push("defend", "pass");
      return moves;
    }
    if (actorId !== state.priority?.holderPlayerId) return moves;
    moves.push("pass", "begin-play", "activate");
    return moves;
  }

  if (actorId === state.priority?.holderPlayerId) {
    moves.push("pass", "begin-play", "activate");
    if (actorId === state.activePlayerId) moves.push("end-turn");
  }
  return moves;
}
