import type { CharacterCard } from "@tcg/lorcana-types";

export const sourBillSurlyHenchman: CharacterCard = {
  id: "1f5",
  cardType: "character",
  name: "Sour Bill",
  version: "Surly Henchman",
  fullName: "Sour Bill - Surly Henchman",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 147,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b85405677bfa63f0c76edbe774545fb569d2604a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const sourBillSurlyHenchman: LorcanitoCharacterCard = {
//   id: "n2y",
//   missingTestCase: true,
//   name: "Sour Bill",
//   title: "Surly Henchman",
//   characteristics: ["storyborn", "ally"],
//   text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Unpalatable",
//       text: "When you play this character, chosen opposing character gets -2 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           duration: "turn",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Mike Mu / Livio Cacciatore",
//   number: 147,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591983,
//   },
//   rarity: "common",
// };
//
