import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
export const missBiancaIndefectibleAgent = {
    id: "atj",
    name: "Miss Bianca",
    title: "Unwavering Agent",
    characteristics: ["dreamborn", "hero"],
    text: "KEEP HOPE Playing this character costs you 2 {I} less if you have an Ally character in play.",
    type: "character",
    abilities: [
        whenYouPlayThisForEachYouPayLess({
            name: "Keep Hope",
            text: "Playing this character costs you 2 {I} less if you have an Ally character in play.",
            amount: 2,
            conditions: [
                {
                    type: "filter",
                    comparison: {
                        operator: "gte",
                        value: 1,
                    },
                    filters: [
                        { filter: "type", value: "character" },
                        { filter: "zone", value: "play" },
                        { filter: "owner", value: "self" },
                        { filter: "characteristics", value: ["ally"] },
                    ],
                },
            ],
        }),
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 6,
    strength: 5,
    willpower: 5,
    illustrator: "Maria Dresden",
    number: 195,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=missBiancaIndefectibleAgent.js.map