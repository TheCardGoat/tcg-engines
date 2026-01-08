// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   chosenOpposingCharacterGainsRecklessDuringNextTurn,
//   chosenOpposingCharacterLoseStrengthUntilNextTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kaaHypnotizingPython: LorcanitoCharacterCard = {
//   id: "weo",
//   name: "Kaa",
//   title: "Hypnotizing Python",
//   characteristics: ["storyborn", "villain"],
//   text: "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
//   type: "character",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "LOOK ME IN THE EYE",
//       text: "Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
//       effects: [
//         chosenOpposingCharacterLoseStrengthUntilNextTurn(2),
//         chosenOpposingCharacterGainsRecklessDuringNextTurn,
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber", "emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Francesco D'Ippolito / Malià Evart",
//   number: 21,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631365,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
