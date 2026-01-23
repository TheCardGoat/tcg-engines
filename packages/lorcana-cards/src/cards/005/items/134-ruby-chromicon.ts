import type { ItemCard } from "@tcg/lorcana-types";

export const rubyChromicon: ItemCard = {
  id: "1tf",
  cardType: "item",
  name: "Ruby Chromicon",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "005",
  text: "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.",
  cost: 1,
  cardNumber: 134,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed3b71854b6b1360da9cc9f442856fad6e2a743d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rubyChromicon: LorcanitoItemCard = {
//   id: "bzl",
//   missingTestCase: true,
//   name: "Ruby Chromicon",
//   characteristics: ["item"],
//   text: "**RUBY LIGHT** {E} − Chosen character gets +1 {S} this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "exert" }],
//       text: "Ruby Light",
//       name: "{E} − Chosen character gets +1 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Leave fear behind.\n−Inscription",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Dustin Panzino",
//   number: 134,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560100,
//   },
//   rarity: "uncommon",
// };
//
