/**
 * Riftbound Movement Moves
 *
 * Moves for unit movement: standard move, ganking, and recalls.
 */

import type {
  CardId as CoreCardId,
  ZoneId as CoreZoneId,
  GameMoveDefinitions,
} from "@tcg/core";
import type {
  RiftboundCardMeta,
  RiftboundGameState,
  RiftboundMoves,
} from "../../types";

/**
 * Movement move definitions
 */
export const movementMoves: Partial<
  GameMoveDefinitions<
    RiftboundGameState,
    RiftboundMoves,
    RiftboundCardMeta,
    unknown
  >
> = {
  /**
   * Standard Move
   *
   * Exhaust unit(s) to move them to a valid destination.
   * Valid destinations:
   * - Base <-> Battlefield
   * - Battlefield -> Battlefield (requires Ganking keyword)
   *
   * Multiple units can move together to the same destination.
   */
  standardMove: {
    reducer: (_draft, context) => {
      const { unitIds, destination } = context.params;
      const { zones, counters } = context;

      for (const unitId of unitIds) {
        // Exhaust the unit (cost of moving)
        counters.setFlag(unitId as CoreCardId, "exhausted", true);

        // Move unit to destination
        zones.moveCard({
          cardId: unitId as CoreCardId,
          targetZoneId: destination as CoreZoneId,
        });
      }
    },
  },

  /**
   * Ganking Move
   *
   * Move a unit from one Battlefield to another.
   * Requires the Ganking keyword.
   * The unit is exhausted as part of the move.
   */
  gankingMove: {
    reducer: (_draft, context) => {
      const { unitId, toBattlefield } = context.params;
      const { zones, counters } = context;

      // Exhaust the unit
      counters.setFlag(unitId as CoreCardId, "exhausted", true);

      // Move unit to the target battlefield
      zones.moveCard({
        cardId: unitId as CoreCardId,
        targetZoneId: `battlefield-${toBattlefield}` as CoreZoneId,
      });
    },
  },

  /**
   * Recall Unit
   *
   * Return a unit to its owner's Base.
   * This is NOT a Move (doesn't trigger move abilities).
   * Used for combat resolution when attackers are recalled.
   */
  recallUnit: {
    reducer: (_draft, context) => {
      const { unitId } = context.params;
      const { zones } = context;

      // Move unit back to base
      // Note: This uses moveCard but represents a Recall, not a Move
      zones.moveCard({
        cardId: unitId as CoreCardId,
        targetZoneId: "base" as CoreZoneId,
      });
    },
  },

  /**
   * Recall Gear
   *
   * Return gear to its owner's Base.
   * Gear at a Battlefield is Recalled to Base during Cleanup.
   */
  recallGear: {
    reducer: (_draft, context) => {
      const { gearId } = context.params;
      const { zones } = context;

      // Move gear back to base
      zones.moveCard({
        cardId: gearId as CoreCardId,
        targetZoneId: "base" as CoreZoneId,
      });
    },
  },
};
