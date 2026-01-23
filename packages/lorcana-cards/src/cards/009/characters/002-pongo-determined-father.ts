import type { CharacterCard } from "@tcg/lorcana-types";

export const pongoDeterminedFather: CharacterCard = {
  id: "1ve",
  cardType: "character",
  name: "Pongo",
  version: "Determined Father",
  fullName: "Pongo - Determined Father",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "009",
  text: "TWILIGHT BARK Once during your turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 2,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2e3f62dba601d0b7718e2d5a5a6d161f72cd084",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { pongoDeterminedFather as ogPongoDeterminedFather } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const pongoDeterminedFather: LorcanitoCharacterCard = {
//   ...ogPongoDeterminedFather,
//   id: "nn4",
//   reprints: [ogPongoDeterminedFather.id],
//   number: 2,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649951,
//   },
// };
//
