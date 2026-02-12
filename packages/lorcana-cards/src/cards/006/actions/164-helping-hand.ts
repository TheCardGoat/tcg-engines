import type { ActionCard } from "@tcg/lorcana-types";

export const helpingHand: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1wv-1",
      text: "Chosen character gains Support this turn. Draw a card.",
      type: "action",
    },
  ],
  cardNumber: 164,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "f86b89b67c0d769c407b76fcf395e4d3a14bbd31",
  },
  franchise: "Zootropolis",
  id: "1wv",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Helping Hand",
  set: "006",
  text: "Chosen character gains Support this turn. Draw a card. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
};
