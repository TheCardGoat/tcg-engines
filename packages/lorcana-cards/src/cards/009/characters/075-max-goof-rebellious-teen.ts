import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofRebelliousTeen: CharacterCard = {
  id: "1va",
  cardType: "character",
  name: "Max Goof",
  version: "Rebellious Teen",
  fullName: "Max Goof - Rebellious Teen",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 75,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f281bb60772f0650742a5f075ff156ba1d177e8b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const maxGoofRebelliousTeen: LorcanitoCharacterCard = {
//   id: "ctx",
//   missingTestCase: false,
//   name: "Max Goof",
//   title: "Rebellious Teen",
//   characteristics: ["storyborn", "hero"],
//   text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Rodrigo Camilo",
//   number: 75,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647681,
//   },
//   rarity: "rare",
//   lore: 1,
//   abilities: [
//     {
//       type: "resolution",
//       name: "PERSONAL SOUNDTRACK",
//       text: "When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
//       optional: true,
//       costs: [{ type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "action" },
//               { filter: "characteristics", value: ["song"] },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
