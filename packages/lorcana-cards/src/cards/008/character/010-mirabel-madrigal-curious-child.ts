// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mirabelMadrigalCuriousChild: LorcanitoCharacterCard = {
//   id: "frn",
//   name: "Mirabel Madrigal",
//   title: "Curious Child",
//   characteristics: ["storyborn", "hero", "madrigal"],
//   text: "YOU ARE A JEWEL When you play this character, you may reveal a song card in your hand to gain 1 lore.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "YOU ARE A JEWEL",
//       text: "When you play this character, you may reveal a song card in your hand to gain 1 lore.",
//       optional: true,
//       dependentEffects: true,
//       effects: [
//         {
//           type: "reveal",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "action" },
//               { filter: "zone", value: "hand" },
//               { filter: "characteristics", value: ["song"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         youGainLore(1),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 0,
//   willpower: 2,
//   illustrator: "Arianna Rea",
//   number: 10,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631354,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
