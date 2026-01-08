// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const detectivesBadge: LorcanitoItemCard = {
//   id: "ha0",
//   name: "Detective's Badge",
//   characteristics: ["item"],
//   text: "PROTECT AND SERVE {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
//   type: "item",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Svetlozara Nikolova",
//   number: 166,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660340,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "activated",
//       name: "PROTECT AND SERVE",
//       text: "{E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         chosenCharacterGainsResist(1, "next_turn"),
//         {
//           type: "characteristic",
//           characteristics: ["detective"],
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
// };
//
