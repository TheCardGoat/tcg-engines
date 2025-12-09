import { yourOtherCharactersGet } from "@lorcanito/lorcana-engine/abilities/abilities";
import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
export const rhinoMotivationalSpeaker = {
    id: "jwn",
    name: "Rhino",
    title: "Motivational Speaker",
    characteristics: ["storyborn", "ally"],
    text: "DESTINY CALLING Your other characters get +2 {W}.",
    type: "character",
    abilities: [
        yourOtherCharactersGet({
            name: "DESTINY CALLING",
            text: "Your other characters get +2 {W}.",
            effects: [
                {
                    type: "attribute",
                    attribute: "willpower",
                    amount: 2,
                    modifier: "add",
                    target: yourOtherCharacters,
                },
            ],
        }),
    ],
    inkwell: false,
    // @ts-expect-error
    color: "",
    colors: ["amber", "steel"],
    cost: 6,
    strength: 4,
    willpower: 7,
    illustrator: "Stefano Zanchi",
    number: 1,
    set: "007",
    rarity: "rare",
    lore: 2,
};
//# sourceMappingURL=rhinoMotivationalSpeaker.js.map