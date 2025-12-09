export const forEachItemYouHaveInPlay = {
    dynamic: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "item" },
        { filter: "owner", value: "self" },
    ],
};
export const forEachCharYouHaveInPlay = {
    dynamic: true,
    filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
    ],
};
export const forEachCardInYourHand = {
    dynamic: true,
    filters: [
        { filter: "zone", value: "hand" },
        { filter: "owner", value: "self" },
    ],
};
export const forEachCardInYourDiscard = {
    dynamic: true,
    filters: [
        { filter: "zone", value: "discard" },
        { filter: "owner", value: "self" },
    ],
};
export const allCardsInYourDeck = {
    dynamic: true,
    filters: [
        { filter: "zone", value: "deck" },
        { filter: "owner", value: "self" },
    ],
};
//# sourceMappingURL=amounts.js.map