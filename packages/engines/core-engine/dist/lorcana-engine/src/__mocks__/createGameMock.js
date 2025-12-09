import { allCards, allCardsById } from "@lorcanito/lorcana-engine/cards/cards";
import { createEmptyMatch, createShortAndUniqueIds, } from "@lorcanito/lorcana-engine/lib/game";
import { createId } from "@paralleldrive/cuid2";
export const testCharacterCard = {
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
function range(size, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
}
function prepareGame(playerId, state, game, ids) {
    const { lore, ...zones } = state;
    const cards = {};
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
        const zoneKey = zone;
        const value = state[zoneKey];
        const zoneCards = typeof value === "number"
            ? range(value).map(() => testCharacterCard)
            : value;
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
                    }
                    else {
                        playerTable.zones[zoneKey] = [instanceId];
                    }
                }
            }
        }
    }
    return cards;
}
export function createMockMatch(playerState = {}, opponentState = {}, skipPreMatch = true) {
    const match = createEmptyMatch("TEST_MATCH_ID", "TEST_GAME_ID", "SEED", "player_one", ["player_one", "player_two"]);
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
        game: JSON.parse(JSON.stringify(match)),
        cards: JSON.parse(JSON.stringify(allCards)),
    };
}
//# sourceMappingURL=createGameMock.js.map