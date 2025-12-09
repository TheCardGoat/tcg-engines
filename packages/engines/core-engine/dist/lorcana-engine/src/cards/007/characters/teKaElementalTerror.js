import { shiftAbility, } from "@lorcanito/lorcana-engine/abilities/abilities";
import { opposingCharacters, thisCharacter, } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverIsExerted } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { banishThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
const ancientRage = {
    type: "static",
    ability: "gain-ability",
    name: "ANCIENT RAGE",
    text: "During your turn, whenever an opposing character is exerted, banish them.",
    conditions: [{ type: "during-turn", value: "self" }],
    target: opposingCharacters,
    gainedAbility: wheneverIsExerted({
        name: "ANCIENT RAGE",
        text: "During your turn, whenever an opposing character is exerted, banish them.",
        target: thisCharacter,
        effects: [banishThisCharacter],
    }),
};
export const teKaElementalTerror = {
    id: "g0z",
    name: "Te Kā",
    title: "Elemental Terror",
    characteristics: ["floodborn", "villain", "deity"],
    text: "Shift 7\nANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.",
    type: "character",
    abilities: [shiftAbility(7, "Te Kā"), ancientRage],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["amethyst", "ruby"],
    cost: 10,
    strength: 12,
    willpower: 12,
    illustrator: "Nicola Savioli",
    number: 54,
    set: "007",
    rarity: "super_rare",
    lore: 3,
};
//# sourceMappingURL=teKaElementalTerror.js.map