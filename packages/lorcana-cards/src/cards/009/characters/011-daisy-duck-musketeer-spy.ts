import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckMusketeerSpy: CharacterCard = {
  id: "19a",
  cardType: "character",
  name: "Daisy Duck",
  version: "Musketeer Spy",
  fullName: "Daisy Duck - Musketeer Spy",
  inkType: ["amber"],
  set: "009",
  text: "INFILTRATION When you play this character, each opponent chooses and discards a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 11,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a34164ff051a6a764bee43f9f9096b7deeec2e20",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { daisyDuckMusketeerSpy as ogDaisyDuckMusketeerSpy } from "@lorcanito/lorcana-engine/cards/004/characters/7-daisy-duck-musketeer-spy";
//
// export const daisyDuckMusketeerSpy: LorcanitoCharacterCard = {
//   ...ogDaisyDuckMusketeerSpy,
//   id: "ex3",
//   reprints: [ogDaisyDuckMusketeerSpy.id],
//   number: 11,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649960,
//   },
// };
//
