import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseCourageousSailor: CharacterCard = {
  id: "wqx",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Courageous Sailor",
  fullName: "Mickey Mouse - Courageous Sailor",
  inkType: ["ruby"],
  set: "006",
  text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "76067fd15c411217b76ba3aea1ceaa85d6049ec3",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileCharacterIsAtLocationItGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const mickeyMouseCourageousSailor: LorcanitoCharacterCard = {
//   id: "meu",
//   missingTestCase: true,
//   name: "Mickey Mouse",
//   title: "Courageous Sailor",
//   characteristics: ["dreamborn", "hero"],
//   text: "SOLID GROUND While this character is at a location, he gets +2 {S}.",
//   type: "character",
//   abilities: [
//     whileCharacterIsAtLocationItGets({
//       name: "Solid Ground",
//       text: "While this character is at a location, he gets +2 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Kenneth Anderson",
//   number: 115,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 586979,
//   },
//   rarity: "common",
// };
//
