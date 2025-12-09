import { returnCharacterFromDiscardToHand, returnChosenCharacterWithCostLess, } from "@lorcanito/lorcana-engine/effects/effects";
export const onlySoMuchRoom = {
    id: "o94",
    missingTestCase: true,
    name: "Only So Much Room",
    characteristics: ["action"],
    text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            dependentEffects: true,
            resolveEffectsIndividually: true,
            effects: [
                returnCharacterFromDiscardToHand,
                returnChosenCharacterWithCostLess(2),
            ],
        },
    ],
    inkwell: true,
    colors: ["amber", "emerald"],
    cost: 4,
    illustrator: "Therese Widenfjall",
    number: 41,
    set: "008",
    rarity: "uncommon",
};
//# sourceMappingURL=041-only-so-much-room.js.map