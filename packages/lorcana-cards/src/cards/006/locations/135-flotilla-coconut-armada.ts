import type { LocationCard } from "@tcg/lorcana-types";

export const flotillaCoconutArmada: LocationCard = {
  id: "1vh",
  cardType: "location",
  name: "Flotilla",
  version: "Coconut Armada",
  fullName: "Flotilla - Coconut Armada",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 135,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f40f46317aaadee496baadf72cdd1f7a5f6c411d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { ifYouHaveACharacterHere } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import {
//   opponentLoseLore,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const flotillaCoconutArmada: LorcanitoLocationCard = {
//   id: "twz",
//   missingTestCase: true,
//   name: "Flotilla",
//   title: "Coconut Armada",
//   characteristics: ["location"],
//   text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
//   type: "location",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Tiny Thieves",
//       text: "At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
//       conditions: [ifYouHaveACharacterHere],
//       effects: [youGainLore(1), opponentLoseLore(1)],
//     }),
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 2,
//   willpower: 6,
//   moveCost: 2,
//   illustrator: "Jiahui Eva Gao",
//   number: 135,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588367,
//   },
//   rarity: "rare",
// };
//
