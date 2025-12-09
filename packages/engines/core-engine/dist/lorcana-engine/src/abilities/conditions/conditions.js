export function ifYouHaveCharacterNamed(name) {
    return {
        type: "filter",
        comparison: {
            operator: "gte",
            value: 1,
        },
        filters: [
            {
                filter: "attribute",
                value: "name",
                comparison: {
                    operator: "eq",
                    value: typeof name === "string" ? name : name,
                },
            },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
        ],
    };
}
export function notHaveCharacterNamed(name) {
    const condition = ifYouHaveCharacterNamed(name);
    const comparison = {
        operator: "eq",
        value: 0,
    };
    return {
        ...condition,
        comparison,
    };
}
export function haveXorMoreCharactersInPlay(numCharactersMin) {
    return {
        type: "filter",
        filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            {
                filter: "type",
                value: "character",
            },
        ],
        comparison: { operator: "gte", value: numCharactersMin },
    };
}
export function ifYouHaveACardInYourDiscardNamed(name) {
    return {
        type: "filter",
        comparison: {
            operator: "gte",
            value: 1,
        },
        filters: [
            {
                filter: "attribute",
                value: "name",
                comparison: {
                    operator: "eq",
                    value: typeof name === "string" ? name : name,
                },
            },
            { filter: "zone", value: "discard" },
            { filter: "owner", value: "self" },
        ],
    };
}
export const whileYouHaveCharacterNamed = ifYouHaveCharacterNamed;
export const ifYouHaveAnotherPirate = {
    type: "filter",
    comparison: {
        operator: "gte",
        value: 2,
    },
    filters: [
        {
            filter: "characteristics",
            value: ["pirate"],
        },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const haveMoreItemsThanOpponent = {
    type: "clash",
    filters: [
        {
            filter: "type",
            value: "item",
        },
        {
            filter: "zone",
            value: "play",
        },
    ],
    operator: "gt",
};
export const haveMoreCardsThanOpponent = {
    type: "hand",
    amount: "gt",
    player: "self",
};
export const ifYouHaveAnInventor = {
    type: "filter",
    comparison: {
        operator: "gte",
        value: 1,
    },
    filters: [
        {
            filter: "characteristics",
            value: ["inventor"],
        },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const haveItemInPlay = {
    type: "filter",
    filters: [
        { filter: "owner", value: "self" },
        {
            filter: "type",
            value: "item",
        },
        {
            filter: "zone",
            value: "play",
        },
    ],
    comparison: { operator: "gte", value: 1 },
};
export const have3orMorePuppiesInPlay = {
    type: "filter",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "zone", value: "play" },
        {
            filter: "type",
            value: "character",
        },
        {
            filter: "characteristics",
            value: ["puppy"],
        },
    ],
    comparison: { operator: "gte", value: 3 },
};
export const haveItemInDiscard = {
    type: "filter",
    filters: [
        { filter: "owner", value: "self" },
        {
            filter: "type",
            value: "item",
        },
        {
            filter: "zone",
            value: "discard",
        },
    ],
    comparison: { operator: "gte", value: 1 },
};
export const whileADamagedCharacterIsInPlay = {
    type: "filter",
    filters: [
        {
            filter: "type",
            value: "character",
        },
        {
            filter: "zone",
            value: "play",
        },
        {
            filter: "status",
            value: "damaged",
        },
    ],
    comparison: { operator: "gte", value: 1 },
};
export const whileAnotherDamagedCharacterIsInPlay = {
    type: "filter",
    filters: [
        {
            filter: "type",
            value: "character",
        },
        {
            filter: "zone",
            value: "play",
        },
        {
            filter: "status",
            value: "damaged",
        },
        {
            filter: "source",
            value: "other",
        },
    ],
    comparison: { operator: "gte", value: 1 },
};
export const whileYouHaveTwoOrMoreCharactersExerted = {
    type: "filter",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "status", value: "exerted" },
        { filter: "zone", value: "play" },
    ],
    comparison: { operator: "gte", value: 2 },
};
export const youHaveDamagedCharacter = {
    type: "filter",
    filters: [
        { filter: "owner", value: "self" },
        {
            filter: "type",
            value: "character",
        },
        {
            filter: "zone",
            value: "play",
        },
        {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
        },
    ],
    comparison: { operator: "gte", value: 1 },
};
export function whileThereAreXOrMoreDamagedCharacter(numCharacters) {
    return {
        type: "filter",
        filters: [
            {
                filter: "type",
                value: "character",
            },
            {
                filter: "zone",
                value: "play",
            },
            {
                filter: "status",
                value: "damage",
                comparison: { operator: "gte", value: 1 },
            },
        ],
        comparison: { operator: "gte", value: numCharacters },
    };
}
export const haveCaptainInPlay = {
    type: "filter",
    filters: [
        { filter: "owner", value: "self" },
        {
            filter: "type",
            value: "character",
        },
        {
            filter: "zone",
            value: "play",
        },
        {
            filter: "characteristics",
            value: ["captain"],
        },
    ],
    comparison: { operator: "gte", value: 1 },
};
export const dontHaveCaptainInPlay = {
    type: "filter",
    filters: [
        { filter: "owner", value: "self" },
        {
            filter: "type",
            value: "character",
        },
        {
            filter: "zone",
            value: "play",
        },
        {
            filter: "characteristics",
            value: ["captain"],
        },
    ],
    comparison: { operator: "lte", value: 0 },
};
export const haveElsaInPlay = {
    type: "filter",
    comparison: { operator: "gte", value: 1 },
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
        {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Elsa" },
        },
    ],
};
export const duringYourTurn = {
    type: "during-turn",
    value: "self",
};
export const duringOpponentsTurn = {
    type: "during-turn",
    value: "opponent",
};
export const ifYouHaveACharacterHere = {
    type: "chars-at-location",
    comparison: { operator: "gte", value: 1 },
};
export const ifThisCharacterIsExerted = { type: "exerted" };
export const whileThisCharacterIsExerted = { type: "exerted" };
export const ifThisCharacterIsAtALocation = {
    type: "char-is-at-location",
};
export const whileCharacterIsAtLocation = ifThisCharacterIsAtALocation;
export const unlessItIsAtALocation = {
    ...ifThisCharacterIsAtALocation,
    negate: true,
};
export const youDidntPutAnyCardsIntoYourInkwellThisTurn = {
    type: "this-turn",
    value: "inked",
    target: "self",
    negate: true,
};
export const haveNoCardsInYourHand = {
    type: "hand",
    player: "self",
    amount: 0,
};
export const haveCardsInYourHand = {
    ...haveNoCardsInYourHand,
    negate: true,
};
//# sourceMappingURL=conditions.js.map