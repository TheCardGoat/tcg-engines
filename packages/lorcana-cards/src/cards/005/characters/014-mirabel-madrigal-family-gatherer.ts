import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalFamilyGatherer: CharacterCard = {
  id: "1v7",
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Family Gatherer",
  fullName: "Mirabel Madrigal - Family Gatherer",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "005",
  text: "NOT WITHOUT MY FAMILY You can't play this character unless you have 5 or more characters in play.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 5,
  cardNumber: 14,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f283e9f31fd0b57fa5892870d98a03793352b776",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const mirabelMadrigalFamilyGatherer: LorcanitoCharacterCard = {
//   id: "bjy",
//   name: "Mirabel Madrigal",
//   title: "Family Gatherer",
//   characteristics: ["hero", "storyborn", "madrigal"],
//   text: "**NOT WITHOUT MY FAMILY** You can’t play this character unless you have 5 or more characters in play.",
//   type: "character",
//   abilities: [
//     {
//       type: "play-condition",
//       name: "NOT WITHOUT MY FAMILY",
//       text: "You can’t play this character unless you have 5 or more characters in play.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 5 },
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour: "There’s nothing we can’t accomplish together!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 5,
//   willpower: 5,
//   lore: 5,
//   illustrator: "Emily Abeydeera",
//   number: 14,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561209,
//   },
//   rarity: "legendary",
// };
//
