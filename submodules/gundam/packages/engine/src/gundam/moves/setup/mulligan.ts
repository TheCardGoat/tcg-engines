/**
 * Alter Hand (Mulligan) — Setup Move
 *
 * Responsibility: record the player's mulligan decision only.
 *   - Optionally return entire hand and redraw (rule 6-2-1-6-1).
 *   - Remove this player from `pendingDecision`.
 *   - Set activePlayer to the next player waiting to mulligan.
 *
 * Gundam mulligan is all-or-nothing: a player may either keep their
 * entire hand or return all five cards and draw a new hand of five.
 *
 * When `pendingDecision` reaches zero the flow's `endIf` on the mulligan phase
 * fires. The flow engine then runs the mulligan phase `onExit`, which handles
 * shields and tokens automatically before transitioning segments.
 */

import type { PlayerId } from "../../../types/branded.ts";
import type { GundamMoveDefinition } from "../../types.ts";
import { emitGundamLog } from "../../logging.ts";

export const alterHand: GundamMoveDefinition<"alterHand"> = {
  undoable: false,

  validate({ playerId, args, framework, validationMode }) {
    if (validationMode === "preflight") {
      return { valid: true };
    }

    const pendingDecision = framework.state.status.pendingDecision ?? [];
    if (!pendingDecision.includes(playerId)) {
      return {
        valid: false,
        error: "Player has already completed their mulligan decision",
        errorCode: "MULLIGAN_ALREADY_DONE",
      };
    }

    const { wantsRedraw } = args;

    if (wantsRedraw) {
      const handCount = framework.zones.getCardCount({ zone: "hand", playerId });
      if (handCount === 0) {
        return {
          valid: false,
          error: "No cards in hand to redraw",
          errorCode: "EMPTY_HAND",
        };
      }
    }

    return { valid: true };
  },

  execute({ playerId, args, framework }) {
    const { wantsRedraw } = args;

    let redrawCount = 0;
    if (wantsRedraw) {
      const handCards = framework.zones.getCards({ zone: "hand", playerId });
      redrawCount = handCards.length;

      for (const cardId of handCards) {
        framework.zones.moveCard(cardId, { zone: "deck", playerId }, { index: 0 });
      }

      framework.zones.shuffle({ zone: "deck", playerId });

      if (framework.zones.getCardCount({ zone: "deck", playerId }) === 0) {
        framework.events.endGame({
          winner: framework.state.playerIds.find((id) => id !== playerId),
          reason: "Player ran out of cards during mulligan",
        });
        return;
      }

      framework.zones.drawCards({
        from: { zone: "deck", playerId },
        to: { zone: "hand", playerId },
        count: redrawCount,
      });
    }

    emitGundamLog(framework, {
      type: "gundam.setup.mulligan",
      values: { playerId, count: redrawCount },
      visibility: { mode: "PUBLIC" },
      category: "action",
    });

    const pendingDecision = (framework.state.status.pendingDecision ?? []).filter(
      (id) => id !== playerId,
    ) as PlayerId[];

    framework.status.patch({ pendingDecision });

    if (pendingDecision.length > 0) {
      framework.status.patch({ activePlayer: pendingDecision[0] });
    }
    // When pendingDecision is empty, the flow's mulligan.endIf fires automatically
    // and transitions to the post-mulligan-setup phase.
  },
};
