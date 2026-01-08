// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const invitedToTheBallAction: LorcanitoActionCard = {
//   id: "lnv",
//   missingTestCase: true,
//   name: "Invited to the Ball",
//   characteristics: ["action"],
//   text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "scry",
//           amount: 2,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: self,
//           limits: {
//             bottom: 2,
//             inkwell: 0,
//             top: 0,
//             hand: 2,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       ],
//     },
//   ],
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Taraneh",
//   number: 29,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559086,
//   },
//   rarity: "uncommon",
// };
//
