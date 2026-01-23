import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodUnrivaledArcher: CharacterCard = {
  id: "v3n",
  cardType: "character",
  name: "Robin Hood",
  version: "Unrivaled Archer",
  fullName: "Robin Hood - Unrivaled Archer",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "009",
  text: "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.\nGOOD SHOT During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 162,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "70178c995e77dc152c2c3be988201b087ac1a747",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { robinHoodUnrivaledArcher as robinHoodUnrivaledArcherAsOrig } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
//
// export const robinHoodUnrivaledArcher: LorcanitoCharacterCard = {
//   ...robinHoodUnrivaledArcherAsOrig,
//   id: "l10",
//   reprints: [robinHoodUnrivaledArcherAsOrig.id],
//   number: 162,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650096,
//   },
// };
//
