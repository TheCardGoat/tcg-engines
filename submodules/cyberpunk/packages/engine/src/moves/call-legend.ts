import type { CardInstanceId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { processCardSpentEventsSince, processEventTriggers } from "../ability-executor.ts";
import { getDefinitionFor } from "../state/lookups.ts";
import { availableEddies } from "./eddie-resources.ts";
import { isDefensiveStep } from "./is-defensive-step.ts";

export interface CallLegendInput extends MoveInput {
  args: {
    legendId?: string;
  };
}

export const callLegendMove: MoveDefinition<CallLegendInput> = {
  available({ state, playerId }) {
    const player = state.G.players[playerId as string];
    if (!player) return false;
    if (state.G.gamePhase !== "main" && !isDefensiveStep(state, playerId)) return false;
    if (state.G.attackState && !isDefensiveStep(state, playerId)) return false;
    if (!isDefensiveStep(state, playerId) && state.G.turnMetadata.activePlayerId !== playerId)
      return false;
    if (!isDefensiveStep(state, playerId) && player.calledLegendThisTurn) return false;
    if (isDefensiveStep(state, playerId) && player.calledLegendThisRivalTurn) return false;
    if (availableEddies(state as import("../types/match-state.ts").MatchState, playerId) < 1)
      return false;

    return player.zones.legendArea.some((id) => {
      const card = state.G.cardIndex[id as string];
      return card && card.meta.faceDown;
    });
  },

  validate({ state, playerId, input }) {
    const player = state.G.players[playerId as string];
    if (!player) return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
    if (state.G.gamePhase !== "main" && !isDefensiveStep(state, playerId)) {
      return { valid: false, error: "Not in a call legend step", errorCode: "WRONG_PHASE" };
    }
    const isDefending = isDefensiveStep(state, playerId);
    if (state.G.attackState && !isDefending) {
      return { valid: false, error: "Attack in progress", errorCode: "ATTACK_IN_PROGRESS" };
    }
    if (!isDefending && state.G.turnMetadata.activePlayerId !== playerId) {
      return { valid: false, error: "Not your turn", errorCode: "NOT_YOUR_TURN" };
    }
    if (availableEddies(state as import("../types/match-state.ts").MatchState, playerId) < 1)
      return {
        valid: false,
        error: "Not enough eddies (need 1)",
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

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const player = state.G.players[playerId as string];
    if (!player) return;

    const legendId = input.args.legendId as CardInstanceId;

    const eventsBeforePayment = operations.event.getEmittedEvents().length;
    operations.game.spendEddies(playerId, 1, "callLegend");
    operations.card.setMeta(legendId, { faceDown: false });
    if (isDefensiveStep(state, playerId)) {
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
