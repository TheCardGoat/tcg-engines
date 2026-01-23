import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganRagingRat: CharacterCard = {
  id: "1g7",
  cardType: "character",
  name: "Ratigan",
  version: "Raging Rat",
  fullName: "Ratigan - Raging Rat",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "NOTHING CAN STAND IN MY WAY While this character has damage, he gets +2 {S}.",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 113,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bc26272317330401d45feffba7e17f0e155eac93",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const ratiganRagingRat: LorcanitoCharacterCard = {
//   id: "qhl",
//   missingTestCase: true,
//   name: "Ratigan",
//   title: "Raging Rat",
//   characteristics: ["dreamborn", "villain"],
//   text: "**NOTHING CAN STAND IN MY WAY** While this character has damage, he gets +2 {S}.",
//   type: "character",
//   abilities: [
//     whileThisCharacterHasDamageGets({
//       name: "Nothing can stand in my way",
//       text: "While this character has damage, he gets +2 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "static",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "The world’s most diabolical genius should never suffer such indignities!",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 1,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Adam Fenton",
//   number: 113,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561636,
//   },
//   rarity: "common",
// };
//
