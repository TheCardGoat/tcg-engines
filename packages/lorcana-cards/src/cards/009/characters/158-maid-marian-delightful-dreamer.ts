import type { CharacterCard } from "@tcg/lorcana-types";

export const maidMarianDelightfulDreamer: CharacterCard = {
  id: "1p6",
  cardType: "character",
  name: "Maid Marian",
  version: "Delightful Dreamer",
  fullName: "Maid Marian - Delightful Dreamer",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "009",
  text: "HIGHBORN LADY When you play this character, chosen character gets -2 {S} this turn.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 158,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc73989b7f4878a33e227c586b83d6f59aeef98c",
  },
  abilities: [],
  classifications: ["Storyborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ladyMarianAdorableDreamer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
//
// export const maidMarianDelightfulDreamer: LorcanitoCharacterCard = {
//   ...ladyMarianAdorableDreamer,
//   id: "c8w",
//   reprints: [ladyMarianAdorableDreamer.id],
//   number: 158,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650093,
//   },
// };
//
