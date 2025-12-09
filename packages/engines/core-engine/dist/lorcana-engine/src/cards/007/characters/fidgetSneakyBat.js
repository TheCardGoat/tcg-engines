import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
export const fidgetSneakyBat = {
    id: "zgb",
    name: "Fidget",
    title: "Sneaky Bat",
    characteristics: ["storyborn", "ally"],
    text: "EVASIVE\nI TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gain Evasive until the start of your next turn.",
    type: "character",
    abilities: [
        evasiveAbility,
        wheneverQuests({
            name: "TOOK CARE OF EVERYTHING",
            text: "Whenever this character quests, another chosen character of yours gain Evasive until the start of your next turn.",
            effects: [
                {
                    type: "ability",
                    ability: "evasive",
                    modifier: "add",
                    duration: "next_turn",
                    until: true,
                    target: chosenCharacterOfYours,
                },
            ],
        }),
    ],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["emerald", "ruby"],
    cost: 4,
    strength: 2,
    willpower: 3,
    illustrator: "Ian MacDonald",
    number: 106,
    set: "007",
    rarity: "uncommon",
    lore: 2,
};
//# sourceMappingURL=fidgetSneakyBat.js.map