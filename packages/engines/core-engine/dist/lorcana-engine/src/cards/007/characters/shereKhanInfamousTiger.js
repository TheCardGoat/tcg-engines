import { discardYourHand } from "@lorcanito/lorcana-engine/effects/effects";
export const shereKhanInfamousTiger = {
    id: "gmw",
    name: "Shere Khan",
    title: "Infamous Tiger",
    characteristics: ["storyborn", "villain"],
    text: "IT IS REGRETTABLE When you play this character, discard your hand.",
    type: "character",
    abilities: [
        {
            type: "resolution",
            name: "IT IS REGRETTABLE",
            text: "When you play this character, discard your hand.",
            optional: false,
            detrimental: true,
            effects: [discardYourHand],
        },
    ],
    inkwell: false,
    colors: ["emerald"],
    cost: 4,
    strength: 4,
    willpower: 4,
    illustrator: "Stefano Zanchi",
    number: 92,
    set: "007",
    rarity: "rare",
    lore: 4,
};
//# sourceMappingURL=shereKhanInfamousTiger.js.map