import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseBraveLittlePrince: CharacterCard = {
  id: "cbw",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Prince",
  fullName: "Mickey Mouse - Brave Little Prince",
  inkType: ["ruby"],
  set: "009",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nCROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 111,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2c70fa049317778d3977506d8e340d662264a843",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { ifThereIsACardUnder } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const mickeyMouseBraveLittlePrince: LorcanitoCharacterCard = {
//   id: "hin",
//   name: "Mickey Mouse",
//   title: "Brave Little Prince",
//   characteristics: ["floodborn", "hero", "prince"],
//   text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nCROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Cristian Romero",
//   number: 111,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650047,
//   },
//   rarity: "legendary",
//   abilities: [
//     shiftAbility(5, "Mickey Mouse"),
//     evasiveAbility,
//     whileConditionThisCharacterGets({
//       name: "CROWNING ACHIEVEMENT",
//       text: "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}",
//       conditions: [ifThereIsACardUnder],
//       attribute: "strength",
//       amount: 3,
//     }),
//     whileConditionThisCharacterGets({
//       name: "CROWNING ACHIEVEMENT",
//       text: "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}",
//       conditions: [ifThereIsACardUnder],
//       attribute: "willpower",
//       amount: 3,
//     }),
//     whileConditionThisCharacterGets({
//       name: "CROWNING ACHIEVEMENT",
//       text: "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}",
//       conditions: [ifThereIsACardUnder],
//       attribute: "lore",
//       amount: 3,
//     }),
//   ],
//   lore: 1,
// };
//
