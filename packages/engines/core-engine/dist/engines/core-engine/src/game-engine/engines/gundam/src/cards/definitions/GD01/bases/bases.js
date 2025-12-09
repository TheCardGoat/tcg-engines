export const side7 = {
    id: "SD01-124",
    implemented: false,
    cost: 1,
    level: 1,
    type: "base",
    name: "Side 7",
    color: "blue",
    abilities: [
        {
            type: "deploy",
            text: "Add 1 of your Shields to your hand.",
            effects: [
                {
                    type: "move",
                    to: "hand",
                    target: {
                        type: "card",
                        value: 1,
                        random: true,
                        filters: [
                            {
                                filter: "owner",
                                value: "self",
                            },
                            {
                                filter: "zone",
                                value: "shield",
                            },
                        ],
                    },
                },
            ],
        },
    ],
    zones: ["space"],
    set: "GD01",
    traits: ["earth federation", "stronghold"],
    ap: 0,
    hp: 4,
    number: 124,
    rarity: "common",
};
//# sourceMappingURL=bases.js.map