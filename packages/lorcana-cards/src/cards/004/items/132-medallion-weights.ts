// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const medallionWeights: LorcanitoItemCard = {
//   id: "xo1",
//   reprints: ["c57"],
//   name: "Medallion Weights",
//   characteristics: ["item"],
//   text: "**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Discipline And Strength",
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       text: "{E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//         {
//           type: "ability",
//           ability: "custom",
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//           customAbility: wheneverChallengesAnotherChar({
//             name: "Discipline And Strength",
//             text: "Whenever they challenge another character this turn, you may draw a card.",
//             optional: true,
//             effects: [drawACard],
//           }),
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   illustrator: "Defne Tōzūm",
//   number: 132,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549430,
//   },
//   rarity: "uncommon",
// };
//
