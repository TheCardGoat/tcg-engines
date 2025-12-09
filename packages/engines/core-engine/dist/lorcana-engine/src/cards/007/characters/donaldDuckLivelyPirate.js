import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
export const donaldDuckLivelyPirate = {
    id: "lp9",
    name: "Donald Duck",
    title: "Lively Pirate",
    characteristics: ["dreamborn", "hero", "pirate"],
    text: "DUCK OF ACTION Whenever this character is challenged, you may return an action card that isn't a song from your discard to your hand.",
    type: "character",
    abilities: [
        whenChallenged({
            name: "DUCK OF ACTION",
            text: "Whenever this character is challenged, you may return an action card that isn't a song from your discard to your hand.",
            optional: true,
            responder: "self",
            effects: [
                {
                    type: "move",
                    to: "hand",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "owner", value: "self" },
                            { filter: "type", value: ["action"] },
                            { filter: "characteristics", value: ["song"], negate: true },
                            { filter: "zone", value: "discard" },
                        ],
                    },
                },
            ],
        }),
    ],
    inkwell: false,
    colors: ["emerald"],
    cost: 2,
    strength: 1,
    willpower: 1,
    illustrator: "João Moura",
    number: 98,
    set: "007",
    rarity: "rare",
    lore: 2,
};
//# sourceMappingURL=donaldDuckLivelyPirate.js.map