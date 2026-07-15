/**
 * Riftbound Counter/Token Moves
 *
 * Moves for managing counters and tokens on cards:
 * exhausted state, damage, buffs, and stun.
 */

import type { CardId as CoreCardId, GameMoveDefinitions } from "@tcg/core";
import type { RiftboundCardMeta, RiftboundGameState, RiftboundMoves } from "../../types";

/**
 * Counter/token move definitions
 */
export const counterMoves: Partial<
  GameMoveDefinitions<RiftboundGameState, RiftboundMoves, RiftboundCardMeta, unknown>
> = {
  addBuff: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.setFlag(cardId as CoreCardId, "buffed", true);
    },
  },

  addDamage: {
    reducer: (_draft, context) => {
      const { cardId, amount } = context.params;
      context.counters.addCounter(cardId as CoreCardId, "damage", amount);
    },
  },

  clearDamage: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.clearCounter(cardId as CoreCardId, "damage");
    },
  },

  exhaustCard: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.setFlag(cardId as CoreCardId, "exhausted", true);
    },
  },

  readyCard: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.setFlag(cardId as CoreCardId, "exhausted", false);
    },
  },

  removeBuff: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.setFlag(cardId as CoreCardId, "buffed", false);
    },
  },

  removeDamage: {
    reducer: (_draft, context) => {
      const { cardId, amount } = context.params;
      context.counters.removeCounter(cardId as CoreCardId, "damage", amount);
    },
  },

  stunUnit: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.setFlag(cardId as CoreCardId, "stunned", true);
    },
  },

  unstunUnit: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      context.counters.setFlag(cardId as CoreCardId, "stunned", false);
    },
  },
};
