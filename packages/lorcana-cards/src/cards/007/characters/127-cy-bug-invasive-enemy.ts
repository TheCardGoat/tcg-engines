import type { CharacterCard } from "@tcg/lorcana-types";

export const cybugInvasiveEnemy: CharacterCard = {
  id: "1ls",
  cardType: "character",
  name: "Cy-Bug",
  version: "Invasive Enemy",
  fullName: "Cy-Bug - Invasive Enemy",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 127,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d03d06aac96130ef91033f5aba0d28d7ade58cdc",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
//
// export const cybugInvasiveEnemy: LorcanitoCharacterCard = {
//   id: "eku",
//   name: "Cy-bug",
//   title: "Invasive Enemy",
//   characteristics: ["storyborn"],
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Cristian Romero",
//   number: 127,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619475,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
//   abilities: [
//     propertyStaticAbilities({
//       name: "Hive Mind",
//       text: "This character gets +1 {S} for each other character you have in play.",
//       attribute: "strength",
//       amount: {
//         dynamic: true,
//         filters: [
//           // TODO: I'm not sure why this is working, we should need to exclude himself from the sum as the text is `each other character`
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     }),
//   ],
// };
//
