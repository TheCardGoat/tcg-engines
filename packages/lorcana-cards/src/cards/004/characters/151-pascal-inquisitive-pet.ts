import type { CharacterCard } from "@tcg/lorcana-types";

export const pascalInquisitivePet: CharacterCard = {
  id: "f7s",
  cardType: "character",
  name: "Pascal",
  version: "Inquisitive Pet",
  fullName: "Pascal - Inquisitive Pet",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "004",
  text: "COLORFUL TACTICS When you play this character, look at the top 3 cards of your deck and put them back in any order.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 151,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "36d6ffd3b7830b2c8821ce4335b74e9387d55072",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const pascalInquisitivePet: LorcanitoCharacterCard = {
//   id: "smc",
//   name: "Pascal",
//   title: "Inquisitive Pet",
//   characteristics: ["storyborn", "ally"],
//   text: "**COLORFUL TACTICS** When you play this character, look at the top 3 cards of your deck and put them back in any order.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Colorful Tactics",
//       text: "When you play this character, look at the top 3 cards of your deck and put them back in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 3,
//           mode: "top",
//           target: self,
//           limits: {
//             bottom: 0,
//             top: 3,
//             hand: 0,
//             inkwell: 0,
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "If you want to find something hidden, get someone who's an expert at hiding.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Noukah",
//   number: 151,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550520,
//   },
//   rarity: "common",
// };
//
