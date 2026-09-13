import { ONE_PIECE_PRECONSTRUCTED_DECKS } from "@tcg/op-cards/preconstructed-decks";

/** Public, serialization-ready starter projection owned by the game adapter. */
export function listOnePieceDeckPresets() {
  return ONE_PIECE_PRECONSTRUCTED_DECKS.map((deck) => ({
    code: deck.code,
    name: deck.name,
    leaderCardId: deck.leaderCardId,
    colors: [...deck.colors],
    sourceUrl: deck.sourceUrl,
    mainDeck: deck.mainDeck.map((entry) => ({ ...entry })),
  }));
}
