export const youHaveLocationInPlay = {
    type: "filter",
    comparison: { operator: "gte", value: 1 },
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "location" },
        { filter: "zone", value: "play" },
    ],
};
export const haveCardsInDeck = {
    type: "filter",
    comparison: { operator: "gte", value: 1 },
    filters: [
        { filter: "owner", value: "self" },
        { filter: "zone", value: "deck" },
    ],
};
export const youHaveItemInPlay = {
    type: "filter",
    comparison: { operator: "gte", value: 1 },
    filters: [
        { filter: "owner", value: "self" },
        { filter: "zone", value: "play" },
        { filter: "type", value: "item" },
    ],
};
export const youHaveDealtDamageToOpposingCharacterThisTurn = {
    type: "this-turn",
    value: "was-damaged",
    target: "self",
    comparison: { operator: "gte", value: 1 },
    filters: [
        { filter: "owner", value: "opponent" },
        { filter: "type", value: "character" },
        { filter: "zone", value: ["discard", "play"] },
    ],
};
//# sourceMappingURL=conditions.js.map