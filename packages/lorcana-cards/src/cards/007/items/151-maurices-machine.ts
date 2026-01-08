import type { ItemCard } from "@tcg/lorcana-types";

export const mauricesMachine: ItemCard = {
  id: "1fj",
  cardType: "item",
  name: "Maurice's Machine",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.",
  cost: 3,
  cardNumber: 151,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "051f6f7d75be055d8f35359a37f5737c6cf8907a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { mauricesMachineAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const mauricesMachine: LorcanitoItemCard = {
//   id: "v7o",
//   name: "Maurice's Machine",
//   characteristics: ["item"],
//   text: "BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.",
//   type: "item",
//   abilities: [mauricesMachineAbility],
//   inkwell: true,
//   colors: ["ruby", "sapphire"],
//   cost: 3,
//   illustrator: "Isaiah Mesq",
//   number: 151,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619493,
//   },
//   rarity: "uncommon",
// };
//
