import { lorcanitoShuffle } from "@lorcanito/lorcana-engine/lib/shuffle/lorcanitoShuffle";
import { shuffleDeck } from "@lorcanito/lorcana-engine/lib/shuffle/shuffle";
import { createId, init } from "@paralleldrive/cuid2";
import { Random } from "./shuffle/random";
function createTableCard(cardId, ownerId, instanceId) {
    return {
        instanceId,
        publicId: cardId,
        ownerId,
    };
}
export const createShortAndUniqueIds = (size) => {
    const createId = init({
        // 1296 possibilities
        length: 2,
    });
    const ids = new Set();
    do {
        ids.add(createId());
    } while (ids.size <= size);
    return Array.from(ids);
};
export const createCards = (deck, ownerId, uniqueIds = []) => {
    const cards = {};
    const start = Date.now();
    for (const { qty, publicId } of deck) {
        for (let i = 0; i < qty; i++) {
            const tableCard = createTableCard(publicId, ownerId, uniqueIds.pop() || createId());
            cards[tableCard.instanceId] = tableCard;
        }
    }
    const end = Date.now();
    console.log(`createCards took ${end - start} ms`);
    return cards;
};
export function loadParsedDeckList(deckLists = {}) {
    // 15 is the minimum amount of cards in a deck, and there's no upper limit
    const uniqueIds = createShortAndUniqueIds(15 * 60);
    const tableCards = {};
    const deckCards = Object.keys(deckLists).reduce((acc, playerId) => {
        const deck = deckLists[playerId];
        if (!deck) {
            return acc;
        }
        const deckCards = createCards(deck, playerId, uniqueIds);
        return Object.assign(acc, deckCards);
    }, tableCards);
    return { deckCards };
}
export function createTablesFromCards(cards) {
    const playerCards = Object.values(cards || {}).reduce((acc, currentValue) => {
        const playerCards = acc[currentValue.ownerId];
        const tableCard = { [currentValue.instanceId]: currentValue };
        if (playerCards) {
            acc[currentValue.ownerId] = {
                ...playerCards,
                ...tableCard,
            };
        }
        else {
            acc[currentValue.ownerId] = { ...tableCard };
        }
        return acc;
    }, {});
    return Object.keys(playerCards).reduce((acc, currentValue) => {
        const cards = playerCards[currentValue];
        const table = createTableFromCards(cards);
        acc[currentValue] = table;
        return acc;
    }, {});
}
export function createTableFromCards(cards = {}) {
    const table = createTable();
    const deck = Object.values(cards);
    const shuffledDeck = lorcanitoShuffle([...deck]);
    if (deck.length !== shuffledDeck.length) {
        console.error("Deck length mismatch");
    }
    table.zones.deck = shuffledDeck.map((card) => card.instanceId);
    return table;
}
export function recreateTable(sourceTable) {
    if (!sourceTable) {
        return createTable();
    }
    const newTable = JSON.parse(JSON.stringify(sourceTable));
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
    for (const zone of Object.keys(newTable.zones)) {
        if (zone === "deck") {
            continue;
        }
        newTable.zones.deck = newTable.zones.deck?.concat(newTable.zones[zone] || []);
        newTable.zones[zone] = [];
    }
    const shuffledDeck = shuffleDeck(newTable.zones.deck);
    newTable.zones.hand = shuffledDeck.slice(0, 7);
    newTable.zones.deck = shuffledDeck.slice(7);
    return newTable;
}
export function createTable() {
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
export function createEmptyMatch(matchId, gameId, seed, choosingFirstPlayer, players = []) {
    const match = {
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
export function createMatch(matchId, gameId, cards, choosingFirstPlayer) {
    const tables = createTablesFromCards(cards);
    const players = Object.keys(tables);
    const match = createEmptyMatch(matchId, gameId, Random.seed(), choosingFirstPlayer, players);
    match.turnPlayer = "";
    match.priorityPlayer = "";
    match.firstPlayer = "";
    match.choosingFirstPlayer = choosingFirstPlayer;
    match.tables = tables;
    match.createdAt = Date.now();
    return match;
}
export function createEmptyGameLobby(id, gameId, name, userId, lastActivity, visibility = "public") {
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
//# sourceMappingURL=game.js.map