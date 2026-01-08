import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelConceitedManipulator: CharacterCard = {
  id: "1ui",
  cardType: "character",
  name: "Mother Gothel",
  version: "Conceited Manipulator",
  fullName: "Mother Gothel - Conceited Manipulator",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  text: "MOTHER KNOWS BEST When you play this character, you may pay 3 {I} to return chosen character to their player's hand.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 89,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "efb38f749cb6a632dcfeab1adc5d4aa4e4297a8d",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const motherGothelConceitedManipulator: LorcanitoCharacterCard = {
//   id: "frm",
//   name: "Mother Gothel",
//   title: "Conceited Manipulator",
//   characteristics: ["storyborn", "villain"],
//   text: "**MOTHER KNOWS BEST** When you play this character, you may pay 3 {I} to return chosen character to their player’s hand.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "MOTHER KNOWS BEST",
//       text: "When you play this character, you may pay 3 {I} to return chosen character to their player’s hand.",
//       costs: [{ type: "ink", amount: 3 }],
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "A beautiful lady never stands meekly at the back of the line.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Carlos Gomes Cabral",
//   number: 89,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561631,
//   },
//   rarity: "uncommon",
// };
//
