import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseSteamboatPilot: CharacterCard = {
  id: "p7k",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Steamboat Pilot",
  fullName: "Mickey Mouse - Steamboat Pilot",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 89,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Hero", "Storyborn", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mickeyMouseSteamBoatPilot: LorcanitoCharacterCard = {
//   id: "p7k",
//   reprints: ["y3c"],
//
//   name: "Mickey Mouse",
//   title: "Steamboat Pilot",
//   characteristics: ["hero", "storyborn", "captain"],
//   type: "character",
//   flavour:
//     "On rivers throughout the Inklands, the little steamboat’s whistle answers the cheery tunes of its pilot.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Juan Diego Leon",
//   number: 89,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492709,
//   },
//   rarity: "common",
// };
//
