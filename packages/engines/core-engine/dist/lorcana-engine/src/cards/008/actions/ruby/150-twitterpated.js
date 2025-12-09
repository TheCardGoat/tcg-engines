import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
export const twitterpated = {
    id: "aku",
    missingTestCase: true,
    name: "Twitterpated",
    characteristics: ["action"],
    text: "Chosen character gains Evasive until the start of your next turn.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "ability",
                    ability: "evasive",
                    modifier: "add",
                    duration: "next_turn",
                    until: true,
                    target: chosenCharacter,
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 1,
    illustrator: "Omar Lozano",
    number: 150,
    set: "008",
    rarity: "uncommon",
};
//# sourceMappingURL=150-twitterpated.js.map