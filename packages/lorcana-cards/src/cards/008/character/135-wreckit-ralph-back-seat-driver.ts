// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const wreckitRalphBackSeatDriver: LorcanitoCharacterCard = {
//   id: "nhw",
//   name: "Wreck-it Ralph",
//   title: "Back Seat Driver",
//   characteristics: ["storyborn", "hero", "racer"],
//   text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "CHARGED UP",
//       text: "When you play this character, chosen Racer character gets +4 {S} this turn.",
//       effects: [
//         getStrengthThisTurn(4, {
//           type: "card",
//           value: 1,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "characteristics", value: ["racer"] },
//           ],
//         }),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 2,
//   illustrator: "Joseph Buening",
//   number: 135,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631692,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
