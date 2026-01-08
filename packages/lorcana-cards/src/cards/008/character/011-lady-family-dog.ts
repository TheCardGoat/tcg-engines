// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const ladyFamilyDog: LorcanitoCharacterCard = {
//   id: "aif",
//   name: "Lady",
//   title: "Family Dog",
//   characteristics: ["storyborn", "hero"],
//   text: "SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Erika Wiseman",
//   number: 11,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631355,
//   },
//   rarity: "rare",
//   lore: 2,
//   abilities: [
//     whenYouPlayThis({
//       name: "SOMEONE TO CARE FOR",
//       text: "When you play this character, you may play a character with cost 2 or less for free.",
//       optional: true,
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 ignoreBonuses: true,
//                 comparison: {
//                   operator: "lte",
//                   value: 2,
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
