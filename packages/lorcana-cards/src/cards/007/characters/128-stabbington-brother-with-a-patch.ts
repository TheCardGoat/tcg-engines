import type { CharacterCard } from "@tcg/lorcana-types";

export const stabbingtonBrotherWithAPatch: CharacterCard = {
  id: "y6f",
  cardType: "character",
  name: "Stabbington Brother",
  version: "With a Patch",
  fullName: "Stabbington Brother - With a Patch",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "007",
  text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 128,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "036bf4522b52312d577ea5211b54cebf7979ed09",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { opponentLoseLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const stabbingtonBrotherWithAPatch: LorcanitoCharacterCard = {
//   id: "qq3",
//   name: "Stabbington Brother",
//   title: "With a Patch",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Saulo Nate",
//   number: 128,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619476,
//   },
//   rarity: "common",
//   lore: 1,
//   text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "Crime of Opportunity",
//       text: "chosen opponent loses 1 lore.",
//       effects: [opponentLoseLore(1)],
//     }),
//   ],
// };
//
