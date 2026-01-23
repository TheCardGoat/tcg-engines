import type { CharacterCard } from "@tcg/lorcana-types";

export const finnickTinyTerror: CharacterCard = {
  id: "1ee",
  cardType: "character",
  name: "Finnick",
  version: "Tiny Terror",
  fullName: "Finnick - Tiny Terror",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "010",
  text: "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b5aba4698df6a9e1c7d6b835744b777105c7b9f2",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { returnChosenOpposingCharacterWithStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const finnickTinyTerror: LorcanitoCharacterCard = {
//   id: "rct",
//   name: "Finnick",
//   title: "Tiny Terror",
//   characteristics: ["storyborn", "ally"],
//   text: "YOU BETTER RUN When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Mario Oscar Gabriele",
//   number: 74,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658876,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "YOU BETTER RUN",
//       text: "When you play this character, you may pay 2 {I} to return chosen opposing character with 2 {S} or less to their player's hand.",
//       optional: true,
//       costs: [{ type: "ink", amount: 2 }],
//       effects: [returnChosenOpposingCharacterWithStrength(2, "lte")],
//     }),
//   ],
//   lore: 1,
// };
//
