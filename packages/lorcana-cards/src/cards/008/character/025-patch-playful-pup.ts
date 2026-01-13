// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const patchPlayfulPup: LorcanitoCharacterCard = {
//   id: "pl4",
//   name: "Patch",
//   title: "Playful Pup",
//   characteristics: ["storyborn", "puppy"],
//   text: "Ward\nPUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     whileConditionThisCharacterGets({
//       name: "PUPPY BARKING",
//       text: "While you have another Puppy character in play, this character gets +1 {L}.",
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//             { filter: "characteristics", value: ["puppy"] },
//           ],
//           excludeSelf: true,
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "attribute" as const,
//           attribute: "lore" as const,
//           amount: 1,
//           modifier: "add" as const,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber", "sapphire"],
//   cost: 1,
//   strength: 0,
//   willpower: 2,
//   illustrator: "Oggy Christiansson",
//   number: 25,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631368,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
