import type { ItemCard } from "@tcg/lorcana-types";

export const sapphireChromicon: ItemCard = {
  id: "cxg",
  cardType: "item",
  name: "Sapphire Chromicon",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "005",
  text: "POWERING UP This item enters play exerted.\nSAPPHIRE LIGHT {E}, 2 {I}, Banish one of your items — Gain 2 lore.",
  cost: 4,
  cardNumber: 168,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2e9957576c0c2c349d09a69356f9ee57db0b41c7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import {
//   entersPlayExerted,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sapphireChromicon: LorcanitoItemCard = {
//   id: "f9o",
//   missingTestCase: true,
//   name: "Sapphire Chromicon",
//   characteristics: ["item"],
//   text: "**POWERING UP** This item enters play exerted.<br>**SAPPHIRE LIGHT** {E}, 2 {I}, Banish one of your items – Gain 2 lore.",
//   type: "item",
//   abilities: [
//     entersPlayExerted({
//       name: "Powering UP",
//     }),
//     {
//       type: "activated",
//       name: "Sapphire Light",
//       text: "{E}, 2 {I}, Banish one of your items – Gain 2 lore.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "banish",
//           target: chosenItemOfYours,
//         },
//         youGainLore(2),
//       ],
//     },
//   ],
//   flavour: "Knowledge is eternal.\n–Inscription",
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Dustin Panzino",
//   number: 168,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560103,
//   },
//   rarity: "uncommon",
// };
//
