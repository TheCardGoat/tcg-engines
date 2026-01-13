import type { CharacterCard } from "@tcg/lorcana-types";

export const helgaSinclairToughAsNails: CharacterCard = {
  id: "1ld",
  cardType: "character",
  name: "Helga Sinclair",
  version: "Tough as Nails",
  fullName: "Helga Sinclair - Tough as Nails",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "007",
  text: "Challenger +3 (While challenging, this character gets +3 {S}).\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 183,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cec4229e674ce5edcf99772e0cc579abb664db74",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   challengerAbility,
//   duringYourTurnGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const helgaSinclairToughAsNails: LorcanitoCharacterCard = {
//   id: "li7",
//   name: "Helga Sinclair",
//   title: "Tough as Nails",
//   characteristics: ["storyborn", "villain"],
//   text: "Challenger +3.\nQUICK REFLEXES During your turn, this character gains Evasive.",
//   type: "character",
//   abilities: [
//     challengerAbility(3),
//     duringYourTurnGains(
//       "QUICK REFLEXES",
//       "During your turn, this character gains **Evasive**.",
//       evasiveAbility,
//     ),
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   strength: 0,
//   willpower: 4,
//   illustrator: "Samoldstorre",
//   number: 183,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619511,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
