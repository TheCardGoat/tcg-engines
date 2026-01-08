// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const brunosReturn: LorcanitoActionCard = {
//   id: "azx",
//   reprints: ["cr8"],
//   name: "Bruno's Return",
//   characteristics: ["action"],
//   text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Return a character card from your discard to your hand.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Cristian Romero",
//   number: 26,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548206,
//   },
//   rarity: "uncommon",
// };
//
