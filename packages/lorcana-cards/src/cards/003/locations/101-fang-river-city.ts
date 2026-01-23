import type { LocationCard } from "@tcg/lorcana-types";

export const fangRiverCity: LocationCard = {
  id: "1bl",
  cardType: "location",
  name: "Fang",
  version: "River City",
  fullName: "Fang - River City",
  inkType: ["emerald"],
  franchise: "Raya and the Last Dragon",
  set: "003",
  text: "SURROUNDED BY WATER Characters gain Ward and Evasive while here. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
  cost: 4,
  moveCost: 2,
  lore: 0,
  cardNumber: 101,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ab87ad77d9132e447d7025f86689d1abc0aa9f5d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   gainAbilityWhileHere,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const fangRiverCity: LorcanitoLocationCard = {
//   id: "pji",
//   type: "location",
//   name: "Fang",
//   title: "River City",
//   characteristics: ["location"],
//   text: "**SURROUNDED BY WATER** Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Surrounded by Water",
//       text: "Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
//       ability: wardAbility,
//     }),
//     gainAbilityWhileHere({
//       name: "Surrounded by Water",
//       text: "Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
//       ability: evasiveAbility,
//     }),
//   ],
//   flavour:
//     "A nation protected by fierce assassins and their even fiercer cats.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   willpower: 6,
//   lore: 2,
//   moveCost: 2,
//   illustrator: "Michael Guimont",
//   number: 101,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 533884,
//   },
//   rarity: "rare",
// };
//
