import type { ItemCard } from "@tcg/lorcana-types";

export const imperialProclamation: ItemCard = {
  id: "12k",
  cardType: "item",
  name: "Imperial Proclamation",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  text: "CALL TO THE FRONT Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
  cost: 1,
  cardNumber: 131,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8b04c1aa6989c48cb5eff4b133824a7f25a7a517",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { wheneverOneOfYourCharChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const imperialProclamation: LorcanitoItemCard = {
//   id: "vlv",
//   name: "Imperial Proclamation",
//   characteristics: ["item"],
//   text: "**CALL TO THE FRONT** Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
//   type: "item",
//   abilities: [
//     wheneverOneOfYourCharChallengesAnotherChar({
//       name: "Call To The Front",
//       text: "Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
//       effects: [youPayXLessToPlayNextCharThisTurn(1)],
//     }),
//   ],
//   flavour:
//     "By order of the Emperor, one man from every family must server in the Imperial Army\n−Chi Fu",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Devin Yang",
//   number: 131,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548191,
//   },
//   rarity: "rare",
// };
//
