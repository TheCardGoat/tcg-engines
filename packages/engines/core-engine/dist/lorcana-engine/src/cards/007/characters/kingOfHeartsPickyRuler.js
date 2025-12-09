const objectionableStateAbility = {
    name: "OBJECTIONABLE STATE",
    text: "Damaged characters can't challenge your characters.",
    type: "static",
    ability: "effects",
    effects: [
        {
            type: "restriction",
            restriction: "challenge-characters",
            target: {
                type: "card",
                value: "all",
                filters: [
                    { filter: "type", value: "character" },
                    { filter: "zone", value: "play" },
                    { filter: "owner", value: "opponent" },
                    { filter: "status", value: "damaged" },
                ],
            },
        },
    ],
};
export const kingOfHeartsPickyRuler = {
    id: "qim",
    name: "King Of Hearts",
    title: "Picky Ruler",
    characteristics: ["storyborn", "ally", "king"],
    text: "OBJECTIONABLE STATE Damaged characters can't challenge your characters.",
    type: "character",
    abilities: [objectionableStateAbility],
    inkwell: false,
    colors: ["emerald"],
    cost: 4,
    strength: 3,
    willpower: 3,
    illustrator: "Isiah Mesq",
    number: 111,
    set: "007",
    rarity: "rare",
    lore: 2,
};
//# sourceMappingURL=kingOfHeartsPickyRuler.js.map