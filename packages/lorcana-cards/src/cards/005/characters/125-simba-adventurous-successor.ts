import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaAdventurousSuccessor: CharacterCard = {
  id: "1vb",
  cardType: "character",
  name: "Simba",
  version: "Adventurous Successor",
  fullName: "Simba - Adventurous Successor",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  text: "I LAUGH IN THE FACE OF DANGER When you play this character, chosen character gets +2 {S} this turn.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 125,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f366b5591bf174421106ad9ef1b368decafc6ace",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const simbaAdventurousSuccessor: LorcanitoCharacterCard = {
//   id: "y3p",
//   missingTestCase: true,
//   name: "Simba",
//   title: "Adventurous Successor",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**I LAUGH IN THE FACE OF DANGER** When you play this character, chosen character gets +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "I LAUGH IN THE FACE OF DANGER",
//       text: "When you play this character, chosen character gets +2 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   colors: ["ruby"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Valentin Palombo",
//   number: 125,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560135,
//   },
//   rarity: "common",
// };
//
