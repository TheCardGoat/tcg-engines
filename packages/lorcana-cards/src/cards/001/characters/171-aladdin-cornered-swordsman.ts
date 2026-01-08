import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinCorneredSwordsman: CharacterCard = {
  id: "1ud",
  cardType: "character",
  name: "Aladdin",
  version: "Cornered Swordsman",
  fullName: "Aladdin - Cornered Swordsman",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "001",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  cardNumber: 171,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "eebe1c4ff92d2e3ba65cbbd98be63816dfdd9b5b",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const aladdinCorneredSwordman: LorcanitoCharacterCard = {
//   id: "izd",
//   name: "Aladdin",
//   title: "Cornered Swordsman",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour: "Oh ho! So the street rat found a sword and a backbone! \n−Razoul",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Randy Bishop",
//   number: 171,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508895,
//   },
//   rarity: "common",
// };
//
