import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenJealousBeauty: CharacterCard = {
  id: "ce7",
  cardType: "character",
  name: "The Queen",
  version: "Jealous Beauty",
  fullName: "The Queen - Jealous Beauty",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "007",
  text: "NO ORDINARY APPLE {E} — Choose 3 cards from chosen opponent's discard and put them on the bottom of their deck to gain 3 lore. If any Princess cards were moved this way, gain 4 lore instead.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2caba9821f2a147d04377683850773c4a50e222d",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { notAnOrdinaryAppleAbility } from "./notAnOrdinaryAppleAbility";
//
// export const theQueenJealousBeauty: LorcanitoCharacterCard = {
//   id: "tn7",
//   name: "The Queen",
//   title: "Jealous Beauty",
//   characteristics: ["storyborn", "villain", "queen", "mage"],
//   text: "NOT AN ORDINARY APPLE {E} - Choose 3 cards in an opponent's discard and put them under their deck to gain 3 lore. If you moved at least 1 Princess this way, gain 4 lore instead.",
//   type: "character",
//   abilities: [notAnOrdinaryAppleAbility],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Malia Ewart",
//   number: 74,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619446,
//   },
//   rarity: "legendary",
//   lore: 1,
// };
//
