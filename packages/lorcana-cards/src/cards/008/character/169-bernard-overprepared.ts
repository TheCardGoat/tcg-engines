// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const bernardOverprepared: LorcanitoCharacterCard = {
//   id: "d5e",
//   name: "Bernard",
//   title: "Over-Prepared",
//   characteristics: ["storyborn", "hero"],
//   text: "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "GO DOWN THERE AND INVESTIGATE",
//       text: "When you play this character, if you have an Ally character in play, you may draw a card.",
//       optional: true,
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             {
//               filter: "type",
//               value: "character",
//             },
//             {
//               filter: "characteristics",
//               value: ["ally"],
//             },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: self,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["sapphire", "steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "McKay Anderson",
//   number: 169,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631465,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
