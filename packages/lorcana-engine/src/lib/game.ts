import type { LorcanitoCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { lorcanitoShuffle } from "@lorcanito/lorcana-engine/lib/shuffle/lorcanitoShuffle";
import { shuffleDeck } from "@lorcanito/lorcana-engine/lib/shuffle/shuffle";
import type {
  Match,
  Table,
  TableCard,
  Zones,
} from "@lorcanito/lorcana-engine/types/types";
import { createId, init } from "@paralleldrive/cuid2";
import { Random } from "./shuffle/random";

export type DeckCard = {
  publicId: string;
  qty: number;
  card: LorcanitoCard;
};
export type Deck = Array<DeckCard>;

export type GameLobby = {
  id: string;
  name: string;
  gameId: string;
  ownerId: string;
  messageId?: string;
  visibility: "public" | "private";
  players?: Record<string, boolean>;
  deckLists?: Record<string, string>;
  lastActivity?: string;
  wonDieRoll?: string | null;
  gameStarted: boolean;
};

function createTableCard(cardId: string, ownerId: string, instanceId: string) {
  return {
    instanceId,
    publicId: cardId,
    ownerId,
  };
}

export const createShortAndUniqueIds = (size: number) => {
  const createId = init({
    // 1296 possibilities
    length: 2,
  });

  const ids = new Set<string>();

  do {
    ids.add(createId());
  } while (ids.size <= size);

  return Array.from(ids);
};

export const createCards = (
  deck: Array<{
    publicId: string;
    qty: number;
  }>,
  ownerId: string,
  uniqueIds: string[] = [],
): Record<string, TableCard> => {
  const cards: Record<string, TableCard> = {};

  const start = Date.now();

  for (const { qty, publicId } of deck) {
    for (let i = 0; i < qty; i++) {
      const tableCard: TableCard = createTableCard(
        publicId,
        ownerId,
        uniqueIds.pop() || createId(),
      );

      cards[tableCard.instanceId] = tableCard;
    }
  }

  const end = Date.now();
  console.log(`createCards took ${end - start} ms`);

  return cards;
};

export function loadParsedDeckList(
  deckLists: Record<string, Array<{ publicId: string; qty: number }>> = {},
) {
  // 15 is the minimum amount of cards in a deck, and there's no upper limit
  const uniqueIds = createShortAndUniqueIds(15 * 60);

  const tableCards: Record<string, TableCard> = {};
  const deckCards = Object.keys(deckLists).reduce(
    (acc: Record<string, TableCard>, playerId: string) => {
      const deck = deckLists[playerId];

      if (!deck) {
        return acc;
      }

      const deckCards = createCards(deck, playerId, uniqueIds);

      return Object.assign(acc, deckCards);
    },
    tableCards,
  );

  return { deckCards };
}

export function createTablesFromCards(
  cards: Record<string, TableCard>,
): Record<string, Table> {
  const playerCards = Object.values(cards || {}).reduce(
    (acc, currentValue) => {
      const playerCards = acc[currentValue.ownerId];
      const tableCard = { [currentValue.instanceId]: currentValue };

      if (playerCards) {
        acc[currentValue.ownerId] = {
          ...playerCards,
          ...tableCard,
        };
      } else {
        acc[currentValue.ownerId] = { ...tableCard };
      }

      return acc;
    },
    {} as Record<string, Record<string, TableCard>>,
  );

  return Object.keys(playerCards).reduce(
    (acc, currentValue) => {
      const cards = playerCards[currentValue];
      const table = createTableFromCards(cards);

      acc[currentValue] = table;

      return acc;
    },
    {} as Record<string, Table>,
  );
}

export function createTableFromCards(
  cards: Record<string, TableCard> = {},
): Table {
  const table = createTable();

  const deck = Object.values(cards);

  const shuffledDeck = lorcanitoShuffle([...deck]);

  if (deck.length !== shuffledDeck.length) {
    console.error("Deck length mismatch");
  }

  table.zones.deck = shuffledDeck.map((card) => card.instanceId);

  return table;
}

export function recreateTable(sourceTable?: Table): Table {
  if (!sourceTable) {
    return createTable();
  }

  const newTable: Table = JSON.parse(JSON.stringify(sourceTable));

  newTable.lore = 0;
  newTable.turn = {
    cardsMoved: [],
    challenges: [],
  };

  if (!newTable.zones) {
    newTable.zones = {
      inkwell: [],
      hand: [],
      play: [],
      discard: [],
      deck: [],
    };
  }

  // Case where deck is empty, firebase will remove the key
  if (!newTable.zones.deck) {
    newTable.zones.deck = [];
  }

  for (const zone of Object.keys(newTable.zones) as Zones[]) {
    if (zone === "deck") {
      continue;
    }

    newTable.zones.deck = newTable.zones.deck?.concat(
      newTable.zones[zone] || [],
    );

    newTable.zones[zone] = [];
  }

  const shuffledDeck = shuffleDeck(newTable.zones.deck);
  newTable.zones.hand = shuffledDeck.slice(0, 7);
  newTable.zones.deck = shuffledDeck.slice(7);

  return newTable;
}

export function createTable(): Table {
  return {
    lore: 0,
    turn: {
      cardsMoved: [],
      challenges: [],
    },
    zones: {
      inkwell: [],
      hand: [],
      play: [],
      discard: [],
      deck: [],
    },
  };
}

export function createEmptyMatch(
  matchId: string,
  gameId: string,
  seed: string,
  choosingFirstPlayer: string,
  players: string[] = [],
): Match {
  const match: Match = {
    matchId: matchId,
    gameId: gameId,
    seed: seed,
    priorityPlayer: "",
    priorityTimestamp: 0,
    firstPlayer: "",
    choosingFirstPlayer: choosingFirstPlayer,
    turnPlayer: "",
    turnCount: 0,
    moveCount: 0,
    tables: {},
    effects: [],
    metas: {},
    createdAt: Date.now(),
    continuousEffects: [],
    triggeredAbilities: [],
    stateMachines: {
      matchStart: {
        state: "choosingFirstPlayer",
        startingPlayer: "",
        pendingAlteringHand: players,
        alteredCards: {},
      },
    },
  };

  return match;
}

export function createMatch(
  matchId: string,
  gameId: string,
  cards: Record<string, TableCard>,
  choosingFirstPlayer: string,
) {
  const tables: Record<string, Table> = createTablesFromCards(cards);
  const players = Object.keys(tables);

  const match = createEmptyMatch(
    matchId,
    gameId,
    Random.seed(),
    choosingFirstPlayer,
    players,
  );

  match.turnPlayer = "";
  match.priorityPlayer = "";
  match.firstPlayer = "";
  match.choosingFirstPlayer = choosingFirstPlayer;
  match.tables = tables;
  match.createdAt = Date.now();

  return match;
}

export function createEmptyGameLobby(
  id: string,
  gameId: string,
  name: string,
  userId?: string,
  lastActivity?: string,
  visibility: "public" | "private" = "public",
): GameLobby {
  return {
    id: id,
    gameId: gameId,
    // When the first players joins a lobby, we should set the ownerId to that player
    ownerId: userId || "",
    visibility,
    lastActivity: lastActivity || `${Date.now()}`,
    name: name,
    gameStarted: false,
    players: userId
      ? {
          // Player joined but it's not ready
          [userId]: false,
        }
      : {},
    deckLists: {},
  };
}
