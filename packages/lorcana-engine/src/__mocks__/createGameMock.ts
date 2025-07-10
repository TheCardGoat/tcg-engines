import { allCards, allCardsById } from "@lorcanito/lorcana-engine/cards/cards";
import type {
  LorcanitoCard,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine/cards/cardTypes";
import {
  createEmptyMatch,
  createShortAndUniqueIds,
} from "@lorcanito/lorcana-engine/lib/game";
import type {
  Match,
  TableCard,
  Zones,
} from "@lorcanito/lorcana-engine/types/types";
import { createId } from "@paralleldrive/cuid2";

export const testCharacterCard: LorcanitoCharacterCard = {
  id: "999999999999",
  name: "Test Card",
  title: "Character",
  characteristics: [],
  text: "",
  type: "character",
  abilities: [],
  flavour: "",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "",
  number: 0,
  set: "TFC",
  rarity: "common",
};

if (process.env.NODE_ENV === "test") {
  allCardsById[testCharacterCard.id] = testCharacterCard;
  allCards.push(testCharacterCard);
}

function range(size: number, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export type PartialRecord<K extends string, T> = {
  [P in K]?: T;
};

export type TestInitialState = PartialRecord<
  Zones,
  LorcanitoCard[] | number
> & { lore?: number };

function prepareGame(
  playerId: string,
  state: TestInitialState,
  game: Match,
  ids: string[],
) {
  const { lore, ...zones } = state;
  const cards: Record<string, TableCard> = {};
  game.tables[playerId] = {
    lore: lore || 0,
    turn: {
      cardsMoved: [],
      challenges: [],
    },
    zones: {
      discard: [],
      inkwell: [],
      deck: [],
      hand: [],
      play: [],
    },
  };

  for (const zone of Object.keys(zones)) {
    const zoneKey = zone as Zones;
    const value = state[zoneKey];
    const zoneCards: LorcanitoCard[] =
      typeof value === "number"
        ? range(value).map(() => testCharacterCard)
        : (value as LorcanitoCard[]);

    if (zoneCards) {
      for (const card of zoneCards.filter(Boolean)) {
        const instanceId = ids.pop() || createId();
        const tableCard = {
          instanceId,
          ownerId: playerId,
          publicId: card.id,
        };

        cards[tableCard.instanceId] = tableCard;

        const playerTable = game.tables[playerId];
        if (playerTable) {
          const tableZone = game.tables?.[playerId]?.zones?.[zoneKey];
          if (tableZone) {
            tableZone.push(instanceId);
          } else {
            playerTable.zones[zoneKey] = [instanceId];
          }
        }
      }
    }
  }

  return cards;
}

export function createMockMatch(
  playerState: TestInitialState = {},
  opponentState: TestInitialState = {},
  skipPreMatch = true,
) {
  const match = createEmptyMatch(
    "TEST_MATCH_ID",
    "TEST_GAME_ID",
    "SEED",
    "player_one",
    ["player_one", "player_two"],
  ) as Match;

  match.choosingFirstPlayer = "player_one";
  match.turnPlayer = "player_one";
  match.priorityPlayer = "player_one";
  match.firstPlayer = "player_one";

  if (skipPreMatch) {
    match.stateMachines = {
      matchStart: undefined,
    };
  }

  const ids = createShortAndUniqueIds(120 * 2);
  const p1Cards = prepareGame("player_one", playerState, match, ids);
  const p2Cards = prepareGame("player_two", opponentState, match, ids);

  const allCards = { ...p1Cards, ...p2Cards };

  return {
    game: JSON.parse(JSON.stringify(match)) as Match,
    cards: JSON.parse(JSON.stringify(allCards)) as Record<string, TableCard>,
  };
}
