// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const geppettoSkilledCraftsman: LorcanitoCharacterCard = {
//   id: "sp2",
//   name: "Geppetto",
//   title: "Skilled Craftsman",
//   characteristics: ["storyborn", "ally", "inventor"],
//   text: "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
//   type: "character",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "SEEKING INSPIRATION",
//       text: "Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
//       optional: true,
//       effects: [
//         {
//           type: "discard",
//           amount: 1, // PLACEHOLDER: Amount lives on target
//           target: {
//             type: "card",
//             value: 99,
//             upTo: true,
//             filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           forEach: [youGainLore(1)],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Malia Ewart",
//   number: 174,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 633102,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
