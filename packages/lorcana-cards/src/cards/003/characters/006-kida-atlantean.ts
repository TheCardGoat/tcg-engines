import type { CharacterCard } from "@tcg/lorcana-types";

export const kidaAtlantean: CharacterCard = {
  id: "xrx",
  cardType: "character",
  name: "Kida",
  version: "Atlantean",
  fullName: "Kida - Atlantean",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "79baf58c016948be4df9848dd9fad3b7193fac43",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const kidaAtlantean: LorcanitoCharacterCard = {
//   id: "sro",
//   name: "Kida",
//   title: "Atlantean",
//   characteristics: ["hero", "storyborn", "princess"],
//   type: "character",
//   flavour: "Welcome to the Inklands. (Atlantean language)",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Nicoletta Baldari",
//   number: 6,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 536275,
//   },
//   rarity: "common",
// };
//
