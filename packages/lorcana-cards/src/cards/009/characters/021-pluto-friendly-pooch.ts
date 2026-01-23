import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoFriendlyPooch: CharacterCard = {
  id: "16c",
  cardType: "character",
  name: "Pluto",
  version: "Friendly Pooch",
  fullName: "Pluto - Friendly Pooch",
  inkType: ["amber"],
  set: "009",
  text: "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  cardNumber: 21,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "98a41ededf0b9cfe8fa7096aaf97b6290be8f370",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { plutoFriendlyPooch as ogPlutoFriendlyPooch } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const plutoFriendlyPooch: LorcanitoCharacterCard = {
//   ...ogPlutoFriendlyPooch,
//   id: "gm9",
//   reprints: [ogPlutoFriendlyPooch.id],
//   number: 21,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649969,
//   },
// };
//
