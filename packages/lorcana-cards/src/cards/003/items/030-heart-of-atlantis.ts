import type { ItemCard } from "@tcg/lorcana-types";

export const heartOfAtlantis: ItemCard = {
  id: "zzp",
  cardType: "item",
  name: "Heart of Atlantis",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  text: "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.",
  cost: 4,
  cardNumber: 30,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "81b7a4a7ddb1986db77cd54d3e3e40d0154f0a29",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const heartOfAtlantis: LorcanitoItemCard = {
//   id: "cxw",
//   missingTestCase: true,
//   name: "Heart of Atlantis",
//   characteristics: ["item"],
//   text: "**LIFE GIVER** {E} – You pay 2 {I} less for the next character you play this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "LIFE GIVER",
//       costs: [{ type: "exert" }],
//       text: " {E} – You pay 2 {I} less for the next character you play this turn.",
//       effects: [youPayXLessToPlayNextCharThisTurn(2)],
//     },
//   ],
//   flavour: "It's what's keeping you–all of Atlantis–alive! \n–Milo Thatch",
//   colors: ["amber"],
//   cost: 4,
//   illustrator: "Elliot Baum / Viv Tanner",
//   number: 30,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 536277,
//   },
//   rarity: "rare",
// };
//
