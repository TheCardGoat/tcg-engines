import type { CharacterCard } from "@tcg/lorcana-types";

export const goonsMaleficentsUnderlings: CharacterCard = {
  id: "f2x",
  cardType: "character",
  name: "Goons",
  version: "Maleficent’s Underlings",
  fullName: "Goons - Maleficent’s Underlings",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "001",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 179,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "018285e9619cfde841d7c896c583409a92660f71",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// export const goonsMaleficent: LorcanitoCharacterCard = {
//   id: "blh",
//   name: "Goons",
//   title: "Maleficent's Underlings",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "They may seem useless, but they came with the castle.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Cam Kendell",
//   number: 179,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508915,
//   },
//   rarity: "common",
// };
//
