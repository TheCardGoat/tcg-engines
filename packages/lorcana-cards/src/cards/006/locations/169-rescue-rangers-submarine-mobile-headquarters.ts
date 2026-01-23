import type { LocationCard } from "@tcg/lorcana-types";

export const rescueRangersSubmarineMobileHeadquarters: LocationCard = {
  id: "671",
  cardType: "location",
  name: "Rescue Rangers Submarine",
  version: "Mobile Headquarters",
  fullName: "Rescue Rangers Submarine - Mobile Headquarters",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 169,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1654a41cbf0a5d8cffe06c1736a1ad9ce4668c19",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rescueRangersSubmarineMobileHeadquarters: LorcanitoLocationCard = {
//   id: "hwj",
//   name: "Rescue Rangers Submarine",
//   title: "Mobile Headquarters",
//   characteristics: ["location"],
//   text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "location",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Planning Session",
//       text: "At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       conditions: [
//         {
//           type: "chars-at-location",
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   moveCost: 1,
//   willpower: 8,
//   illustrator: "Geoffrey Boudout",
//   number: 169,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 586641,
//   },
//   rarity: "rare",
// };
//
