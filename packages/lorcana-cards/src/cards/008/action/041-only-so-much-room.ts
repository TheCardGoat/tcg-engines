// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   returnCharacterFromDiscardToHand,
//   returnChosenCharacterWithCostLess,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const onlySoMuchRoom: LorcanitoActionCard = {
//   id: "o94",
//   name: "Only So Much Room",
//   characteristics: ["action"],
//   text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         returnChosenCharacterWithCostLess(2),
//         returnCharacterFromDiscardToHand,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber", "emerald"],
//   cost: 4,
//   illustrator: "Therese Widenfjall",
//   number: 41,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631379,
//   },
//   rarity: "uncommon",
// };
//
