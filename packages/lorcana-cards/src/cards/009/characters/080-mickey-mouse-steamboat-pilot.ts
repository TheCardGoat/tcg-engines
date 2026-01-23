import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseSteamboatPilot: CharacterCard = {
  id: "16f",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Steamboat Pilot",
  fullName: "Mickey Mouse - Steamboat Pilot",
  inkType: ["emerald"],
  set: "009",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 80,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "98e74f278b9358ae6e4e6e05ffa6b6c7aa4a416b",
  },
  classifications: ["Storyborn", "Hero", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mickeyMouseSteamBoatPilot as mickeyMouseSteamboatPilotAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/089-mickey-mouse-steamboat-pilot";
//
// export const mickeyMouseSteamboatPilot: LorcanitoCharacterCard = {
//   ...mickeyMouseSteamboatPilotAsOrig,
//   id: "y3c",
//   reprints: [mickeyMouseSteamboatPilotAsOrig.id],
//   number: 80,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650020,
//   },
// };
//
