// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const olafRecappingTheStory: LorcanitoCharacterCard = {
//   id: "wkn",
//   name: "Olaf",
//   title: "Recapping the Story",
//   characteristics: ["storyborn", "ally"],
//   text: "ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "ENDLESS TALE",
//       text: "When you play this character, chosen opposing character gets -1 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           duration: "turn",
//           until: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   illustrator: "Matt Chapman",
//   number: 156,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631454,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
