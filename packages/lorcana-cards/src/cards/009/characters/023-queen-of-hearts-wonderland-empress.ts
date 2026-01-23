import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsWonderlandEmpress: CharacterCard = {
  id: "1gh",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Wonderland Empress",
  fullName: "Queen of Hearts - Wonderland Empress",
  inkType: ["amber"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "ALL WAYS HERE ARE MY WAYS Whenever this character quests, your other Villain characters get +1 {L} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd2e003703e8ab3b1f1f403fc5b4ed14d7335aa1",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { queenOfHeartsWonderlandEmpress as ogQueenOfHeartsWonderlandEmpress } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const queenOfHeartsWonderlandEmpress: LorcanitoCharacterCard = {
//   ...ogQueenOfHeartsWonderlandEmpress,
//   id: "ifp",
//   reprints: [ogQueenOfHeartsWonderlandEmpress.id],
//   number: 23,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649971,
//   },
// };
//
