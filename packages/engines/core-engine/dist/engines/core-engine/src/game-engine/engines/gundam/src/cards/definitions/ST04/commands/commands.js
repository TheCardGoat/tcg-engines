import { mainOrActionAbility } from "~/game-engine/engines/gundam/src/abilities/abilities";
export const hawkOfEndymion = {
    id: "ST04-013",
    implemented: false,
    cost: 1,
    level: 2,
    name: "Hawk of Endymion",
    pilotName: "Mu La Flaga",
    type: "command",
    subType: "pilot",
    abilities: mainOrActionAbility({
        name: "Hawk of Endymion",
        text: "Choose 1 enemy Unit 3 or less HP. Return it to it's owner's hand.",
        effects: [
            {
                type: "move",
                to: "hand",
                target: {
                    type: "card",
                    value: 1,
                    filters: [
                        { filter: "zone", value: "battle" },
                        { filter: "owner", value: "opponent" },
                        {
                            filter: "attribute",
                            value: "hp",
                            comparison: { operator: "lte", value: 3 },
                        },
                    ],
                },
            },
        ],
    }),
    rarity: "common",
    color: "white",
    number: 13,
    set: "ST04",
    traits: ["earth alliance"],
    apModifier: 1,
    hpModifier: 0,
};
//# sourceMappingURL=commands.js.map