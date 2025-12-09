import { chosenCharacter, chosenItemOfYours, } from "@lorcanito/lorcana-engine/abilities/targets";
const iVeHadIt = {
    type: "activated",
    name: "I'VE HAD IT!",
    text: "{E}, 2 {I}, Banish 2 of your items – Deal 5 damage to chosen character.",
    costs: [
        { type: "exert" },
        { type: "ink", amount: 2 },
        {
            type: "card",
            action: "banish",
            amount: 2,
            filters: chosenItemOfYours.filters,
        },
    ],
    effects: [
        {
            type: "damage",
            amount: 5,
            target: chosenCharacter,
        },
    ],
};
export const beastFrustratedDesigner = {
    id: "tum",
    name: "Beast",
    title: "Frustrated Designer",
    characteristics: ["dreamborn", "hero", "prince", "inventor"],
    text: "I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items – Deal 5 damage to chosen character.",
    type: "character",
    abilities: [iVeHadIt],
    inkwell: false,
    // @ts-expect-error
    color: "",
    colors: ["ruby", "sapphire"],
    cost: 6,
    strength: 5,
    willpower: 5,
    illustrator: "Koni",
    number: 136,
    set: "007",
    rarity: "rare",
    lore: 2,
};
//# sourceMappingURL=beastFrustratedDesigner.js.map