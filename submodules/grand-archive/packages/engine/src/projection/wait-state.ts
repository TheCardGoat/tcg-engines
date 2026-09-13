import type { GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveMatchState, GrandArchiveOpportunityWindow } from "../game/model.ts";

/** Player-visible reason the authoritative match is waiting before it can progress. */
export type GrandArchiveWaitState =
  | {
      readonly kind: "game-over";
      readonly winnerIds: readonly GrandArchivePlayerId[];
    }
  | {
      readonly kind: "decision";
      readonly playerId: GrandArchivePlayerId;
      readonly decisionKind: NonNullable<GrandArchiveMatchState["decision"]>["kind"];
    }
  | {
      /** Rules step 5 pre-game special actions, which do not grant Opportunity. */
      readonly kind: "pregame-action";
      readonly playerId: GrandArchivePlayerId;
    }
  | {
      /** The turn player may materialize, skip, or replace the choice with Preserve. */
      readonly kind: "materialization-choice";
      readonly playerId: GrandArchivePlayerId;
      readonly materializeKind: "regular" | "additional";
    }
  | {
      readonly kind: "opportunity";
      readonly playerId: GrandArchivePlayerId;
      readonly reason: GrandArchiveOpportunityWindow["reason"];
    }
  | {
      /** Automatic engine work is resolving; no player command is currently required. */
      readonly kind: "resolving";
      readonly phase: GrandArchiveMatchState["turn"]["phase"];
      readonly combatStep?: NonNullable<GrandArchiveMatchState["combat"]>["step"];
    };

/** Pure query over authoritative state; hosts must not infer this independently. */
export function readGrandArchiveWaitState(state: GrandArchiveMatchState): GrandArchiveWaitState {
  if (state.status === "finished") {
    return { kind: "game-over", winnerIds: state.winnerIds };
  }
  if (state.decision) {
    return {
      kind: "decision",
      playerId: state.decision.playerId,
      decisionKind: state.decision.kind,
    };
  }
  if (state.status === "pregame" && state.pregame?.stage === "player-actions") {
    const playerId = state.turnOrder[state.pregame.currentPlayerIndex];
    if (!playerId) throw new Error("Grand Archive pre-game action player is not seated");
    return { kind: "pregame-action", playerId };
  }
  if (state.opportunity) {
    return {
      kind: "opportunity",
      playerId: state.opportunity.holderId,
      reason: state.opportunity.reason,
    };
  }
  if (
    state.status === "playing" &&
    state.turn.phase === "materialize" &&
    state.turn.materializeChoicePending
  ) {
    if (!state.turn.materializeKind) {
      throw new Error("Grand Archive materialization choice has no materialization kind");
    }
    return {
      kind: "materialization-choice",
      playerId: state.turn.playerId,
      materializeKind: state.turn.materializeKind,
    };
  }
  return {
    kind: "resolving",
    phase: state.turn.phase,
    ...(state.combat ? { combatStep: state.combat.step } : {}),
  };
}
