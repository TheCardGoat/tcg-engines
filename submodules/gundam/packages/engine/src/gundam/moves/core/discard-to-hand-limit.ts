/**
 * Discard To Hand Limit Move
 *
 * End-phase cleanup: discard cards from hand down to the hand limit (10).
 * Rule 7-6-5-1: upper limit of 10 cards in hand.
 */

import type { GundamMoveDefinition } from "../../types.ts";
import { rejectWithKey } from "./validation-error.ts";

const HAND_LIMIT = 10;

export const discardToHandLimit: GundamMoveDefinition<"discardToHandLimit"> = {
  describeProcedure({ playerId, partialInput, framework }) {
    // Only relevant during end-phase/hand-step; outside that window
    // `enumerateCandidates` returns [] so the move wouldn't be listed.
    if (
      framework.state.status.phase !== "end-phase" ||
      framework.state.status.step !== "hand-step"
    ) {
      return [];
    }

    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    const required = handIds.length - HAND_LIMIT;
    if (required <= 0) return [];

    const picked = (partialInput as { cardIds?: readonly string[] }).cardIds ?? [];
    if (picked.length !== required) {
      return [
        {
          kind: "selectTarget",
          role: "discard-target",
          candidateIds: handIds,
          minTargets: required,
          maxTargets: required,
        },
      ];
    }
    return [];
  },

  enumerateCandidates({ playerId, framework }) {
    if (
      framework.state.status.phase !== "end-phase" ||
      framework.state.status.step !== "hand-step"
    ) {
      return [];
    }
    const handIds = framework.zones.getCards({ zone: "hand", playerId });
    if (handIds.length <= HAND_LIMIT) return [];
    // Every hand card is a legal discard target until the selection is
    // complete; the UI narrows further via `partialInput.cardIds`.
    return [...handIds];
  },

  validate({ playerId, args, framework, validationMode }) {
    // Preflight runs before `framework` is built (see
    // `validateCommand` in match-runtime.validation.ts passing
    // `framework: null as never`); short-circuit like every other
    // move in this package to avoid a null-deref here.
    if (validationMode === "preflight") return { valid: true };

    const { cardIds } = args;

    if (
      framework.state.status.phase !== "end-phase" ||
      framework.state.status.step !== "hand-step"
    ) {
      return {
        valid: false,
        error: "discardToHandLimit can only be used during the end phase",
        errorCode: "WRONG_PHASE",
      };
    }

    const handCards = framework.zones.getCards({ zone: "hand", playerId });
    const handSize = handCards.length;

    if (handSize <= HAND_LIMIT) {
      return {
        valid: false,
        error: "Hand is already at or below the hand limit",
        errorCode: "NO_DISCARD_NEEDED",
      };
    }

    const required = handSize - HAND_LIMIT;
    if (cardIds.length !== required) {
      return rejectWithKey(
        "gundam.error.discard.wrongCount",
        { required, limit: HAND_LIMIT },
        "WRONG_DISCARD_COUNT",
      );
    }

    for (const cardId of cardIds) {
      if (!handCards.includes(cardId)) {
        return rejectWithKey("gundam.error.discard.cardNotInHand", { cardId }, "CARD_NOT_IN_HAND");
      }
    }

    return { valid: true };
  },

  execute({ G, playerId, args, framework }) {
    void G;
    const { cardIds } = args;

    for (const cardId of cardIds) {
      framework.zones.moveCard(cardId, { zone: "trash", playerId });
    }
  },
};
