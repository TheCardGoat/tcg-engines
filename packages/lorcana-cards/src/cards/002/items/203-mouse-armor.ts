import type { ItemCard } from "@tcg/lorcana-types";

export const mouseArmor: ItemCard = {
  id: "1as",
  cardType: "item",
  name: "Mouse Armor",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 2,
  cardNumber: 203,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a8a678ce1ce9ad4855ef12e449fae23cb97cb0ff",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mouseArmor: LorcanitoItemCard = {
//   id: "xso",
//
//   name: "Mouse Armor",
//   characteristics: ["item"],
//   text: "**PROTECTION** {E} − Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Protection",
//       text: "{E} − Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//       costs: [{ type: "exert" }],
//       effects: [chosenCharacterGainsResist(1)],
//     },
//   ],
//   flavour: "Built by the tiniest of hands for the bravest of hearts.",
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Gaku Kumatori",
//   number: 203,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 520862,
//   },
//   rarity: "uncommon",
// };
//
