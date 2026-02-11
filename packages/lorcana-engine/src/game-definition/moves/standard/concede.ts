import { type PlayerId, type ZoneId, createMove } from "@tcg/core";
import type { LorcanaCardMeta, LorcanaGameState, LorcanaMoveParams } from "../../../types";
import { lorcanaZones } from "../../zones/zone-configs";

/**
 * Concede
 *
 * Rule 1.9.1.2: Player can concede at any time
 *
 * Effects:
 * - Current player loses immediately
 * - Game ends
 * - Other player(s) win
 *
 * The engine handles game end logic automatically.
 */
export const concede = createMove<LorcanaGameState, LorcanaMoveParams, "concede", LorcanaCardMeta>({
  condition: (_state, context) => {
    // Cannot concede during setup phases
    const phase = context.flow?.currentPhase;
    if (phase === "chooseFirstPlayer" || phase === "mulligan") {
      return false;
    }
    return true;
  },
  reducer: (draft, context) => {
    // Get all players from the game state
    const allPlayers = Object.keys(draft.external.loreScores) as PlayerId[];

    // Determine winner: the opponent who is NOT conceding
    // Try to find active players by checking zones
    const uniquePlayerIds = new Set<PlayerId>();

    // Get all zone IDs dynamically from zone configuration
    const zoneIds = Object.keys(lorcanaZones) as ZoneId[];

    for (const zoneId of zoneIds) {
      for (const playerId of allPlayers) {
        try {
          const cards = context.zones.getCardsInZone(zoneId, playerId);
          if (cards.length > 0) {
            uniquePlayerIds.add(playerId);
          }
        } catch {
          // Zone might not exist for this player or other errors
          // Continue processing other zones/players
        }
      }
    }

    // Find the opponent (player who is not conceding)
    const playerIds = [...uniquePlayerIds];
    const winner = playerIds.find((id) => id !== context.playerId);

    // Signal game end via context
    // Note: winner may be undefined if no other players have cards (edge case)
    context.endGame?.({
      metadata: { concedeBy: context.playerId },
      reason: "concede",
      winner,
    });
  },
});
