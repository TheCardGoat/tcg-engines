import type { CharacterCard } from "@tcg/lorcana-types";

export const chipTheTeacupGentleSoul: CharacterCard = {
  id: "1a8",
  cardType: "character",
  name: "Chip the Teacup",
  version: "Gentle Soul",
  fullName: "Chip the Teacup - Gentle Soul",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "002",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "a835c23a79c4efc44769f4eee2a7f39876b5529f",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const chipTheTeacupGentleSoul: LorcanitoCharacterCard = {
//   id: "v6d",
//   name: "Chip the Teacup",
//   title: "Gentle Soul",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "Wanna see me do a trick?",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Aubrey Archer",
//   number: 37,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525108,
//   },
//   rarity: "common",
// };
//
