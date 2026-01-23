// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const digALittleDeeper: LorcanitoActionCard = {
//   id: "vrj",
//   reprints: ["pbu"],
//   missingTestCase: true,
//   name: "Dig A Little Deeper",
//   characteristics: ["action", "song"],
//   text: "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "action",
//   abilities: [
//     singerTogetherAbility(8),
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "scry",
//           amount: 7,
//           mode: "bottom",
//           shouldRevealTutored: false,
//           target: self,
//           limits: {
//             bottom: 5,
//             inkwell: 0,
//             hand: 2,
//             top: 0,
//             discard: 0,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//           ],
//         },
//       ],
//     },
//   ],
//   colors: ["sapphire"],
//   cost: 8,
//   illustrator: "Rachel Elese",
//   number: 162,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547842,
//   },
//   rarity: "uncommon",
// };
//
