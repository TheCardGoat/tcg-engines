// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const fourDozenEggs: LorcanitoActionCard = {
//   id: "cww",
//   reprints: ["wfa"],
//
//   name: "Four Dozen Eggs",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 4 or more can {E} to sing this\nsong for free.)_\n\nYour characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Four Dozen Eggs",
//       text: "Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 2,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Jochem Van Gool",
//   number: 163,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525091,
//   },
//   rarity: "uncommon",
// };
//
