import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatPerplexingFeline: CharacterCard = {
  id: "16n",
  cardType: "character",
  name: "Cheshire Cat",
  version: "Perplexing Feline",
  fullName: "Cheshire Cat - Perplexing Feline",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 91,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "99b060c09b5134d9107f78d08e2018d615658a7c",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { madGrinAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cheshireCatPerplexingFeline: LorcanitoCharacterCard = {
//   id: "kfp",
//   name: "Cheshire Cat",
//   title: "Perplexing Feline",
//   characteristics: ["storyborn"],
//   text: "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.",
//   type: "character",
//   abilities: [madGrinAbility],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Sandara Tang",
//   number: 91,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619454,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
