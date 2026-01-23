import type { CharacterCard } from "@tcg/lorcana-types";

export const cerberusThreeheadedDog: CharacterCard = {
  id: "zie",
  cardType: "character",
  name: "Cerberus",
  version: "Three-Headed Dog",
  fullName: "Cerberus - Three-Headed Dog",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  cardNumber: 176,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cerberusThreeHeadedDog: LorcanitoCharacterCard = {
//   id: "zie",
//   name: "Cerberus",
//   title: "Three-Headed Dog",
//   characteristics: ["storyborn"],
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   illustrator: "Oleg Yurkov",
//   cost: 5,
//   strength: 5,
//   willpower: 6,
//   lore: 1,
//   number: 176,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 497206,
//   },
//   rarity: "common",
// };
//
