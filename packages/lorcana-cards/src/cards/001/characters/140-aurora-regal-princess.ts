import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraRegalPrincess: CharacterCard = {
  id: "b2e",
  cardType: "character",
  name: "Aurora",
  version: "Regal Princess",
  fullName: "Aurora - Regal Princess",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 140,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Hero", "Storyborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const auroraRegalPrincess: LorcanitoCharacterCard = {
//   id: "b2e",
//   reprints: ["gc3"],
//
//   name: "Aurora",
//   title: "Regal Princess",
//   characteristics: ["hero", "storyborn", "princess"],
//   type: "character",
//   flavour:
//     "„They say if you dream a thing more than once,\u0003 it‘s sure to come true!",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Samanta Erdini",
//   number: 140,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493484,
//   },
//   rarity: "uncommon",
// };
//
