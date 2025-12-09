export const anyCardYouOwn = {
    type: "card",
    value: "all",
    filters: [{ filter: "owner", value: "self" }],
};
export const oneCardFromHand = {
    type: "card",
    value: 1,
    filters: [
        { filter: "owner", value: "self" },
        { filter: "zone", value: "hand" },
    ],
};
export const chosenCharacterOfYours = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const chosenCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
    ],
};
export const chosenOpposingCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
    ],
};
export const chosenOpposingDamagedCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
        { filter: "status", value: "damaged" },
    ],
};
export function opposingCharactersWithCostXorLess(_cost = 1) {
    return {
        type: "card",
        value: _cost,
        filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "opponent" },
        ],
    };
}
export const chosenCharacterItemOrLocation = {
    type: "card",
    value: 1,
    filters: [
        {
            filter: "type",
            value: ["character", "location", "item"],
        },
        { filter: "zone", value: "play" },
    ],
};
export const anotherChosenCharacter = {
    type: "card",
    value: 1,
    excludeSelf: true,
    filters: chosenCharacter.filters,
};
export const itemsYouControl = [
    { filter: "type", value: "item" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
];
export const readyItemsYouControl = [
    { filter: "type", value: "item" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    { filter: "status", value: "ready" },
];
export const anotherChosenCharOfYours = {
    type: "card",
    value: 1,
    excludeSelf: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
    ],
};
export const chosenItem = {
    type: "card",
    value: 1,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "item" },
    ],
};
export const chosenItemOfYours = {
    type: "card",
    value: 1,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "item" },
        { filter: "owner", value: "self" },
    ],
};
export const chosenItemOfYoursInHand = {
    type: "card",
    value: 1,
    filters: [
        { filter: "zone", value: "hand" },
        { filter: "type", value: "item" },
        { filter: "owner", value: "self" },
    ],
};
export const allOtherCharactersHere = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
        { filter: "status", value: "at-location" },
    ],
};
export const yourOtherCharacters = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
    ],
};
export const yourDamagedCharacters = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
        { filter: "status", value: "damaged" },
    ],
};
export const yourOtherLocations = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "location" },
        { filter: "owner", value: "self" },
    ],
};
export const otherCharacters = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
    ],
};
export const opposingCharacters = {
    type: "card",
    value: "all",
    filters: [
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
        { filter: "type", value: "character" },
    ],
};
export const opposingCharactersWithEvasive = {
    type: "card",
    value: "all",
    filters: [
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
        { filter: "type", value: "character" },
        { filter: "ability", value: "evasive" },
    ],
};
export const opposingCharactersWithoutEvasive = {
    type: "card",
    value: "all",
    filters: [
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
        { filter: "type", value: "character" },
        { filter: "ability", value: "evasive" },
    ],
};
export const chosenDamagedCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
        },
    ],
};
export const chosenCharacterOrLocation = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: ["location", "character"] },
        { filter: "zone", value: "play" },
    ],
};
export const actionCardsInHand = {
    type: "card",
    value: "all",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "action" },
        { filter: "zone", value: "hand" },
    ],
};
//# sourceMappingURL=target.js.map