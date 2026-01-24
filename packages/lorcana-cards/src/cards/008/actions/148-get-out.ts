import type { ActionCard } from "@tcg/lorcana-types";

export const getOut: ActionCard = {
  id: "rmf",
  cardType: "action",
  name: "Get Out!",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "Banish chosen character, then return an item card from your discard to your hand.",
  cost: 6,
  cardNumber: 148,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "638e3c73565caf3c451d46b6c081d42b4e57fa84",
  },
  abilities: [
    {
      id: "rmf-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "return-from-discard",
            target: "CONTROLLER",
            cardType: "item",
          },
        ],
      },
      text: "Banish chosen character, then return an item card from your discard to your hand.",
    },
  ],
};
