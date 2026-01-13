// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   whenChallenged,
//   whenYouPlayThis,
// } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const scroogeMcduckShushAgent: LorcanitoCharacterCard = {
//   id: "j53",
//   name: "Scrooge McDuck",
//   title: "S.H.U.S.H. Agent",
//   characteristics: ["storyborn", "hero"],
//   text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card. ON THE MOVE When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
//   type: "character",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 0,
//   willpower: 2,
//   illustrator: "Federico Maria Cugliari",
//   number: 89,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659464,
//   },
//   rarity: "super_rare",
//   lore: 2,
//   abilities: [
//     whenYouPlayThis({
//       name: "BACKUP PLAN",
//       text: "When you play this character, draw a card, then choose and discard a card.",
//       resolveEffectsIndividually: true,
//       dependentEffects: false,
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "zone",
//                 value: "hand",
//               },
//               {
//                 filter: "owner",
//                 value: "self",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//     whenChallenged({
//       name: "ON THE MOVE",
//       text: "When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
//       effects: [returnThisCardToHand],
//     }),
//   ],
// };
//
