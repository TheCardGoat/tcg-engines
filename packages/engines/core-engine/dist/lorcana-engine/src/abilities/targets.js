export const self = {
    type: "player",
    value: "self",
};
export const chosenPlayer = {
    type: "player",
    value: "target",
};
export const opponent = {
    type: "player",
    value: "opponent",
};
export const chosenExertedCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "status", value: "exerted" },
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
export const targetTriggerCard = {
    type: "card",
    value: "all",
    filters: [{ filter: "trigger", value: "target" }],
};
export const chosenCharacterCharacteristic = (characteristics) => ({
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "characteristics", value: characteristics },
    ],
});
export const chosenCharacterNamed = (name) => {
    return {
        type: "card",
        value: 1,
        filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: name },
            },
        ],
    };
};
export const chosenHeroCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        {
            filter: "characteristics",
            value: ["hero"],
        },
    ],
};
export const chosenPirateCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        {
            filter: "characteristics",
            value: ["pirate"],
        },
    ],
};
export const chosenCharacterOfYoursAtLocation = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        { filter: "status", value: "at-location" },
    ],
};
export const anotherChosenCharacter = {
    type: "card",
    value: 1,
    excludeSelf: true,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
    ],
};
export const anyNumberOfChosenCharacters = {
    type: "card",
    value: 99,
    upTo: true,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
    ],
};
export const chosenItem = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: ["item"] },
        { filter: "zone", value: "play" },
    ],
};
export const chosenItemOfYours = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: ["item"] },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const chosenItemOrLocation = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: ["item", "location"] },
        { filter: "zone", value: "play" },
    ],
};
export const thisCharacter = {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "self" }],
};
export const sourceTarget = {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "target" }],
};
export const anyCard = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: ["character", "item", "location", "action"] },
    ],
};
export const targetCard = {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "target" }],
};
export const thisLocation = thisCharacter;
export const chosenLocation = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: ["location"] },
        { filter: "zone", value: "play" },
    ],
};
export const yourOtherCharacters = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
    ],
};
export const yourFloodbornCharsThatHaveACardUnder = {
    type: "card",
    value: "all",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "characteristics", value: ["floodborn"] },
        { filter: "zone", value: "play" },
        { filter: "status", value: "has-card-under" },
    ],
};
export const yourLocations = {
    type: "card",
    value: "all",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "location" },
        { filter: "zone", value: "play" },
    ],
};
export const yourBanishedLocations = {
    type: "card",
    value: "all",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "location" },
        { filter: "zone", value: ["discard", "play"] },
    ],
};
export const yourItems = {
    type: "card",
    value: "all",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "item" },
        { filter: "zone", value: "play" },
    ],
};
export const yourBanishedItems = {
    type: "card",
    value: "all",
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "item" },
        { filter: "zone", value: ["discard", "play"] },
    ],
};
export const chosenCharacterOrLocation = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: ["character", "location"] },
        { filter: "zone", value: "play" },
    ],
};
export const chosenYourDamagedCharacter = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
        },
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
export const anotherChosenCharacterOfYours = {
    excludeSelf: true,
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
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
export const anyNumberOfYourCharacters = {
    type: "card",
    value: 99,
    upTo: true,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const chosenLocationOfYours = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "location" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const chosenCharacterOfYoursIncludingSelf = {
    type: "card",
    value: 1,
    includeSelf: true,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const chosenOtherCharacterOfYours = {
    type: "card",
    value: 1,
    excludeSelf: true,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        { filter: "source", value: "other" },
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
export const thisCard = {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "self" }],
};
export const eachOpposingReadyCharacter = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
        { filter: "status", value: "ready" },
    ],
};
export const eachOpposingDamagedCharacter = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
        {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
        },
    ],
};
export const allOpposingItems = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "item" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
    ],
};
export const allOpposingLocations = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "location" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
    ],
};
export const allOpposingCharacters = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
    ],
};
export const eachOpposingCharacter = allOpposingCharacters;
export const opposingCharacters = allOpposingCharacters;
export const allYourCharacters = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export function yourCharactersNamed(name) {
    return {
        type: "card",
        value: "all",
        filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: name },
            },
        ],
    };
}
export const allCharacters = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
    ],
};
export const eachCharacterInPlay = allCharacters;
export const eachOtherCharacterInPlay = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
    ],
};
export const yourLocationCards = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: "location" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
    ],
};
export const allYourCharacteristicCharacters = (characteristics, excludeSelf = false) => ({
    type: "card",
    value: "all",
    excludeSelf,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        { filter: "characteristics", value: characteristics },
    ],
});
export const eachOfYourCharacters = allYourCharacters;
export const oneOfYourCharacters = allYourCharacters;
export const oneOfYourOtherCharacters = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
    ],
};
export const oneOfYourOpponentsCharactersItemsOrLocations = {
    type: "card",
    value: "all",
    filters: [
        { filter: "owner", value: "opponent" },
        { filter: "type", value: ["character", "item", "location"] },
    ],
};
export const yourCharacters = allYourCharacters;
export const chosenCardFromYourHand = {
    type: "card",
    value: 1,
    filters: [
        { filter: "zone", value: "hand" },
        { filter: "owner", value: "self" },
    ],
};
export const allCardsFromYourHand = {
    type: "card",
    value: "all",
    filters: [
        { filter: "zone", value: "hand" },
        { filter: "owner", value: "self" },
    ],
};
export const topCardOfYourDeck = {
    type: "card",
    value: 1,
    filters: [{ filter: "top-deck", value: "self" }],
};
export const topCardOfOpponentDeck = {
    type: "card",
    value: 1,
    filters: [{ filter: "top-deck", value: "opponent" }],
};
export const topCardOfOpponentsDeck = {
    type: "card",
    value: 1,
    filters: [{ filter: "top-deck", value: "opponent" }],
};
export const topXCardsOfYourDeck = (value) => ({
    type: "card",
    value,
    filters: [{ filter: "top-deck", value: "self" }],
}); // TODO: This should work
export const topXCardsOfOpponentsDeck = (value) => ({
    type: "card",
    value,
    filters: [{ filter: "top-deck", value: "opponent" }],
}); // TODO: This should work
export function withCostXorLess(cost) {
    return {
        filter: "attribute",
        value: "cost",
        comparison: { operator: "lte", value: cost },
    };
}
export function chosenCharacterWithCostXorLess(cost) {
    return {
        type: "card",
        value: 1,
        filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            withCostXorLess(cost),
        ],
    };
}
export function withStrengthXorLess(cost) {
    return {
        filter: "attribute",
        value: "strength",
        comparison: { operator: "lte", value: cost },
    };
}
export function withStrengthXorMore(cost) {
    return {
        filter: "attribute",
        value: "strength",
        comparison: { operator: "gte", value: cost },
    };
}
export function chosenCharacterWithStrengthXorLess(str) {
    return {
        type: "card",
        value: 1,
        filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            withStrengthXorLess(str),
        ],
    };
}
export const whileHereTarget = {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
        {
            filter: "location",
            value: "source",
        },
        { filter: "type", value: "character" },
    ],
};
export const challengingCharacter = {
    type: "card",
    value: "all",
    filters: [{ filter: "challenge", value: "attacker" }],
};
export const anyCardTargetYouOwn = {
    type: "card",
    value: "all",
    filters: [{ filter: "owner", value: "self" }],
};
export const anyTarget = {
    type: "card",
    value: "all",
    filters: [
        { filter: "type", value: ["character", "item", "location", "action"] },
    ],
};
export const namedCard = {
    type: "card",
    value: "all",
    filters: [
        // { filter: "zone", value: "deck" },
        // { filter: "owner", value: "self" },
        {
            filter: "name-a-card",
        },
    ],
};
/* This will play the card with the instanceId that matches the parent's target.
   Example: jafarHighSultanOfLorcana
*/
export const parentsTarget = {
    type: "card",
    value: "all",
    filters: [
        {
            filter: "attribute",
            value: "instanceId",
            comparison: { operator: "eq", value: "target" },
        },
    ],
};
export const allYourCharactersWithAnSpecificAbility = (ability, excludeSelf = false) => ({
    type: "card",
    value: "all",
    excludeSelf,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
        { filter: "ability", value: ability },
    ],
});
//# sourceMappingURL=targets.js.map