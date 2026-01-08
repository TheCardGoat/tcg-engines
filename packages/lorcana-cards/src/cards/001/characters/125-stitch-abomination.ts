import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchAbomination: CharacterCard = {
  id: "qq8",
  cardType: "character",
  name: "Stitch",
  version: "Abomination",
  fullName: "Stitch - Abomination",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "001",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 125,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "605537d5b0a89487a307dd83926907cdd96aa2fc",
  },
  classifications: ["Storyborn", "Hero", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const stitchAbomination: LorcanitoCharacterCard = {
//   id: "jhe",
//
//   name: "Stitch",
//   title: "Abomination",
//   characteristics: ["hero", "alien", "storyborn"],
//   type: "character",
//   flavour:
//     "His destructive programming is taking effect. He will be irresistibly drawn to large cities, where he will back up sewers, reverse street signs, and steal everyone's left shoe. \n−Jumba Jookiba",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 4,
//   willpower: 6,
//   lore: 3,
//   illustrator: "Bill Robinson",
//   number: 125,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508790,
//   },
//   rarity: "rare",
// };
//
