import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxGiantRobot: CharacterCard = {
  id: "1c2",
  cardType: "character",
  name: "Baymax",
  version: "Giant Robot",
  fullName: "Baymax - Giant Robot",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)\nFUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 104,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ad862baa5875379e40b08691465e23adf5ba70d0",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Robot"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const baymaxGiantRobot: LorcanitoCharacterCard = {
//   id: "yc9",
//   name: "Baymax",
//   title: "Giant Robot",
//   characteristics: ["floodborn", "hero", "robot"],
//   text: "Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)\nFUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, []),
//     whenYouPlayThis({
//       name: "FUNCTIONALITY IMPROVED",
//       text: "When you play this character, if you used Shift to play him, remove all damage from him.",
//       conditions: [{ type: "resolution", value: "shift" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 99,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//
//   colors: ["emerald", "sapphire"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Valerio Buonfantino",
//   number: 104,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619462,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
