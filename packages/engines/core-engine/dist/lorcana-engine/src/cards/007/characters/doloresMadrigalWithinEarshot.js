import { wheneverOneOfYourCharactersSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
export const doloresMadrigalWithinEarshot = {
    id: "b3f",
    name: "Dolores Madrigal",
    title: "Within Earshot",
    characteristics: ["storyborn", "ally", "madrigal"],
    text: "I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.",
    type: "character",
    abilities: [
        wheneverOneOfYourCharactersSings({
            name: "I HEAR YOU",
            text: "Whenever one of your characters sings a song, chosen opponent reveals their hand.",
            effects: [opponentRevealHand],
        }),
    ],
    inkwell: true,
    colors: ["amethyst"],
    cost: 1,
    strength: 1,
    willpower: 2,
    illustrator: "Samantha Erdini",
    number: 78,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=doloresMadrigalWithinEarshot.js.map