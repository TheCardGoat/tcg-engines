import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonIntellectualPowerhouse: CharacterCard = {
  id: "14c",
  cardType: "character",
  name: "Gaston",
  version: "Intellectual Powerhouse",
  fullName: "Gaston - Intellectual Powerhouse",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gaston.)\nDEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  cardNumber: 147,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "915d35f346eb17d9a3d109dce4edbdff38dfebeb",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const gastonIntellectualPowerhouse: LorcanitoCharacterCard = {
//   id: "zsp",
//
//   name: "Gaston",
//   title: "Intellectual Powerhouse",
//   characteristics: ["floodborn", "villain"],
//   text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Gaston.)_<br>\n**DEVELOPED BRAIN** When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "gaston"),
//     {
//       type: "resolution",
//       name: "Developed Brain",
//       text: "When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 3,
//           mode: "bottom",
//           shouldRevealTutored: false,
//           target: self,
//           limits: {
//             bottom: 3,
//             inkwell: 0,
//             top: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//           ],
//         },
//       ],
//     },
//   ],
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 4,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Matthew Robert Davies",
//   number: 147,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516406,
//   },
//   rarity: "rare",
// };
//
