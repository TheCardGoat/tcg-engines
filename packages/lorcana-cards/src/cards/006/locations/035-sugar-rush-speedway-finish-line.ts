import type { LocationCard } from "@tcg/lorcana-types";

export const sugarRushSpeedwayFinishLine: LocationCard = {
  id: "cxj",
  cardType: "location",
  name: "Sugar Rush Speedway",
  version: "Finish Line",
  fullName: "Sugar Rush Speedway - Finish Line",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
  cost: 2,
  moveCost: 6,
  lore: 0,
  cardNumber: 35,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2e9b2654fee6bda12d63af97fba258e9e06d906c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import {
//   anyCardTargetYouOwn,
//   thisCard,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouMoveACharacterHere } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   drawXCards,
//   mayBanish,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sugarRushSpeedwayFinishLine: LorcanitoLocationCard = {
//   id: "f7t",
//   name: "Sugar Rush Speedway",
//   title: "Finish Line",
//   characteristics: ["location"],
//   text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
//   type: "location",
//   abilities: [
//     whenYouMoveACharacterHere({
//       name: "Bring It Home, Little One!",
//       text: "When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
//       optional: true,
//       movingFrom: anyCardTargetYouOwn.filters,
//       effects: [mayBanish(thisCard), youGainLore(3), drawXCards(3)],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 2,
//   willpower: 7,
//   moveCost: 6,
//   illustrator: "Roberto Gatto",
//   number: 35,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592002,
//   },
//   rarity: "super_rare",
// };
//
