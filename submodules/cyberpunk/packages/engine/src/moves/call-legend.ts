import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { MatchState } from "../types/match-state.ts";
import { processCardSpentEventsSince, processEventTriggers } from "../ability-executor.ts";
import { getDefinitionFor } from "../state/lookups.ts";
import { availableEddies, canSpendSelectedEddies } from "./eddie-resources.ts";
import { isReactStep } from "./is-react-step.ts";
import { playerHasCallLegendFree } from "../active-effects/index.ts";

/** Comprehensive Rules 11.11.1 — Call a Legend costs 1 €$. */
export const CALL_LEGEND_COST = 1;

export interface CallLegendInput extends MoveInput {
  args: {
    legendId?: string;
    paymentSourceIds?: string[];
  };
}

export function callLegendEddieCost(state: MatchState, playerId: PlayerId): number {
  return playerHasCallLegendFree(state, playerId) ? 0 : CALL_LEGEND_COST;
}

export const callLegendMove: MoveDefinition<CallLegendInput> = {
  available({ state, playerId }) {
    const player = state.G.players[playerId as string];
    if (!player) return false;
    if (state.G.gamePhase !== "main" && !isReactStep(state, playerId)) return false;
    if (state.G.attackState && !isReactStep(state, playerId)) return false;
    if (!isReactStep(state, playerId) && state.G.turnMetadata.activePlayerId !== playerId)
      return false;
    if (!isReactStep(state, playerId) && player.calledLegendThisTurn) return false;
    if (isReactStep(state, playerId) && player.calledLegendThisRivalTurn) return false;
    const matchState = state as MatchState;
    const callCost = callLegendEddieCost(matchState, playerId);
    if (availableEddies(matchState, playerId) < callCost) return false;

    return player.zones.legendArea.some((id) => {
      const card = state.G.cardIndex[id as string];
      return card && card.meta.faceDown;
    });
  },

  validate({ state, playerId, input }) {
    const player = state.G.players[playerId as string];
    if (!player) return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
    if (state.G.gamePhase !== "main" && !isReactStep(state, playerId)) {
      return { valid: false, error: "Not in a call legend step", errorCode: "WRONG_PHASE" };
    }
    const isDefending = isReactStep(state, playerId);
    if (state.G.attackState && !isDefending) {
      return { valid: false, error: "Attack in progress", errorCode: "ATTACK_IN_PROGRESS" };
    }
    if (!isDefending && state.G.turnMetadata.activePlayerId !== playerId) {
      return { valid: false, error: "Not your turn", errorCode: "NOT_YOUR_TURN" };
    }
    const matchState = state as MatchState;
    const callCost = callLegendEddieCost(matchState, playerId);
    if (availableEddies(matchState, playerId) < callCost)
      return {
        valid: false,
        error:
          callCost === 0 ? "Not enough eddies" : `Not enough eddies (need ${CALL_LEGEND_COST})`,
        errorCode: "INSUFFICIENT_EDDIES",
      };

    if (!isDefending && player.calledLegendThisTurn) {
      return {
        valid: false,
        error: "Already called legend this turn",
        errorCode: "ALREADY_CALLED",
      };
    }
    if (isDefending && player.calledLegendThisRivalTurn) {
      return {
        valid: false,
        error: "Already called legend this rival turn",
        errorCode: "ALREADY_CALLED",
      };
    }

    const faceDownLegends = player.zones.legendArea.filter((id) => {
      const card = state.G.cardIndex[id as string];
      return card && card.meta.faceDown;
    });

    if (faceDownLegends.length === 0) {
      return {
        valid: false,
        error: "No face-down legends to call",
        errorCode: "NO_FACE_DOWN_LEGENDS",
      };
    }

    const legendId = input.args.legendId;
    if (!legendId) {
      return {
        valid: false,
        error: "Choose a legend to call",
        errorCode: "MISSING_LEGEND_TARGET",
      };
    }
    if (!player.zones.legendArea.includes(legendId as CardInstanceId)) {
      return {
        valid: false,
        error: "Legend is not in your legend area",
        errorCode: "LEGEND_NOT_IN_AREA",
      };
    }

    const legend = state.G.cardIndex[legendId];
    if (!legend?.meta.faceDown) {
      return {
        valid: false,
        error: "Legend is already face-up",
        errorCode: "LEGEND_ALREADY_FACE_UP",
      };
    }
    if (
      input.args.paymentSourceIds !== undefined &&
      !canSpendSelectedEddies(
        state.G,
        playerId,
        callCost,
        input.args.paymentSourceIds as CardInstanceId[],
      )
    ) {
      return { valid: false, error: "Invalid payment sources", errorCode: "INVALID_PAYMENT" };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const player = state.G.players[playerId as string];
    if (!player) return;

    const legendId = input.args.legendId as CardInstanceId;

    const eventsBeforePayment = operations.event.getEmittedEvents().length;
    const callCost = callLegendEddieCost(state as MatchState, playerId);
    if (callCost > 0) {
      operations.game.spendEddies(
        playerId,
        callCost,
        "callLegend",
        input.args.paymentSourceIds === undefined
          ? {}
          : { sourceIds: input.args.paymentSourceIds as CardInstanceId[] },
      );
    }
    operations.card.setMeta(legendId, { faceDown: false });
    if (isReactStep(state, playerId)) {
      operations.game.markCalledLegendThisRivalTurn(playerId);
    } else {
      operations.game.markCalledLegendThisTurn(playerId);
    }

    const legendName = state.G.cardIndex[legendId as string]
      ? getDefinitionFor(state.G, legendId as string).displayName
      : "";

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.callLegend",
      params: { legendName },
      playerId,
    });

    processCardSpentEventsSince(
      eventsBeforePayment,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );

    const legendFlippedEvent = {
      type: "legendFlipped" as const,
      cardId: legendId,
      playerId,
    };

    operations.event.emit(legendFlippedEvent);
    processEventTriggers(
      legendFlippedEvent,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );

    const legendCalledEvent = {
      type: "legendCalled" as const,
      cardId: legendId,
      playerId,
    };

    operations.event.emit(legendCalledEvent);
    processEventTriggers(
      legendCalledEvent,
      state as import("../types/match-state.ts").MatchState,
      operations,
    );
  },
};
