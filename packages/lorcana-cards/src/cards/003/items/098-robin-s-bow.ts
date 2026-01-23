// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { wheneverACharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyThisItem } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const robinsBow: LorcanitoItemCard = {
//   id: "b4u",
//   missingTestCase: true,
//   name: "Robin's Bow",
//   characteristics: ["item"],
//   text: "**FOREST'S GIFT** {E} – Deal 1 damage to chosen damaged character or location.\n\n\n**A BIT OF A LARK** Whenever a character of yours named Robin Hood quests, you may ready this item.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "FOREST'S GIFT",
//       text: "{E} – Deal 1 damage to chosen damaged character or location.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["location", "character"] },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "status",
//                 value: "damage",
//                 comparison: { operator: "gte", value: 1 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     wheneverACharacterQuests({
//       name: "A bit of a Lark",
//       text: "Whenever a character of yours named Robin Hood quests, you may ready this item.",
//       optional: true,
//       effects: [readyThisItem],
//       characterFilter: [
//         {
//           filter: "attribute",
//           value: "name",
//           comparison: { operator: "eq", value: "robin hood" },
//         },
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//         { filter: "zone", value: "play" },
//       ],
//     }),
//   ],
//   flavour: "The forest always provides just what you need. \n–Robin Hood",
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "McKay Anderson",
//   number: 98,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537827,
//   },
//   rarity: "uncommon",
// };
//
