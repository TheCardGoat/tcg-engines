import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
export const drCalicoGreeneyedMan = {
    id: "q5s",
    name: "Dr. Calico",
    title: "Green-Eyed Man",
    characteristics: ["storyborn", "villain"],
    text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2.",
    type: "character",
    abilities: [
        {
            ...resistAbility(2),
            conditions: [
                { type: "damage", comparison: { operator: "eq", value: 0 } },
            ],
        },
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 4,
    strength: 3,
    willpower: 4,
    illustrator: "Wouter Bruneel",
    number: 181,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=drCalicoGreeneyedMan.js.map