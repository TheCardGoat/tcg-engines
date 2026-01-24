import type { CharacterCard } from "@tcg/lorcana-types";

export const genieWonderfulTrickster: CharacterCard = {
  id: "1yx",
  cardType: "character",
  name: "Genie",
  version: "Wonderful Trickster",
  fullName: "Genie - Wonderful Trickster",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)\nYOUR REWARD AWAITS Whenever you play a card, draw a card.\nFORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 61,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ff98a7d79dbd9e9dd50780105dea42edda741876",
  },
  abilities: [
    {
      id: "1yx-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "1yx-2",
      type: "triggered",
      name: "YOUR REWARD AWAITS",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "card",
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "YOUR REWARD AWAITS Whenever you play a card, draw a card.",
    },
    {
      id: "1yx-3",
      type: "action",
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["card"],
        },
      },
      text: "FORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
