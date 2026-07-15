import type { MatchConfig, MatchPlayerConfig, MatchSeat } from "./types.ts";

export const ST01_LEADER_CARD_ID = "ST01-001";

export const ST01_MAIN_DECK: readonly string[] = Object.freeze([
  ...copies("ST01-002", 4),
  ...copies("ST01-003", 4),
  ...copies("ST01-004", 4),
  ...copies("ST01-005", 4),
  ...copies("ST01-006", 4),
  ...copies("ST01-007", 4),
  ...copies("ST01-008", 4),
  ...copies("ST01-009", 4),
  ...copies("ST01-010", 4),
  ...copies("ST01-011", 2),
  ...copies("ST01-012", 2),
  ...copies("ST01-013", 2),
  ...copies("ST01-014", 2),
  ...copies("ST01-015", 2),
  ...copies("ST01-016", 2),
  ...copies("ST01-017", 2),
]);

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
