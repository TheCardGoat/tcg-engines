// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import {
//   opponentLoseLore,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const lefouCakeThief: LorcanitoCharacterCard = {
//   id: "ka1",
//   name: "LeFou",
//   title: "Cake Thief",
//   characteristics: ["storyborn", "ally"],
//   text: "ALL FOR ME {E}, banish one of your items – Chosen opponent loses 1 lore and you gain 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "ALL FOR ME",
//       text: "{E}, banish one of your items – Chosen opponent loses 1 lore and you gain 1 lore.",
//       costs: [
//         { type: "exert" },
//         {
//           type: "card",
//           action: "banish",
//           amount: 1,
//           filters: chosenItemOfYours.filters,
//         },
//       ],
//       effects: [opponentLoseLore(1), youGainLore(1)],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby", "sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Simone Buonfantino",
//   number: 138,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631440,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
