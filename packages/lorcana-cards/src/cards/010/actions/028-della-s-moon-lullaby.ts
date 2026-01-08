// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const dellasMoonLullaby: LorcanitoActionCard = {
//   id: "pql",
//   name: "Della's Moon Lullaby",
//   characteristics: ["action", "song"],
//   text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
//   type: "action",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Beatrice Blue / Otto Paredes",
//   number: 28,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658444,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: false,
//       dependentEffects: false,
//       text: "Chosen opposing character gets -2 until the start of your next turn. Draw a card.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: chosenOpposingCharacter,
//         },
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     },
//   ],
// };
//
