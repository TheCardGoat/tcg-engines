import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanStandingHerGround: CharacterCard = {
  id: "bls",
  cardType: "character",
  name: "Mulan",
  version: "Standing Her Ground",
  fullName: "Mulan - Standing Her Ground",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "010",
  text: "FLOWING BLADE During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 126,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "29d393cccec5ececb8e92969235b2a4cad5a4817",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const mulanStandingHerGround: LorcanitoCharacterCard = {
//   id: "df6",
//   name: "Mulan",
//   title: "Standing Her Ground",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "FLOWING BLADE During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 2,
//   illustrator: "Nicoletta Baldoni / Raquel Villanueva",
//   number: 126,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659604,
//   },
//   rarity: "uncommon",
//   abilities: [],
//   lore: 1,
// };
//
