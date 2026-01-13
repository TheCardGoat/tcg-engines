import type { CharacterCard } from "@tcg/lorcana-types";

export const balooFunlovingBear: CharacterCard = {
  id: "1jf",
  cardType: "character",
  name: "Baloo",
  version: "Fun-Loving Bear",
  fullName: "Baloo - Fun-Loving Bear",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "002",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 103,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "c7d1485955ebaae6557ef8473abd9b267db61324",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const balooFunLovingBear: LorcanitoCharacterCard = {
//   id: "vpf",
//
//   name: "Baloo",
//   title: "Fun-Loving Bear",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "The bees are buzzin in the tree to make some honey just for me!",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: "R. la Barbera / L. Giammichele",
//   number: 103,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527752,
//   },
//   rarity: "common",
// };
//
