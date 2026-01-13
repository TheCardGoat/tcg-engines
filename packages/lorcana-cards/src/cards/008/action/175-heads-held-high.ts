// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   allOpposingCharacters,
//   anyNumberOfChosenCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const headsHeldHigh: LorcanitoActionCard = {
//   id: "tfh",
//   missingTestCase: true,
//   name: "Heads Held High",
//   characteristics: ["action", "song"],
//   text: "Sing Together 6\nRemove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
//   type: "action",
//   abilities: [
//     singerTogetherAbility(6),
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           target: anyNumberOfChosenCharacters,
//         },
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 3,
//           modifier: "subtract",
//           duration: "turn",
//           until: true,
//           target: allOpposingCharacters,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   illustrator: "Lorenza Pigliamosche / Livio Cacciatore",
//   number: 175,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631348,
//   },
//   rarity: "rare",
// };
//
