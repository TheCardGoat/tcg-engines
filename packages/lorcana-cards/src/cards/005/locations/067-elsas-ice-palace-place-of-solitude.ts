import type { LocationCard } from "@tcg/lorcana-types";

export const elsasIcePalacePlaceOfSolitude: LocationCard = {
  id: "1h5",
  cardType: "location",
  name: "Elsa's Ice Palace",
  version: "Place of Solitude",
  fullName: "Elsa's Ice Palace - Place of Solitude",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "ETERNAL WINTER When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 67,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bf43fd7fefe1c9af6f81222844d80806e88a2f61",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { chosenExertedCharacterCantReadyWhileThisIsInPlace } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const elsasIcePalacePlaceOfSolitude: LorcanitoLocationCard = {
//   id: "f0m",
//   missingTestCase: true,
//   name: "Elsa's Ice Palace",
//   title: "Place of Solitude",
//   characteristics: ["location"],
//   text: "**ETERNAL WINTER** When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
//   type: "location",
//   colors: ["amethyst"],
//   cost: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Wietse Treurniet",
//   number: 67,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560547,
//   },
//   rarity: "rare",
//   moveCost: 1,
//   abilities: [
//     {
//       ...chosenExertedCharacterCantReadyWhileThisIsInPlace,
//       name: "Eternal Winter",
//       text: "When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.",
//     },
//   ],
// };
//
