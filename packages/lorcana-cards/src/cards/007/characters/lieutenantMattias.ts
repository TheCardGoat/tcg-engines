// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const lieutenantMattias: LorcanitoCharacterCard = {
//   id: "lma",
//   name: "Lieutenant Mattias",
//   title: "Strict Teacher",
//   characteristics: ["storyborn", "ally", "knight"],
//   text: "TRAINING EXERCISES Ready all your characters. They gain Reckless until end of turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "TRAINING EXERCISES",
//       text: "Ready all your characters. They gain Reckless until end of turn.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         {
//           type: "ability",
//           ability: "reckless",
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Daniel Williams",
//   number: 146,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618154,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
