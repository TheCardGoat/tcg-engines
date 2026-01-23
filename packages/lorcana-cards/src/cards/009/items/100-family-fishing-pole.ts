import type { ItemCard } from "@tcg/lorcana-types";

export const familyFishingPole: ItemCard = {
  id: "xac",
  cardType: "item",
  name: "Family Fishing Pole",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "WATCH CLOSELY This item enters play exerted.\nTHE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
  cost: 2,
  cardNumber: 100,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "77f89661be484a477c94272ef31e4696926a7f36",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenYourExertedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   enterPlaysExerted,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const familyFishingPole: LorcanitoItemCard = {
//   id: "zd9",
//   missingTestCase: false,
//   name: "Family Fishing Pole",
//   characteristics: ["item"],
//   text: "WATCH CLOSELY This item enters play exerted.\nTHE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
//   type: "item",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Carlos Ruiz",
//   number: 100,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650038,
//   },
//   rarity: "rare",
//   abilities: [
//     whenYouPlayThis({
//       name: "WATCH CLOSELY",
//       text: "This item enters play exerted.",
//       effects: [enterPlaysExerted],
//     }),
//     {
//       type: "activated",
//       name: "THE PERFECT CAST",
//       text: "{E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
//       costs: [
//         { type: "exert" },
//         { type: "ink", amount: 1 },
//         { type: "banish" },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenYourExertedCharacter,
//         },
//         youGainLore(2),
//       ],
//     },
//   ],
// };
//
