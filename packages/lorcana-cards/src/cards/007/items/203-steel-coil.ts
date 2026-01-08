import type { ItemCard } from "@tcg/lorcana-types";

export const steelCoil: ItemCard = {
  id: "1y9",
  cardType: "item",
  name: "Steel Coil",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "007",
  text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
  cost: 2,
  cardNumber: 203,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ffb0c77401e035728f3eb2f32bed33d56dcc8e09",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { steelCoilAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const steelCoil: LorcanitoItemCard = {
//   id: "p3u",
//   name: "Steel Coil",
//   characteristics: ["item"],
//   text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
//   type: "item",
//   abilities: [steelCoilAbility],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Francesco Colucci",
//   number: 203,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619525,
//   },
//   rarity: "uncommon",
// };
//
