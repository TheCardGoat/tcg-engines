import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
export const buckyNuttyRascal = {
    id: "tfn",
    name: "Bucky",
    title: "Nutty Rascal",
    characteristics: ["dreamborn", "ally"],
    text: "POP! When this character is banished in a challenge, you may draw a card.",
    type: "character",
    abilities: [
        whenThisCharacterBanishedInAChallenge({
            name: "POP!",
            text: "When this character is banished in a challenge, you may draw a card.",
            optional: true,
            effects: [drawACard],
        }),
    ],
    inkwell: true,
    colors: ["amethyst"],
    cost: 3,
    strength: 3,
    willpower: 2,
    illustrator: "Kenneth Anderson",
    number: 60,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=buckyNuttyRascal.js.map