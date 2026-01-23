import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseTrueFriend: CharacterCard = {
  id: "dr0",
  cardType: "character",
  name: "Mickey Mouse",
  version: "True Friend",
  fullName: "Mickey Mouse - True Friend",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 12,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Hero", "Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mickeyMouseTrueFriend: LorcanitoCharacterCard = {
//   id: "dr0",
//   reprints: ["c2m"],
//   name: "Mickey Mouse",
//   title: "True Friend",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour:
//     "As long as he's around, newcomers to the Great Illuminary will always get a warm welcome.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Dave Beauchene",
//   number: 12,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493476,
//   },
//   rarity: "uncommon",
// };
//
