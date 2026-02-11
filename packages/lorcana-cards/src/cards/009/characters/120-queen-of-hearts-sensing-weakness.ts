import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsSensingWeakness: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "1je-1",
      keyword: "Shift",
      text: "Shift 2 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "1je-2",
      name: "LET THE GAME BEGIN",
      text: "LET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 120,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen"],
  cost: 5,
  externalIds: {
    ravensburger: "c7b064db265bded03b75f9a2b194df8a9567e845",
  },
  franchise: "Alice in Wonderland",
  fullName: "Queen of Hearts - Sensing Weakness",
  id: "1je",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Queen of Hearts",
  set: "009",
  strength: 4,
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Queen of Hearts.)\nLET THE GAME BEGIN Whenever one of your characters challenges another character, you may draw a card.",
  version: "Sensing Weakness",
  willpower: 3,
};
