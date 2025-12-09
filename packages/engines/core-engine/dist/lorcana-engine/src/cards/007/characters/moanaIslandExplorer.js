import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { anotherChosenCharOfYours } from "@lorcanito/lorcana-engine/abilities/target";
import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
export const moanaIslandExplorer = {
    id: "fa3",
    name: "Moana",
    title: "Island Explorer",
    characteristics: ["storyborn", "hero", "princess"],
    type: "character",
    inkwell: true,
    colors: ["ruby"],
    cost: 4,
    strength: 4,
    willpower: 3,
    illustrator: "Jackie Droujko",
    number: 134,
    set: "007",
    rarity: "uncommon",
    lore: 1,
    text: "Evasive\nADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
    abilities: [
        evasiveAbility,
        wheneverChallengesAnotherChar({
            name: "ADVENTUROUS SPIRIT",
            text: "Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
            effects: [getStrengthThisTurn(3, anotherChosenCharOfYours)],
        }),
    ],
};
//# sourceMappingURL=moanaIslandExplorer.js.map