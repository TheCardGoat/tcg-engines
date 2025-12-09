import { haveMoreCardsThanOpponent } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
export const pachaTrekmate = {
    id: "nu8",
    name: "Pacha",
    title: "Trekmate",
    characteristics: ["storyborn", "hero"],
    text: "FULL PACK While you have more cards in hand than each opponent, this character gets +2 {L}.",
    type: "character",
    abilities: [
        whileConditionThisCharacterGets({
            name: "FULL PACK",
            text: "While you have more cards in hand than each opponent, this character gets +2 {L}.",
            conditions: [haveMoreCardsThanOpponent],
            // @ts-ignore
            effects: [
                {
                    type: "attribute",
                    attribute: "lore",
                    amount: 2,
                    modifier: "add",
                    target: {
                        type: "card",
                        value: "all",
                        filters: [{ filter: "source", value: "self" }],
                    },
                },
            ],
        }),
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 3,
    strength: 3,
    willpower: 2,
    illustrator: "Luca Pirelli",
    number: 102,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=pachaTrekmate.js.map