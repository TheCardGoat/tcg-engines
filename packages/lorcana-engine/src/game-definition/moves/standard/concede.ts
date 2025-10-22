import { createMove, createPlayerId, type PlayerId } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

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
export const concede = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "concede",
  LorcanaCardMeta
>({
  reducer: (draft, context) => {
    // Determine winner: the opponent who is NOT conceding
    // Try to find players by checking zones
    const uniquePlayerIds = new Set<PlayerId>();

    // Check common Lorcana zones for card owners
    const zonesToCheck = ["deck", "hand", "play", "inkwell", "discard"];

    for (const zoneId of zonesToCheck) {
      // Try both players (we know Lorcana is 2-player)
      const possiblePlayerIds = [
        createPlayerId("player_one"),
        createPlayerId("player_two"),
      ];

      for (const playerId of possiblePlayerIds) {
        try {
          const cards = context.zones.getCardsInZone(zoneId as any, playerId);
          if (cards.length > 0) {
            uniquePlayerIds.add(playerId);
          }
        } catch {
          // Zone might not exist for this player, continue
        }
      }
    }

    // Find the opponent (player who is not conceding)
    const playerIds = Array.from(uniquePlayerIds);
    const winner = playerIds.find((id) => id !== context.playerId);

    // Signal game end via context
    context.endGame?.({
      winner,
      reason: "concede",
      metadata: { concedeBy: context.playerId },
    });
  },
});
