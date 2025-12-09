import { chosenCharacterCharacteristic } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
export const rogerRadcliffeDogLover = {
    id: "c3f",
    name: "Roger Radcliffe",
    title: "Dog Lover",
    characteristics: ["storyborn", "ally"],
    text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
    type: "character",
    abilities: [
        wheneverQuests({
            name: "THERE YOU GO",
            text: "Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
            effects: [
                {
                    type: "heal",
                    amount: 1,
                    target: chosenCharacterCharacteristic(["puppy"]),
                },
            ],
        }),
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 1,
    strength: 1,
    willpower: 2,
    illustrator: "Hedvig H-S",
    number: 5,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=rogerRadcliffeDogLover.js.map