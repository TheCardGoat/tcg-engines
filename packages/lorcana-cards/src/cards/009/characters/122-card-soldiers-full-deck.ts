import type { CharacterCard } from "@tcg/lorcana-types";

export const cardSoldiersFullDeck: CharacterCard = {
  id: "k8i",
  cardType: "character",
  name: "Card Soldiers",
  version: "Full Deck",
  fullName: "Card Soldiers - Full Deck",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "009",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 122,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "48ef37fb7cf16d1c0dfc87d604744a7cb6c7a66d",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { cardSoldiersFullDeck as cardSoldiersFullDeckAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/105-card-soldiers-full-deck";
//
// export const cardSoldiersFullDeck: LorcanitoCharacterCard = {
//   ...cardSoldiersFullDeckAsOrig,
//   id: "yi4",
//   reprints: [cardSoldiersFullDeckAsOrig.id],
//   number: 122,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650057,
//   },
// };
//
