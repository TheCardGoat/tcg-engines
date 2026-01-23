import type { ItemCard } from "@tcg/lorcana-types";

export const mapOfTreasurePlanet: ItemCard = {
  id: "7x0",
  cardType: "item",
  name: "Map of Treasure Planet",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "003",
  text: "KEY TO THE PORTAL {E} — You pay 1 {I} less for the next location you play this turn.\nSHOW THE WAY You pay 1 {I} less to move your characters to a location.",
  cost: 3,
  cardNumber: 201,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1c88a3b0ee2cffafb524bd6643be8a7150704beb",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { yourOtherCharactersGet } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { yourLocationCards } from "@lorcanito/lorcana-engine/abilities/targets";
// import { youPayXLessToPlayNextLocationThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mapOfTreasurePlanet: LorcanitoItemCard = {
//   id: "x73",
//   name: "Map of Treasure Planet",
//   characteristics: ["item"],
//   text: "**KEY TO THE PORTAL** {E} – You pay 1 {I} less for the next location you play this turn.\n\n\n**SHOW THE WAY** You pay 1 {I} less to move your characters to a location.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "exert" }],
//       name: "**KEY TO THE PORTAL**",
//       text: "{E} – You pay 1 {I} less for the next location you play this turn.",
//       effects: [youPayXLessToPlayNextLocationThisTurn(1)],
//     },
//     yourOtherCharactersGet({
//       name: "Show the Way",
//       text: "You pay 1 {I} less to move your characters to a location.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "moveCost",
//           amount: 1,
//           modifier: "subtract",
//           target: yourLocationCards,
//         },
//       ],
//     }),
//   ],
//   flavour: "Gentlemen, this must be kept under lock and key. \n−Captain Amelia",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Gabriel Angelo",
//   number: 201,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537395,
//   },
//   rarity: "rare",
// };
//
