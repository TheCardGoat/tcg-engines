import { resistAbility, singerAbility, } from "@lorcanito/lorcana-engine/abilities/abilities";
export const theTroubadourMusicalNarrator = {
    id: "jh3",
    name: "The Troubadour",
    title: "Musical Narrator",
    characteristics: ["storyborn", "ally"],
    text: "Resist +1\nSinger 4",
    type: "character",
    abilities: [resistAbility(1), singerAbility(4)],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["amber", "steel"],
    cost: 2,
    strength: 1,
    willpower: 3,
    illustrator: "Carmine Pucci",
    number: 11,
    set: "007",
    rarity: "uncommon",
    lore: 1,
};
//# sourceMappingURL=theTroubadourMusicalNarrator.js.map