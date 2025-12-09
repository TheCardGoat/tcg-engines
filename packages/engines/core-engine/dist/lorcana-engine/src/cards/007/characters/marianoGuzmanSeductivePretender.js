import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
export const marianoGuzmanSeductivePretender = {
    id: "w5e",
    name: "Mariano Guzman",
    title: "Handsome Suitor",
    characteristics: ["storyborn", "ally"],
    text: "I SEE YOU As long as you have a Dolores Madrigal character in play, this character gets +1 {L}.",
    type: "character",
    abilities: [
        propertyStaticAbilities({
            name: "I SEE YOU",
            text: "While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
            conditions: [
                {
                    type: "filter",
                    comparison: { operator: "gte", value: 1 },
                    filters: [
                        { filter: "zone", value: "play" },
                        { filter: "type", value: "character" },
                        { filter: "owner", value: "self" },
                        {
                            filter: "attribute",
                            value: "name",
                            comparison: { operator: "eq", value: "Dolores Madrigal" },
                        },
                    ],
                },
            ],
            attribute: "lore",
            amount: 1,
        }),
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 3,
    strength: 3,
    willpower: 4,
    illustrator: "Simanta Edini",
    number: 16,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=marianoGuzmanSeductivePretender.js.map