import type { CharacterCard } from "@tcg/lorcana-types";

export const docBoldKnight: CharacterCard = {
  id: "1if",
  cardType: "character",
  name: "Doc",
  version: "Bold Knight",
  fullName: "Doc - Bold Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "DRASTIC MEASURES When you play this character, you may discard your hand to draw 2 cards.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 193,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c369b0ac1c323d086c86cc6526d0bf193bb7ad88",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoCharacterCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// import {
//   discardYourHand,
//   drawXCards,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// const drasticMeasures: ResolutionAbility = {
//   type: "resolution",
//   name: "Drastic Measures",
//   text: "When you play this character, you may discard your hand to draw 2 cards.",
//   optional: true,
//   effects: [discardYourHand, drawXCards(2)],
// };
//
// export const docBoldKnight: LorcanitoCharacterCard = {
//   id: "bsn",
//   name: "Doc",
//   title: "Bold Knight",
//   characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
//   text: "**DRASTIC MEASURES** When you play this character, you may discard your hand to draw 2 cards.",
//   type: "character",
//   abilities: [drasticMeasures],
//   colors: ["steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Mariana Moreno",
//   number: 193,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559668,
//   },
//   rarity: "rare",
// };
//
