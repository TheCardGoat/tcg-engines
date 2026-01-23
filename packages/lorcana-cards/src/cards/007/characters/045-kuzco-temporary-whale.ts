import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemporaryWhale: CharacterCard = {
  id: "122",
  cardType: "character",
  name: "Kuzco",
  version: "Temporary Whale",
  fullName: "Kuzco - Temporary Whale",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 45,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a16f3c83a53236d523529bacad2e9c79e60b668",
  },
  abilities: [],
  classifications: ["Storyborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { targetOwnerDrawsXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kuzcoTemporaryWhale: LorcanitoCharacterCard = {
//   id: "wof",
//   name: "Kuzco",
//   title: "Temporary Whale",
//   characteristics: ["storyborn", "king"],
//   text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "DON'T YOU SAY A WORD",
//       text: "Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
//       optional: true,
//       oncePerTurn: true,
//       conditions: [duringYourTurn],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "play" },
//               {
//                 filter: "type",
//                 value: ["character", "item", "location"],
//               },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: {
//                   operator: "lte",
//                   value: 2,
//                 },
//               },
//             ],
//           },
//         },
//         targetOwnerDrawsXCards(1),
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 1,
//   willpower: 4,
//   illustrator: "Luca Pinnelli",
//   number: 45,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618694,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
