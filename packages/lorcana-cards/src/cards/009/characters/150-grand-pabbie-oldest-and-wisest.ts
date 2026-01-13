import type { CharacterCard } from "@tcg/lorcana-types";

export const grandPabbieOldestAndWisest: CharacterCard = {
  id: "qlg",
  cardType: "character",
  name: "Grand Pabbie",
  version: "Oldest and Wisest",
  fullName: "Grand Pabbie - Oldest and Wisest",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "009",
  text: "ANCIENT INSIGHT Whenever you remove 1 or more damage from one of your characters, gain 2 lore.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 150,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5fda7961be7e170285551784dcfb8f728e92a982",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { grandPabbieOldestAndWisest as grandPabbieOldestAndWisestAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/148-grand-pabbie-oldest-and-wisest";
//
// export const grandPabbieOldestAndWisest: LorcanitoCharacterCard = {
//   ...grandPabbieOldestAndWisestAsOrig,
//   id: "rj4",
//   reprints: [grandPabbieOldestAndWisestAsOrig.id],
//   number: 150,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650085,
//   },
// };
//
