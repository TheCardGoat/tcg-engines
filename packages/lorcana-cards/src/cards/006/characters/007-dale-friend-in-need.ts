import type { CharacterCard } from "@tcg/lorcana-types";

export const daleFriendInNeed: CharacterCard = {
  id: "1pa",
  cardType: "character",
  name: "Dale",
  version: "Friend in Need",
  fullName: "Dale - Friend in Need",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "CHIP'S PARTNER This character enters play exerted unless you have a character named Chip in play.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 7,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dcea84da6960a81b9536b7989764a6b80c735f6d",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const daleFriendInNeed: LorcanitoCharacterCard = {
//   id: "f8n",
//   name: "Dale",
//   title: "Friend in Need",
//   characteristics: ["hero", "storyborn"],
//   text: "**CHIP'S PARTNER** This character enters play exerted unless you have a character named Chip in play.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "CHIP'S PARTNER",
//       resolutionConditions: [
//         {
//           type: "filter",
//           comparison: { operator: "eq", value: 0 },
//           filters: [
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             {
//               filter: "attribute",
//               value: "name",
//               comparison: { operator: "eq", value: "Chip" },
//             },
//           ],
//         },
//       ],
//       text: "This character enters play exerted unless you have a character named Chip in play.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "But Chip, hanging around is what I do best!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Ron Baird",
//   number: 7,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578168,
//   },
//   rarity: "common",
// };
//
