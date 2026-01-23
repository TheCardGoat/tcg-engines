import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarDreadnought: CharacterCard = {
  id: "22g",
  cardType: "character",
  name: "Jafar",
  version: "Dreadnought",
  fullName: "Jafar - Dreadnought",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)\nNOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 183,
  inkable: true,
  externalIds: {
    ravensburger: "077493459c0e7e98dc94b63ce4fbe302e7b7ce6f",
  },
  abilities: [
    {
      id: "22g-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "22g-2",
      type: "triggered",
      name: "NOW WHERE WERE WE?",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "NOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   duringYourTurnWheneverBanishesCharacterInChallenge,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jafarDreadnought: LorcanitoCharacterCard = {
//   id: "cgs",
//
//   name: "Jafar",
//   title: "Dreadnought",
//   characteristics: ["floodborn", "sorcerer", "villain"],
//   text: "**Shift** 2 (_You may pay 2 {I} to play this on top of one of your characters named Jafar._)\n\n**NOW WHERE WERE WE?** During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "jafar"),
//     duringYourTurnWheneverBanishesCharacterInChallenge({
//       name: "Now Where Were We?",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Cam Kendell",
//   number: 183,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527180,
//   },
//   rarity: "uncommon",
// };
//
