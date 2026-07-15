import type { ItemCard } from "@tcg/lorcana-types";

export const fryingPan: ItemCard = {
  abilities: [],
  cardNumber: 202,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Frying Pan - undefined",
  id: "r9f",
  inkType: ["steel"],
  inkable: true,
  name: "Frying Pan",
  set: "001",
  text: "**CLANG!** Banish this item - Chosen character can",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { chosenCharacterCantChallengeDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const fryingPan: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "r9f",
//
//   Name: "Frying Pan",
//   Text: "**CLANG!** Banish this item - Chosen character can't challenge during their next turn.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Optional: false,
//       Costs: [{ type: "banish" }],
//       Effects: [chosenCharacterCantChallengeDuringNextTurn],
//     },
//   ],
//   Flavour:
//     "It's a fine piece of cookware, but as a weapon it's truly stunning.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Illustrator: "Kamil Murzyn",
//   Number: 202,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492999,
//   },
//   Rarity: "uncommon",
// };
//
