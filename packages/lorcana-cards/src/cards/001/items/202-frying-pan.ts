import type { ItemCard } from "@tcg/lorcana-types";

export const fryingPan: ItemCard = {
  id: "r9f",
  cardType: "item",
  name: "Frying Pan",
  version: "undefined",
  fullName: "Frying Pan - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**CLANG!** Banish this item - Chosen character can",
  cost: 2,
  cardNumber: 202,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { chosenCharacterCantChallengeDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const fryingPan: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "r9f",
//
//   name: "Frying Pan",
//   text: "**CLANG!** Banish this item - Chosen character can't challenge during their next turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       optional: false,
//       costs: [{ type: "banish" }],
//       effects: [chosenCharacterCantChallengeDuringNextTurn],
//     },
//   ],
//   flavour:
//     "It's a fine piece of cookware, but as a weapon it's truly stunning.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Kamil Murzyn",
//   number: 202,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492999,
//   },
//   rarity: "uncommon",
// };
//
