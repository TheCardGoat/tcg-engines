import type { CharacterCard } from "@tcg/lorcana-types";

export const liloMakingAWish: CharacterCard = {
  id: "1uc",
  cardType: "character",
  name: "Lilo",
  version: "Making a Wish",
  fullName: "Lilo - Making a Wish",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "001",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 9,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "ee5f2dc07c2b61b8bbe2f489417909ba9cc495f2",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const liloMakingAWish: LorcanitoCharacterCard = {
//   id: "ep8",
//   name: "Lilo",
//   title: "Making a Wish",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour: "A falling star . . . I have to make a wish!",
//   colors: ["amber"],
//   cost: 1,
//   strength: 1,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Dave Beauchene",
//   number: 9,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503315,
//   },
//   rarity: "rare",
// };
//
