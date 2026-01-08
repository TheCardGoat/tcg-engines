// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenLocationOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   moveToLocation,
//   untilTheEndOfYourNextTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theGamesAfoot: LorcanitoActionCard = {
//   id: "iga",
//   name: "The Game's Afoot!",
//   characteristics: ["action"],
//   text: "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn.",
//   type: "action",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Kevin Slawinski",
//   number: 198,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660361,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [
//         moveToLocation({
//           type: "card",
//           value: 2,
//           upTo: true,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//           ],
//         }),
//         untilTheEndOfYourNextTurn({
//           type: "ability",
//           ability: "resist",
//           amount: 2,
//           modifier: "add",
//           target: chosenLocationOfYours,
//         }),
//       ],
//     },
//   ],
// };
//
