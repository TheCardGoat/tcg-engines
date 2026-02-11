import type { CharacterCard } from "@tcg/lorcana-types";

export const genieWonderfulTrickster: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1yx-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "1yx-2",
      name: "YOUR REWARD AWAITS",
      text: "YOUR REWARD AWAITS Whenever you play a card, draw a card.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "card",
        },
      },
      type: "triggered",
    },
    {
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
      id: "1yx-3",
      text: "FORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  cardNumber: 61,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 7,
  externalIds: {
    ravensburger: "ff98a7d79dbd9e9dd50780105dea42edda741876",
  },
  franchise: "Aladdin",
  fullName: "Genie - Wonderful Trickster",
  id: "1yx",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Genie",
  set: "006",
  strength: 4,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Genie.)\nYOUR REWARD AWAITS Whenever you play a card, draw a card.\nFORBIDDEN TREASURE At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
  version: "Wonderful Trickster",
  willpower: 7,
};
