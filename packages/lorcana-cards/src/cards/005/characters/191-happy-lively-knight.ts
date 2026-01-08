import type { CharacterCard } from "@tcg/lorcana-types";

export const happyLivelyKnight: CharacterCard = {
  id: "g6u",
  cardType: "character",
  name: "Happy",
  version: "Lively Knight",
  fullName: "Happy - Lively Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "BURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 191,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a59888573730230b6c46d076009658727fb43a8",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   duringYourTurnGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const happyLivelyKnight: LorcanitoCharacterCard = {
//   id: "kw2",
//   name: "Happy",
//   title: "Lively Knight",
//   characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
//   text: "**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_",
//   type: "character",
//   abilities: [
//     duringYourTurnGains(
//       "BURST OF SPEED",
//       "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
//       evasiveAbility,
//     ),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Mariana Moreno",
//   number: 191,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559665,
//   },
//   rarity: "common",
// };
//
