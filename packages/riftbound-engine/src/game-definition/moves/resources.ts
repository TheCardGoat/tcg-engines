/**
 * Riftbound Resource Moves
 *
 * Moves for resource management: channeling runes, tapping for energy,
 * recycling for power, and managing the rune pool.
 */

import type {
  CardId as CoreCardId,
  PlayerId as CorePlayerId,
  ZoneId as CoreZoneId,
  GameMoveDefinitions,
} from "@tcg/core";
import type { Domain, RiftboundCardMeta, RiftboundGameState, RiftboundMoves } from "../../types";

/**
 * Resource move definitions
 */
export const resourceMoves: Partial<
  GameMoveDefinitions<RiftboundGameState, RiftboundMoves, RiftboundCardMeta, unknown>
> = {
  /**
   * Channel Runes
   *
   * Take runes from the top of the Rune Deck and put them in the Rune Pool.
   * During Channel Phase, players channel 2 runes.
   */
  channelRunes: {
    reducer: (_draft, context) => {
      const { playerId, count } = context.params;
      const { zones } = context;

      // Move runes from rune deck to rune pool
      zones.bulkMove({
        count,
        from: "runeDeck" as CoreZoneId,
        playerId: playerId as CorePlayerId,
        to: "runePool" as CoreZoneId,
      });
    },
  },

  /**
   * Exhaust Rune for Energy
   *
   * Tap (exhaust) a rune to add 1 Energy to the Rune Pool.
   * Basic runes have: "[T]: Add [1]"
   */
  exhaustRune: {
    reducer: (draft, context) => {
      const { playerId, runeId } = context.params;
      const { counters } = context;

      // Exhaust the rune
      counters.setFlag(runeId as CoreCardId, "exhausted", true);

      // Add 1 energy to the rune pool
      const pool = draft.runePools[playerId];
      if (pool) {
        pool.energy += 1;
      }
    },
  },

  /**
   * Recycle Rune for Power
   *
   * Recycle a rune to the bottom of the Rune Deck to add 1 Power
   * of that rune's domain to the Rune Pool.
   * Basic runes have: "Recycle this: Add [C]" (domain-specific)
   */
  recycleRune: {
    reducer: (draft, context) => {
      const { playerId, runeId, domain } = context.params;
      const { zones } = context;

      // Move rune to bottom of rune deck
      zones.moveCard({
        cardId: runeId as CoreCardId,
        position: "bottom",
        targetZoneId: "runeDeck" as CoreZoneId,
      });

      // Add 1 power of the specified domain
      const pool = draft.runePools[playerId];
      if (pool) {
        pool.power[domain] = (pool.power[domain] ?? 0) + 1;
      }
    },
  },

  /**
   * Add Resources
   *
   * Add energy and/or power to the player's rune pool.
   * Used for card effects that generate resources.
   */
  addResources: {
    reducer: (draft, context) => {
      const { playerId, energy = 0, power = {} } = context.params;

      const pool = draft.runePools[playerId];
      if (pool) {
        // Add energy
        pool.energy += energy;

        // Add power for each domain
        for (const [domain, amount] of Object.entries(power)) {
          if (amount && amount > 0) {
            pool.power[domain as Domain] = (pool.power[domain as Domain] ?? 0) + amount;
          }
        }
      }
    },
  },

  /**
   * Spend Resources
   *
   * Spend energy and/or power from the player's rune pool.
   * Used for paying costs.
   */
  spendResources: {
    reducer: (draft, context) => {
      const { playerId, energy = 0, power = {} } = context.params;

      const pool = draft.runePools[playerId];
      if (pool) {
        // Spend energy
        pool.energy = Math.max(0, pool.energy - energy);

        // Spend power for each domain
        for (const [domain, amount] of Object.entries(power)) {
          if (amount && amount > 0) {
            const current = pool.power[domain as Domain] ?? 0;
            pool.power[domain as Domain] = Math.max(0, current - amount);
          }
        }
      }
    },
  },
};
