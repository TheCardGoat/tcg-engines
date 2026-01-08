// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { moveDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mammaOdieLoneSage: LorcanitoCharacterCard = {
//   id: "dhe",
//   missingTestCase: true,
//   name: "Mama Odie",
//   title: "Solitary Sage",
//   characteristics: ["storyborn", "ally", "sorcerer"],
//   text: "I HAVE TO DO EVERYTHING AROUND HERE Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayASong({
//       name: "I Have To Do Everything Around Here",
//       text: "Whenever you play a song, you may move up to 2 damage counters from chosen character to chosen opposing character.",
//       effects: [
//         moveDamageEffect({
//           amount: 2,
//           from: chosenCharacter,
//           to: chosenOpposingCharacter,
//         }),
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Mel Milton",
//   number: 57,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591113,
//   },
//   rarity: "rare",
// };
//
