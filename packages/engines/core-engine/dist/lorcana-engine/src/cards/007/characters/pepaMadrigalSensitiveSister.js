import { wheneverOneOrMoreOfYourCharSingsASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
export const pepaMadrigalSensitiveSister = {
    id: "yb6",
    name: "Pepa Madrigal",
    title: "Sensitive Sister",
    characteristics: ["storyborn", "ally", "madrigal"],
    text: "CLEAR SKIES, CLEAR SKIES Whenever one or more of your characters sings a song, gain 1 lore.",
    type: "character",
    abilities: [
        wheneverOneOrMoreOfYourCharSingsASong({
            name: "CLEAR SKIES, CLEAR SKIES",
            text: "Whenever one or more of your characters sings a song, gain 1 lore.",
            effects: [youGainLore(1)],
        }),
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 3,
    strength: 2,
    willpower: 4,
    illustrator: "Valentina Grassiuso",
    number: 37,
    set: "007",
    rarity: "super_rare",
    lore: 1,
};
//# sourceMappingURL=pepaMadrigalSensitiveSister.js.map