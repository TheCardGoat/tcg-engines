import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenCommandingPresence: CharacterCard = {
  id: "5hw",
  cardType: "character",
  name: "The Queen",
  version: "Commanding Presence",
  fullName: "The Queen - Commanding Presence",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named The Queen.)\nWHO IS THE FAIREST? Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 26,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "13cfc5ee51d21b9da1620a64f0c80751cd3ffc82",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const theQueenCommandingPresence: LorcanitoCharacterCard = {
//   id: "lwh",
//   name: "The Queen",
//   title: "Commanding Presence",
//   characteristics: ["floodborn", "queen", "villain"],
//   text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named The Queen.)_<br>\n**WHO IS THE FAIREST?** Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "the queen"),
//     wheneverQuests({
//       name: "WHO IS THE FAIREST?",
//       text: "Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 4,
//           modifier: "add",
//           target: chosenCharacter,
//         },
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 4,
//           modifier: "subtract",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 4,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Matthew Robert Davies / LadyShalirin",
//   number: 26,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516386,
//   },
//   rarity: "super_rare",
// };
//
