/**
 * Riftbound Combat Moves
 *
 * Moves for combat: contesting battlefields, assigning attackers/defenders,
 * dealing damage, resolving combat, and scoring.
 */

import type {
  CardId as CoreCardId,
  PlayerId as CorePlayerId,
  ZoneId as CoreZoneId,
  GameMoveDefinitions,
} from "@tcg/core";
import type { RiftboundCardMeta, RiftboundGameState, RiftboundMoves } from "../../types";

/**
 * Combat move definitions
 */
export const combatMoves: Partial<
  GameMoveDefinitions<RiftboundGameState, RiftboundMoves, RiftboundCardMeta, unknown>
> = {
  /**
   * Contest Battlefield
   *
   * Mark a battlefield as contested when opposing units arrive.
   * Combat occurs when a Cleanup happens with opposing units at a Battlefield.
   */
  contestBattlefield: {
    reducer: (draft, context) => {
      const { playerId, battlefieldId } = context.params;

      const battlefield = draft.battlefields[battlefieldId];
      if (battlefield) {
        battlefield.contested = true;
        battlefield.contestedBy = playerId;
      }
    },
  },

  /**
   * Assign Attacker
   *
   * Designate a unit as an attacker in combat.
   * The attacker is the player who applied Contested status.
   */
  assignAttacker: {
    reducer: (_draft, context) => {
      const { unitId } = context.params;
      const { cards } = context;

      // Set combat role to attacker
      cards.updateCardMeta(
        unitId as CoreCardId,
        {
          combatRole: "attacker",
        } as Partial<RiftboundCardMeta>,
      );
    },
  },

  /**
   * Assign Defender
   *
   * Designate a unit as a defender in combat.
   * The defender is the other player in combat.
   */
  assignDefender: {
    reducer: (_draft, context) => {
      const { unitId } = context.params;
      const { cards } = context;

      // Set combat role to defender
      cards.updateCardMeta(
        unitId as CoreCardId,
        {
          combatRole: "defender",
        } as Partial<RiftboundCardMeta>,
      );
    },
  },

  /**
   * Assign Damage
   *
   * Assign combat damage to a unit.
   * Damage assignment rules:
   * - Units with Tank must receive lethal damage first
   * - Must assign lethal damage before moving to next unit
   */
  assignDamage: {
    reducer: (_draft, context) => {
      const { targetId, amount } = context.params;
      const { counters } = context;

      // Add damage to the target
      counters.addCounter(targetId as CoreCardId, "damage", amount);
    },
  },

  /**
   * Resolve Combat
   *
   * End combat and determine the outcome.
   * - Both sides have units: Attackers recalled to Base
   * - Only attackers remain: Battlefield conquered
   * - Only defenders remain: Defenders keep control
   * - Neither remain: No control change
   */
  resolveCombat: {
    reducer: (draft, context) => {
      const { battlefieldId } = context.params;

      const battlefield = draft.battlefields[battlefieldId];
      if (battlefield) {
        // Clear contested status
        battlefield.contested = false;
        battlefield.contestedBy = undefined;
      }
    },
  },

  /**
   * Conquer Battlefield
   *
   * Take control of a battlefield.
   * This happens when attackers win combat or move to an uncontrolled battlefield.
   */
  conquerBattlefield: {
    reducer: (draft, context) => {
      const { playerId, battlefieldId } = context.params;

      const battlefield = draft.battlefields[battlefieldId];
      if (battlefield) {
        battlefield.controller = playerId;
        battlefield.contested = false;
        battlefield.contestedBy = undefined;
      }

      // Track conquered battlefield for this turn
      if (!draft.conqueredThisTurn[playerId]) {
        draft.conqueredThisTurn[playerId] = [];
      }
      draft.conqueredThisTurn[playerId].push(battlefieldId);
    },
  },

  /**
   * Score Point
   *
   * Award a victory point to a player.
   * Two ways to score:
   * - Conquer: Gain control of a battlefield
   * - Hold: Control a battlefield during Beginning Phase
   */
  scorePoint: {
    reducer: (draft, context) => {
      const { playerId, method } = context.params;

      const player = draft.players[playerId];
      if (player) {
        player.victoryPoints += 1;
      }

      // Check for victory
      if (player && player.victoryPoints >= draft.victoryScore) {
        draft.status = "finished";
        draft.winner = playerId;

        context.endGame?.({
          metadata: { finalScore: player.victoryPoints, method },
          reason: "victory_points",
          winner: playerId as CorePlayerId,
        });
      }
    },
  },

  /**
   * Clear Combat State
   *
   * Reset combat designations for all units at a battlefield.
   * Called after combat resolution.
   */
  clearCombatState: {
    reducer: (_draft, context) => {
      const { battlefieldId } = context.params;
      const { zones, cards } = context;

      // Get all cards at this battlefield
      const battlefieldZoneId = `battlefield-${battlefieldId}`;
      const unitsAtBattlefield = zones.getCardsInZone(battlefieldZoneId as CoreZoneId);

      // Clear combat role for each unit
      for (const unitId of unitsAtBattlefield) {
        cards.updateCardMeta(unitId, {
          combatRole: null,
        } as Partial<RiftboundCardMeta>);
      }
    },
  },
};
