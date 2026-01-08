import type { CharacterCard } from "@tcg/lorcana-types";

export const princeNaveenUkulelePlayer: CharacterCard = {
  id: "v3r",
  cardType: "character",
  name: "Prince Naveen",
  version: "Ukulele Player",
  fullName: "Prince Naveen - Ukulele Player",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "005",
  text: "Singer 6 (This character counts as cost 6 to sing songs.)\nIT'S BEAUTIFUL, NO? When you play this character, you may play a song with cost 6 or less for free.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 3,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7019f88f23a40f374d0cc8e7cbb8cb18fd60de3a",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoCharacterCard,
//   PlayEffect,
// } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const princeNaveenUkulelePlayer: LorcanitoCharacterCard = {
//   id: "mnj",
//   name: "Prince Naveen",
//   title: "Ukulele Player",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**Singer 6** _(This character counts as cost 6 to sing songs.)_\n**IT'S BEAUTIFUL NO?** When you play this character, you may play a song with cost 6 or less for free.",
//   type: "character",
//   abilities: [
//     singerAbility(6),
//     {
//       type: "resolution",
//       optional: true,
//       name: "IT'S BEAUTIFUL NO?",
//       text: "When you play this character, you may play a song with cost 6 or less for free.",
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//               { filter: "characteristics", value: ["song"] },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 ignoreBonuses: true,
//                 comparison: { operator: "lte", value: 6 },
//               },
//             ],
//           },
//         } as PlayEffect,
//       ],
//     },
//   ],
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Rosa la Barbera / Livio Cacciatore",
//   number: 3,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561187,
//   },
//   rarity: "legendary",
// };
//
