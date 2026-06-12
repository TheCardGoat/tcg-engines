import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { SeededRNG } from "../state/rng.ts";
import type { CardInstanceId } from "../types/branded.ts";
import { privateField } from "../logging/private-field.ts";
import { advanceIfBothDecided } from "./keep-hand.ts";
import { createDefaultMetaForZone } from "../types/card-instance.ts";

export interface MulliganInput extends MoveInput {
  args: Record<string, never>;
}

export const mulliganMove: MoveDefinition<MulliganInput> = {
  available({ state, playerId }) {
    if (state.G.gamePhase !== "setup") {
      return false;
    }

    const player = state.G.players[playerId as string];
    if (!player) {
      return false;
    }

    return !player.mulliganDone;
  },

  validate({ state, playerId }) {
    if (state.G.gamePhase !== "setup") {
      return { valid: false, error: "Not in setup phase", errorCode: "WRONG_PHASE" };
    }
    const player = state.G.players[playerId as string];
    if (!player) {
      return { valid: false, error: "Player not found", errorCode: "PLAYER_NOT_FOUND" };
    }
    if (player.mulliganDone) {
      return { valid: false, error: "Already mulliganed", errorCode: "ALREADY_MULLIGANED" };
    }
    return { valid: true };
  },

  execute({ state, playerId, operations }) {
    const player = state.G.players[playerId as string];
    if (!player) return;

    const handCards = [...player.zones.hand];
    for (const cardId of handCards) {
      const card = state.G.cardIndex[cardId as string];
      if (card) {
        card.zone = "deck";
        card.meta = createDefaultMetaForZone("deck");
      }
      player.zones.deck.push(cardId);
    }
    player.zones.hand = [];

    const rng = new SeededRNG(state.ctx.seed + "_mulligan_" + (playerId as string));
    operations.zone.shuffleDeck(playerId, (maxInclusive) => rng.nextInt(0, maxInclusive));

    const drawn = operations.zone.drawCards(playerId, 6);

    player.mulliganDone = true;

    // Drawn card identities are private to the mulliganing player. The rival
    // sees `drawnCount` but not the ids — the {@link PrivateField} wrapper is
    // stripped at delivery time per viewer.
    operations.log.emit({
      type: "mulligan",
      playerId,
      timestamp: Date.now(),
      turnNumber: state.G.turnMetadata.turnNumber,
      drawnCount: drawn.length,
      drawn: privateField(drawn as CardInstanceId[], [playerId]),
    });

    advanceIfBothDecided(state, operations);
  },
};
