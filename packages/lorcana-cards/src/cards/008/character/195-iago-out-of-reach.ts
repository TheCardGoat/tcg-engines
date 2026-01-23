// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const iagoOutOfReach: LorcanitoCharacterCard = {
//   id: "z25",
//   name: "Iago",
//   title: "Out of Reach",
//   characteristics: ["storyborn", "ally"],
//   text: "SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Self-Preservation",
//       text: "While you have another exerted character in play, this character can't be challenged.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             { filter: "status", value: "exerted" },
//           ],
//           comparison: { operator: "gte", value: 1 },
//           excludeSelf: true,
//         },
//       ],
//       effects: [
//         {
//           type: "restriction" as const,
//           restriction: "be-challenged" as const,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Carlos Luzzi",
//   number: 195,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631480,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
