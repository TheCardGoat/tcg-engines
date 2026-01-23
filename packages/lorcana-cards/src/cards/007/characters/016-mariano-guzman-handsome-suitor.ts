import type { CharacterCard } from "@tcg/lorcana-types";

export const marianoGuzmanHandsomeSuitor: CharacterCard = {
  id: "15v",
  cardType: "character",
  name: "Mariano Guzman",
  version: "Handsome Suitor",
  fullName: "Mariano Guzman - Handsome Suitor",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  text: "I SEE YOU While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 16,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "96e9154811d25333627f2c164557f25cf35abeae",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
//
// export const marianoGuzmanSeductivePretender: LorcanitoCharacterCard = {
//   id: "w5e",
//   name: "Mariano Guzman",
//   title: "Handsome Suitor",
//   characteristics: ["storyborn", "ally"],
//   text: "I SEE YOU As long as you have a Dolores Madrigal character in play, this character gets +1 {L}.",
//   type: "character",
//   abilities: [
//     propertyStaticAbilities({
//       name: "I SEE YOU",
//       text: "While you have a character named Dolores Madrigal in play, this character gets +1 {L}.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "Dolores Madrigal" },
//             },
//           ],
//         },
//       ],
//       attribute: "lore",
//       amount: 1,
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Simanta Edini",
//   number: 16,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618688,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
