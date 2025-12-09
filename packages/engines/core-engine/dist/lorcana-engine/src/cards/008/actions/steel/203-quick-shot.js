import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
export const quickShot = {
    id: "xuh",
    name: "Quick Shot",
    characteristics: ["action"],
    text: "Deal 1 damage to chosen character. Draw a card.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            resolveEffectsIndividually: true,
            name: "Quick Shot",
            text: "Deal 1 damage to chosen character. Draw a card.",
            effects: [
                drawACard,
                {
                    type: "damage",
                    amount: 1,
                    target: chosenCharacter,
                },
            ],
        },
    ],
    inkwell: false,
    colors: ["steel"],
    cost: 2,
    illustrator: "Diego Machuca",
    number: 203,
    set: "008",
    rarity: "uncommon",
};
//# sourceMappingURL=203-quick-shot.js.map