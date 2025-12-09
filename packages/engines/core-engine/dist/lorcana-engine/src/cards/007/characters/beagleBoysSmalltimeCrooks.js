import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
export const beagleBoysSmalltimeCrooks = {
    id: "szr",
    name: "Beagle Boys",
    title: "Small-Time Crooks",
    characteristics: ["storyborn", "villain"],
    text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
    type: "character",
    abilities: [
        wheneverQuests({
            name: "HURRY IT UP!",
            text: "Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
            effects: [
                {
                    type: "ability",
                    ability: "rush",
                    modifier: "add",
                    duration: "turn",
                    target: chosenCharacterOfYours,
                },
                {
                    type: "ability",
                    ability: "resist",
                    amount: 1,
                    modifier: "add",
                    duration: "turn",
                    target: chosenCharacterOfYours,
                },
            ],
        }),
    ],
    inkwell: true,
    colors: ["ruby", "sapphire"],
    cost: 4,
    strength: 3,
    willpower: 3,
    illustrator: "Laura Bonger",
    number: 132,
    set: "007",
    rarity: "uncommon",
    lore: 2,
};
//# sourceMappingURL=beagleBoysSmalltimeCrooks.js.map