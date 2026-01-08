import type { CharacterCard } from "@tcg/lorcana-types";

export const dawsonPuzzlingSleuth: CharacterCard = {
  id: "1t5",
  cardType: "character",
  name: "Dawson",
  version: "Puzzling Sleuth",
  fullName: "Dawson - Puzzling Sleuth",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 161,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "eadc583df968a52341c644cac11cd8aecd7804e2",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const dawsonPuzzlingSleuth: LorcanitoCharacterCard = {
//   id: "l0i",
//   name: "Dawson",
//   title: "Puzzling Sleuth",
//   characteristics: ["storyborn", "ally", "detective"],
//   text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "BE SENSIBLE",
//       text: "Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
//       oncePerTurn: true,
//       conditions: [duringYourTurn],
//       effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
//     }),
//   ],
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Mario Oscar Gabriele",
//   number: 161,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619499,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
