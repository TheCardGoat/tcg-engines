import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchNewDog: CharacterCard = {
  id: "hxe",
  cardType: "character",
  name: "Stitch",
  version: "New Dog",
  fullName: "Stitch - New Dog",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "001",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 22,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "409ccaff640db6b84e1ee98232013e2c9c43b5d1",
  },
  classifications: ["Storyborn", "Hero", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const stichtNewDog: LorcanitoCharacterCard = {
//   id: "wk8",
//
//   name: "Stitch",
//   title: "New Dog",
//   characteristics: ["hero", "alien", "storyborn"],
//   type: "character",
//   flavour:
//     "Lilo: „David! I got a new dog! David: „Auwe! . . . You sure it‘s a dog? Lilo: „Uh-huh. He used to be a collie before he got\rran over.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alex Accorsi",
//   number: 22,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493499,
//   },
//   rarity: "common",
// };
//
