import type { ItemCard } from "@tcg/lorcana-types";

export const emeraldCoil: ItemCard = {
  id: "1xj",
  cardType: "item",
  name: "Emerald Coil",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "007",
  text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 3,
  cardNumber: 120,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f9a952d88bbccdde151f68df4d1cfc77395426cf",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { emeraldCoilAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const emeraldCoil: LorcanitoItemCard = {
//   id: "mry",
//   name: "Emerald Coil",
//   characteristics: ["item"],
//   text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
//   type: "item",
//   abilities: [emeraldCoilAbility],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Francesco Colucci",
//   number: 120,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619471,
//   },
//   rarity: "uncommon",
// };
//
