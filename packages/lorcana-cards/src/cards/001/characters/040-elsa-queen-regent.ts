import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaQueenRegent: CharacterCard = {
  id: "3fv",
  cardType: "character",
  name: "Elsa",
  version: "Queen Regent",
  fullName: "Elsa - Queen Regent",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 40,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "0c66ceaa85ceec0fa1c10c4146b02d093fa8d2a4",
  },
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const elsaQueenRegent: LorcanitoCharacterCard = {
//   id: "oqx",
//   name: "Elsa",
//   title: "Queen Regent",
//   characteristics: ["hero", "queen", "sorcerer", "storyborn"],
//   type: "character",
//   flavour: "I never knew what I was capable of.",
//   inkwell: true,
//   colors: ["amethyst"],
//   illustrator: "Duyen Nguyen / Aubrey Archer",
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   lore: 1,
//   number: 40,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507276,
//   },
//   rarity: "common",
// };
//
