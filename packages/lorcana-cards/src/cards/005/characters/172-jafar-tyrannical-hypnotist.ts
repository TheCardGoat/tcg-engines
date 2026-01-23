import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarTyrannicalHypnotist: CharacterCard = {
  id: "xg5",
  cardType: "character",
  name: "Jafar",
  version: "Tyrannical Hypnotist",
  fullName: "Jafar - Tyrannical Hypnotist",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "005",
  text: "Challenger +7 (While challenging, this character gets +7 {S}.)\nINTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.",
  cost: 6,
  strength: 0,
  willpower: 7,
  lore: 2,
  cardNumber: 172,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "788ce5ab348a5417b600e7c2902097c8a264500b",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   challengerAbility,
//   charactersWithCostXorLessCantChallenge,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const jafarTyrannicalHypnotist: LorcanitoCharacterCard = {
//   id: "c2a",
//   name: "Jafar",
//   title: "Tyrannical Hypnotist",
//   characteristics: ["dreamborn", "sorcerer", "villain"],
//   text: "**Challenger** +7 _(While challenging, this character gets +7 {S}.)_\n \n**INTIMIDATING GAZE** Opposing characters with cost 4 or less can’t challenge.",
//   type: "character",
//   abilities: [
//     challengerAbility(7),
//     charactersWithCostXorLessCantChallenge({
//       name: "Intimidating Gaze",
//       text: "Opposing characters with cost 4 or less can’t challenge.",
//       cost: 4,
//     }),
//   ],
//   flavour: "No one will keep me from the broken crown!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 0,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Cam Kendell",
//   number: 172,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561328,
//   },
//   rarity: "legendary",
// };
//
