import { createMove, type PlayerId, type ZoneId } from "@tcg/core";
import type {
  GundamCardMeta,
  GundamGameState,
  GundamMoves,
} from "../../../types";
import { gundamZones } from "../../../zones/zone-configs";

export const concede = createMove<
  GundamGameState,
  GundamMoves,
  "concede",
  GundamCardMeta
>({
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
    const allPlayers = draft.external.playerIds;

    // Determine winner: the opponent who is NOT conceding
    // Try to find active players by checking zones
    const uniquePlayerIds = new Set<PlayerId>();

    // Get all zone IDs dynamically from zone configuration
    const zoneIds = Object.keys(gundamZones) as ZoneId[];

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
    const playerIds = Array.from(uniquePlayerIds);
    const winner = playerIds.find((id) => id !== context.playerId);

    // Signal game end via context
    // Note: winner may be undefined if no other players have cards (edge case)
    context.endGame?.({
      winner,
      reason: "concede",
      metadata: { concedeBy: context.playerId },
    });
  },
});
