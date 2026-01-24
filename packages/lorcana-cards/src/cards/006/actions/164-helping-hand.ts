import type { ActionCard } from "@tcg/lorcana-types";

export const helpingHand: ActionCard = {
  id: "1wv",
  cardType: "action",
  name: "Helping Hand",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  text: "Chosen character gains Support this turn. Draw a card. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  cardNumber: 164,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f86b89b67c0d769c407b76fcf395e4d3a14bbd31",
  },
  abilities: [
    {
      id: "1wv-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Support",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            duration: "this-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
      text: "Chosen character gains Support this turn. Draw a card.",
    },
  ],
};
