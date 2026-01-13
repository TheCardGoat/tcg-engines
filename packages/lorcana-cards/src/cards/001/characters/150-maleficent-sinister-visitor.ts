import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentSinisterVisitor: CharacterCard = {
  id: "1c4",
  cardType: "character",
  name: "Maleficent",
  version: "Sinister Visitor",
  fullName: "Maleficent - Sinister Visitor",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 150,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "adecc4b6ee1d237ebac87d8e0f1e47f2dd689564",
  },
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const maleficentSinisterVisitor: LorcanitoCharacterCard = {
//   id: "zkp",
//
//   name: "Maleficent",
//   title: "Sinister Visitor",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   type: "character",
//   flavour:
//     "„The princess shall indeed grow in grace and beauty, beloved by all who know her. But before the sun sets on her sixteenth birthday, she shall prick her finger on the spindle of a spinning wheel...",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Nicholas Kole",
//   number: 150,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493493,
//   },
//   rarity: "common",
// };
//
