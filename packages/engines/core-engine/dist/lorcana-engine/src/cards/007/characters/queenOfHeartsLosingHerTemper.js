import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
export const queenOfHeartsLosingHerTemper = {
    id: "txy",
    name: "Queen Of Hearts",
    title: "Losing Her Temper",
    characteristics: ["storyborn", "villain", "queen"],
    text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
    type: "character",
    abilities: [
        whileThisCharacterHasDamageGets({
            name: "ROYAL PAIN",
            text: "While this character has damage, she gets +3 {S}.",
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    amount: 3,
                    modifier: "add",
                    target: thisCharacter,
                },
            ],
        }),
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 2,
    strength: 1,
    willpower: 4,
    illustrator: "Antoine Couttolenc / Samanta Erdini",
    number: 122,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=queenOfHeartsLosingHerTemper.js.map