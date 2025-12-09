export const discardACard = {
    type: "discard",
    amount: 1,
    target: {
        type: "card",
        value: 1,
        filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "hand" },
        ],
    },
};
export const drawXCard = (amount) => ({
    type: "draw",
    amount,
    target: {
        type: "player",
        value: "self",
    },
});
//# sourceMappingURL=effects.js.map