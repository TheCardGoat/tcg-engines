// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   getStrengthThisTurn,
//   mayBanish,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const gastonArrogantShowoff: LorcanitoCharacterCard = {
//   id: "jpd",
//   name: "Gaston",
//   title: "Arrogant Showoff",
//   characteristics: ["storyborn", "villain"],
//   text: "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "BREAK APART",
//       text: "When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
//       optional: true,
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         mayBanish({
//           type: "card",
//           value: 1,
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "item" },
//             { filter: "zone", value: "play" },
//           ],
//         }),
//         getStrengthThisTurn(2, chosenCharacter),
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Saimolostorec",
//   number: 129,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 632687,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
