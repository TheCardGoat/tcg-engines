import type { MatchState } from "@tcg/cyberpunk-engine";
import type { EngineInteractionView } from "@tcg/protocol";
import { collectPendingAttackTriggerSummaries } from "../engine/attackTriggers";
import { PLAYER_SIDE_TO_ID, type Side } from "../engine";
import type { EngineAction } from "../types/e2e";

export function getAutoAttackAdvanceAction(
  matchState: MatchState,
  interactionViews: Record<Side, EngineInteractionView>,
): Extract<EngineAction, { type: "resolveAttack" }> | null {
  const attack = matchState.G.attackState;
  if (!attack || matchState.G.turnMetadata.pendingChoice != null) {
    return null;
  }

  if (attack.step === "offensive") {
    if (collectPendingAttackTriggerSummaries(matchState).length > 0) {
      return null;
    }
    const promptSide = sideWithAction(interactionViews, "resolveAttack");
    if (promptSide) {
      return { type: "resolveAttack", as: PLAYER_SIDE_TO_ID[promptSide] };
    }
    const attackerSide = attackingSideForRival(attack.rivalId);
    return attackerSide ? { type: "resolveAttack", as: PLAYER_SIDE_TO_ID[attackerSide] } : null;
  }

  if (attack.step === "defensive") {
    const defenderSide = sideForPlayerId(attack.rivalId);
    if (!defenderSide) {
      return null;
    }
    const defenderView = interactionViews[defenderSide];
    const hasDefensiveChoice = defenderView.actions.some(
      (action) =>
        action.enabled &&
        (action.id === "callLegend" || (action.id === "useBlocker" && !attack.redirectedByBlocker)),
    );
    return hasDefensiveChoice
      ? null
      : { type: "resolveAttack", pass: true, as: PLAYER_SIDE_TO_ID[defenderSide] };
  }

  if (attack.step === "fight" || attack.step === "defeat") {
    const promptSide = sideWithAction(interactionViews, "resolveAttack");
    if (promptSide) {
      return { type: "resolveAttack", as: PLAYER_SIDE_TO_ID[promptSide] };
    }
    const attackerSide = attackingSideForRival(attack.rivalId);
    return attackerSide ? { type: "resolveAttack", as: PLAYER_SIDE_TO_ID[attackerSide] } : null;
  }

  if (attack.step === "steal") {
    const attackerSide = attackingSideForRival(attack.rivalId);
    return attackerSide
      ? { type: "resolveAttack", pass: true, as: PLAYER_SIDE_TO_ID[attackerSide] }
      : null;
  }

  return null;
}

export function getAutoPostAttackPassAction(
  matchState: MatchState,
  {
    activeSide,
    activeSideHasAi,
    humanSide,
    rawEngineEvents,
  }: {
    activeSide: Side;
    activeSideHasAi: boolean;
    humanSide: Side;
    rawEngineEvents: ReadonlyArray<{
      move: string;
      events: ReadonlyArray<{ type?: unknown }>;
    }>;
  },
): Extract<EngineAction, { type: "passPhase" }> | null {
  if (
    matchState.G.gameEnded ||
    matchState.G.gamePhase !== "main" ||
    matchState.G.attackState ||
    matchState.G.turnMetadata.pendingChoice != null ||
    activeSide === humanSide ||
    activeSideHasAi
  ) {
    return null;
  }

  const latest = rawEngineEvents.at(-1);
  if (
    latest?.move !== "resolveAttack" ||
    !latest.events.some((event) => event.type === "attackResolved")
  ) {
    return null;
  }

  return { type: "passPhase", as: PLAYER_SIDE_TO_ID[activeSide] };
}

function sideForPlayerId(playerId: unknown): Side | null {
  if (playerId === PLAYER_SIDE_TO_ID.player) {
    return "player";
  }
  if (playerId === PLAYER_SIDE_TO_ID.opponent) {
    return "opponent";
  }
  return null;
}

function attackingSideForRival(rivalId: unknown): Side | null {
  const defenderSide = sideForPlayerId(rivalId);
  if (defenderSide === "player") {
    return "opponent";
  }
  if (defenderSide === "opponent") {
    return "player";
  }
  return null;
}

function sideWithAction(
  interactionViews: Record<Side, EngineInteractionView>,
  actionId: string,
): Side | null {
  if (interactionViews.player.actions.some((action) => action.enabled && action.id === actionId)) {
    return "player";
  }
  if (
    interactionViews.opponent.actions.some((action) => action.enabled && action.id === actionId)
  ) {
    return "opponent";
  }
  return null;
}
