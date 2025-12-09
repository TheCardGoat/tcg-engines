import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
export const anastasiaBossyStepsister = {
    id: "k8t",
    name: "Anastasia",
    title: "Bossy Stepsister",
    characteristics: ["storyborn", "ally"],
    text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
    type: "character",
    abilities: [
        whenChallenged({
            name: "OH, I HATE THIS!",
            text: "Whenever this character is challenged, the challenging player chooses and discards a card.",
            responder: "opponent",
            effects: [discardACard],
        }),
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 3,
    strength: 3,
    willpower: 1,
    illustrator: "Iliana Hidajat",
    number: 113,
    set: "007",
    rarity: "uncommon",
    lore: 2,
};
//# sourceMappingURL=anastasiaBossyStepsister.js.map