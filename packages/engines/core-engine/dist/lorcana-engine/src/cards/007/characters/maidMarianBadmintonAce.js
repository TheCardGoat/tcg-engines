import { resistAbility, } from "@lorcanito/lorcana-engine/abilities/abilities";
import { duringOpponentsTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { dealDamageToChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
export const maidMarianBadmintonAce = {
    id: "wjz",
    name: "Maid Marian",
    title: "Badminton Ace",
    characteristics: ["dreamborn", "hero", "princess"],
    text: "GOOD SHOT During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.\nFAIR PLAY Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)",
    type: "character",
    abilities: [
        {
            type: "static-triggered",
            optional: false,
            name: "Good Shot",
            text: "During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
            conditions: [duringOpponentsTurn],
            trigger: {
                on: "damage",
                filters: [
                    { filter: "owner", value: "self" },
                    { filter: "zone", value: "play" },
                    { filter: "type", value: "character" },
                    { filter: "characteristics", value: ["ally"] },
                ],
            },
            layer: {
                type: "resolution",
                name: "Good Shot",
                text: "During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
                optional: false,
                effects: [dealDamageToChosenOpposingCharacter(1)],
            }, // Something funky going on with TS
        },
        {
            type: "static",
            ability: "gain-ability",
            name: "Fair Play",
            text: "Your characters named Lady Kluck gain Resist +1.",
            gainedAbility: resistAbility(1),
            target: {
                type: "card",
                value: "all",
                filters: [
                    { filter: "zone", value: "play" },
                    { filter: "type", value: "character" },
                    { filter: "owner", value: "self" },
                    {
                        filter: "attribute",
                        value: "name",
                        comparison: { operator: "eq", value: "Lady Kluck" },
                    },
                ],
            },
        },
    ],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["sapphire", "steel"],
    cost: 4,
    strength: 3,
    willpower: 3,
    illustrator: "Emily Abdyedera",
    number: 176,
    set: "007",
    rarity: "super_rare",
    lore: 2,
};
//# sourceMappingURL=maidMarianBadmintonAce.js.map