import { resistAbility, shiftAbility, voicelessAbility, } from "@lorcanito/lorcana-engine/abilities/abilities";
import { opposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
const piratesGainsResist = {
    type: "static",
    ability: "gain-ability",
    name: "FRIGHTFUL SCHEME",
    text: "While this character is exerted, Your Pirate characters gain Resist +1.",
    conditions: [{ type: "exerted" }],
    gainedAbility: resistAbility(1),
    target: {
        type: "card",
        value: "all",
        filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "characteristics", value: ["pirate"] },
        ],
    },
};
const frightfulSchemeAbility = [
    {
        type: "static",
        ability: "gain-ability",
        name: "FRIGHTFUL SCHEME",
        text: "While this character is exerted, opposing characters can't exert to sing songs",
        conditions: [{ type: "exerted" }],
        target: opposingCharacters,
        gainedAbility: voicelessAbility,
    },
    piratesGainsResist,
];
export const peteSpacePirate = {
    id: "be5",
    name: "Pete",
    title: "Space Pirate",
    characteristics: ["floodborn", "villain", "pirate"],
    text: "Shift 4\nFRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
    type: "character",
    abilities: [shiftAbility(4, "Pete"), ...frightfulSchemeAbility],
    inkwell: true,
    colors: ["emerald", "steel"],
    cost: 6,
    strength: 5,
    willpower: 5,
    illustrator: "Kenneth Anderson",
    number: 114,
    set: "007",
    rarity: "super_rare",
    lore: 2,
};
//# sourceMappingURL=peteSpacePirate.js.map