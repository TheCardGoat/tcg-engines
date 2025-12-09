import { whileADamagedCharacterIsInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
const takePoint = {
    type: "static",
    name: "TAKE POINT",
    text: "While a damaged character is in play, this character gets +2 {S}.",
    conditions: [whileADamagedCharacterIsInPlay],
    ability: "effects",
    effects: [
        {
            type: "attribute",
            attribute: "strength",
            amount: 2,
            modifier: "add",
            target: thisCharacter,
            duration: "static",
        },
    ],
};
export const cardSoldiersRoyalTroops = {
    id: "z86",
    name: "Card Soldiers",
    title: "Royal Troops",
    characteristics: ["storyborn", "ally"],
    text: "TAKE POINT While a damaged character is in play, this character gets +2 {S}.",
    type: "character",
    abilities: [takePoint],
    inkwell: true,
    colors: ["ruby"],
    cost: 1,
    strength: 1,
    willpower: 2,
    illustrator: "Kamil Murzyn",
    number: 129,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=cardSoldiersRoyalTroops.js.map