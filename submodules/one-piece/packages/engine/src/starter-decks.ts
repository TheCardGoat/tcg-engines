import type { MatchConfig, MatchPlayerConfig, MatchSeat } from "./types.ts";
import { ONE_PIECE_PRECONSTRUCTED_DECKS } from "@tcg/op-cards";

const ST01 = ONE_PIECE_PRECONSTRUCTED_DECKS.find((deck) => deck.code === "ST01");
if (!ST01) throw new Error("The verified ST01 preconstructed deck is unavailable.");

export const ST01_LEADER_CARD_ID = ST01.leaderCardId;

export const ST01_MAIN_DECK: readonly string[] = Object.freeze(
  ST01.mainDeck.flatMap((entry) => copies(entry.cardId, entry.quantity)),
);

export function createSt01PlayerConfig(playerName: string): MatchPlayerConfig {
  return {
    leaderCardId: ST01_LEADER_CARD_ID,
    mainDeck: [...ST01_MAIN_DECK],
    donDeckCount: 10,
    playerName,
  };
}

export function createSt01MirrorPracticeConfig(
  options: {
    firstPlayer?: MatchSeat;
    seed?: string | number;
  } = {},
): MatchConfig {
  return {
    firstPlayer: options.firstPlayer ?? "south",
    seed: options.seed ?? "one-piece-st01-practice",
    shuffleDecks: true,
    skipFirstTurnDraw: true,
    players: {
      south: createSt01PlayerConfig("You"),
      north: createSt01PlayerConfig("Practice Bot"),
    },
  };
}

function copies(cardId: string, count: number): string[] {
  return Array.from({ length: count }, () => cardId);
}
