import { challengeReadyCharacters } from "@lorcanito/lorcana-engine/abilities/abilities";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
export const liShangNewlyPromoted = {
    id: "scu",
    name: "Li Shang",
    title: "Newly Promoted",
    characteristics: ["storyborn", "hero", "captain"],
    text: "I WON'T LET YOU DOWN This character can challenge ready characters.\nBIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
    type: "character",
    abilities: [
        {
            ...challengeReadyCharacters,
            name: "I WON'T LET YOU DOWN",
            text: "This character can challenge ready characters.",
        },
        whileThisCharacterHasDamageGets({
            name: "BIG RESPONSIBILITY",
            text: "While this character is damaged, he gets +2 {S}.",
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    amount: 2,
                    modifier: "add",
                    target: thisCharacter,
                },
            ],
        }),
    ],
    inkwell: false,
    colors: ["ruby", "steel"],
    cost: 3,
    strength: 2,
    willpower: 3,
    illustrator: "Ian MacDonald",
    number: 133,
    set: "007",
    rarity: "uncommon",
    lore: 1,
};
//# sourceMappingURL=liShangNewlyPromoted.js.map