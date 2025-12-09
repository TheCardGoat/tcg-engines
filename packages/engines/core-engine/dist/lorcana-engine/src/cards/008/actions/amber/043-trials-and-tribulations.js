import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
export const trialsAndTribulations = {
    id: "rky",
    missingTestCase: true,
    name: "Trials And Tribulations",
    characteristics: ["action", "song"],
    text: "Chosen character gets -4 {S} until the start of your next turn.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [chosenCharacterGetsStrength(-4, "next_turn")],
        },
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 2,
    illustrator: "Pauline Voss",
    number: 43,
    set: "008",
    rarity: "uncommon",
};
//# sourceMappingURL=043-trials-and-tribulations.js.map