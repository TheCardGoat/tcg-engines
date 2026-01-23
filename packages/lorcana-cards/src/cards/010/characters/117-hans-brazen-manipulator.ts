import type { CharacterCard } from "@tcg/lorcana-types";

export const hansBrazenManipulator: CharacterCard = {
  id: "bkr",
  cardType: "character",
  name: "Hans",
  version: "Brazen Manipulator",
  fullName: "Hans - Brazen Manipulator",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "010",
  text: "JOSTLING FOR POWER King and Queen characters can't quest.\nGROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  cardNumber: 117,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "29b94bb0bba4c19bd7f17b07feb835bdef4029ef",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// const jostlingForPower: StaticAbilityWithEffect = {
//   type: "static",
//   ability: "effects",
//   name: "JOSTLING FOR POWER",
//   text: "King and Queen characters can't quest.",
//   effects: [
//     {
//       type: "restriction",
//       restriction: "quest",
//       duration: "static",
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           {
//             filter: "characteristics",
//             conjunction: "or",
//             value: ["king", "queen"],
//           },
//         ],
//       },
//     },
//   ],
// };
//
// const growingInfluence = atTheStartOfYourTurn({
//   name: "GROWING INFLUENCE",
//   text: "At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
//   resolutionConditions: [
//     {
//       type: "filter",
//       comparison: { operator: "gte", value: 2 },
//       filters: [
//         { filter: "type", value: "character" },
//         { filter: "zone", value: "play" },
//         { filter: "owner", value: "opponent" },
//         { filter: "status", value: "ready" },
//       ],
//     },
//   ],
//   effects: [youGainLore(2)],
// });
//
// export const hansBrazenManipulator: LorcanitoCharacterCard = {
//   id: "pen",
//   name: "Hans",
//   title: "Brazen Manipulator",
//   characteristics: ["storyborn", "villain", "prince"],
//   text: "JOSTLING FOR POWER King and Queen characters can't quest.\nGROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 6,
//   willpower: 4,
//   illustrator: "Josh Black / Alejandro Hernandez",
//   number: 117,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659620,
//   },
//   rarity: "super_rare",
//   abilities: [jostlingForPower, growingInfluence],
//   lore: 2,
// };
//
