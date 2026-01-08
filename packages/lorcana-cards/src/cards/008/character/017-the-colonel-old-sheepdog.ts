// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { have3orMorePuppiesInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const theColonelOldSheepdog: LorcanitoCharacterCard = {
//   id: "xi2",
//   missingTestCase: true,
//   name: "The Colonel",
//   title: "Old Sheepdog",
//   characteristics: ["storyborn", "ally"],
//   text: "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "WE'VE GOT 'EM OUTNUMBERED",
//       text: "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
//       conditions: [have3orMorePuppiesInPlay],
//       effects: [
//         {
//           type: "attribute" as const,
//           attribute: "strength" as const,
//           amount: 2,
//           modifier: "add" as const,
//           target: thisCharacter,
//         },
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
//   colors: ["amber"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   illustrator: "Mariana Moreno",
//   number: 17,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631361,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
