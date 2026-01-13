import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiDemigod: CharacterCard = {
  id: "1lg",
  cardType: "character",
  name: "Maui",
  version: "Demigod",
  fullName: "Maui - Demigod",
  inkType: ["steel"],
  franchise: "Moana",
  set: "001",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 3,
  cardNumber: 185,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "cdecdf5b7e02dbb11db38244fc5321e8744cadf5",
  },
  classifications: ["Storyborn", "Hero", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mauiDemiGod: LorcanitoCharacterCard = {
//   id: "ehe",
//   name: "Maui",
//   title: "Demigod",
//   characteristics: ["hero", "storyborn", "deity"],
//   type: "character",
//   flavour:
//     "When the gods gift you a boat, you take it. The boat's owner is optional.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 8,
//   strength: 8,
//   willpower: 8,
//   lore: 3,
//   illustrator: "Isaiah Mesq",
//   number: 185,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 502018,
//   },
//   rarity: "rare",
// };
//
