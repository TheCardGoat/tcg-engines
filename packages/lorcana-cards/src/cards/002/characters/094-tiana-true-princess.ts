import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaTruePrincess: CharacterCard = {
  id: "poo",
  cardType: "character",
  name: "Tiana",
  version: "True Princess",
  fullName: "Tiana - True Princess",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "002",
  cost: 5,
  strength: 5,
  willpower: 3,
  lore: 3,
  cardNumber: 94,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "5c924acbc256cf4a2612d7335de9b611b4607541",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const tianaTruePrincess: LorcanitoCharacterCard = {
//   id: "fdi",
//   name: "Tiana",
//   title: "True Princess",
//   characteristics: ["hero", "storyborn", "princess"],
//   type: "character",
//   flavour: "Finding your true self will set your heart aglow.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 5,
//   willpower: 3,
//   lore: 3,
//   illustrator: "Casey Robin",
//   number: 94,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527751,
//   },
//   rarity: "uncommon",
// };
//
