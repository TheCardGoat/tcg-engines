import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckMultitalentedPirate: CharacterCard = {
  id: "1o7",
  cardType: "character",
  name: "Daisy Duck",
  version: "Multitalented Pirate",
  fullName: "Daisy Duck - Multitalented Pirate",
  inkType: ["emerald"],
  set: "007",
  text: "FOWL PLAY Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.",
  cost: 8,
  strength: 6,
  willpower: 5,
  lore: 3,
  cardNumber: 108,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d8f343ee238be3a7ebf0f0a9f5f2a7b707f21cdf",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const daisyDuckMultitalentedPirate: LorcanitoCharacterCard = {
//   id: "nac",
//   name: "Daisy Duck",
//   title: "Multitalented Pirate",
//   characteristics: ["dreamborn", "hero", "pirate", "captain"],
//   text: "FOWL PLAY Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "FOWL PLAY",
//       text: "Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.",
//       oncePerTurn: true,
//       responder: "opponent",
//       conditions: [duringYourTurn],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacterOfYours,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 8,
//   strength: 6,
//   willpower: 5,
//   illustrator: "Emily Abeydeera",
//   number: 108,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619465,
//   },
//   rarity: "rare",
//   lore: 3,
// };
//
