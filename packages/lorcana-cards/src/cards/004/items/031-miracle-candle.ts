import type { ItemCard } from "@tcg/lorcana-types";

export const miracleCandle: ItemCard = {
  id: "1cb",
  cardType: "item",
  name: "Miracle Candle",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  text: "ABUELA'S GIFT Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
  cost: 2,
  cardNumber: 31,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "addabf289c8cbbf0b7d668c5d4e4e65e118fa61e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacterOfYours,
//   chosenLocation,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   healEffect,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const miracleCandle: LorcanitoItemCard = {
//   id: "ohm",
//   missingTestCase: true,
//   name: "Miracle Candle",
//   characteristics: ["item"],
//   text: "**ABUELA'S GIFT** Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Abuela's Gift",
//       costs: [{ type: "banish" }],
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 3 },
//           filters: chosenCharacterOfYours.filters,
//         },
//       ],
//       text: "Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
//       effects: [youGainLore(2), healEffect(2, chosenLocation, undefined, true)],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Kuya Jaypi",
//   number: 31,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549249,
//   },
//   rarity: "rare",
// };
//
