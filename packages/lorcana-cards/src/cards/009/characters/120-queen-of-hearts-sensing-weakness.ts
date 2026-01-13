import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsSensingWeakness: CharacterCard = {
  id: "1je",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Sensing Weakness",
  fullName: "Queen of Hearts - Sensing Weakness",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Queen of Hearts.)\nLET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 120,
  inkable: true,
  externalIds: {
    ravensburger: "c7b064db265bded03b75f9a2b194df8a9567e845",
  },
  abilities: [
    {
      id: "1je-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2 {I}",
    },
    {
      id: "1je-2",
      type: "triggered",
      name: "LET THE GAME BEGIN",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
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
      text: "LET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { queenOfHeartsSensingWeakness as ogQueenOfHeartsSensingWeakness } from "@lorcanito/lorcana-engine/cards/002/characters/120-queen-of-hearts-sensing-weakness";
//
// export const queenOfHeartsSensingWeakness: LorcanitoCharacterCard = {
//   ...ogQueenOfHeartsSensingWeakness,
//   id: "a6w",
//   reprints: [ogQueenOfHeartsSensingWeakness.id],
//   number: 120,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647670,
//   },
// };
//
