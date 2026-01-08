import type { CharacterCard } from "@tcg/lorcana-types";

export const argesTheCyclops: CharacterCard = {
  id: "b7r",
  cardType: "character",
  name: "Arges",
  version: "The Cyclops",
  fullName: "Arges - The Cyclops",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "004",
  cost: 2,
  strength: 4,
  willpower: 1,
  lore: 1,
  cardNumber: 173,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "286c468b7f39166d810fec8138c83852f03763aa",
  },
  classifications: ["Storyborn", "Titan"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const argesTheCyclops: LorcanitoCharacterCard = {
//   id: "gam",
//   name: "Arges",
//   title: "The Cyclops",
//   characteristics: ["storyborn", "titan"],
//   type: "character",
//   flavour:
//     "Looks like you got some big feelings there, buddy−let's stomp 'em out!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 4,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 173,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549558,
//   },
//   rarity: "common",
// };
//
