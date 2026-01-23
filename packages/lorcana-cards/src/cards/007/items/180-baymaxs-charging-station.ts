import type { ItemCard } from "@tcg/lorcana-types";

export const baymaxsChargingStation: ItemCard = {
  id: "zom",
  cardType: "item",
  name: "Baymax's Charging Station",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
  cost: 3,
  cardNumber: 180,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "809b5752ee2de600186f4bd616bff5e0ec7a1806",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { baymaxsChargingStationAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const baymaxsChargingStation: LorcanitoItemCard = {
//   id: "rwg",
//   name: "Baymax's Charging Station",
//   characteristics: ["item"],
//   text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
//   type: "item",
//   abilities: [baymaxsChargingStationAbility],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   illustrator: "Juan Diego Leon",
//   number: 180,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618725,
//   },
//   rarity: "common",
// };
//
