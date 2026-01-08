// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const crikeePartOfTheTeam: LorcanitoCharacterCard = {
//   id: "pul",
//   name: "Cri-kee",
//   title: "Part of the Team",
//   characteristics: ["storyborn", "ally"],
//   text: "AT HER SIDE While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "AT HER SIDE",
//       text: "While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "status", value: "exerted" },
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//           ],
//           comparison: { operator: "gte", value: 2 },
//           excludeSelf: true,
//         },
//       ],
//       effects: [
//         {
//           type: "attribute" as const,
//           attribute: "lore" as const,
//           amount: 2,
//           modifier: "add" as const,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Yu Nguyen",
//   number: 131,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631436,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
