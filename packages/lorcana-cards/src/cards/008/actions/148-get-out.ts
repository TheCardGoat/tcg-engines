import type { ActionCard } from "@tcg/lorcana-types";

export const getOut: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "rmf-1",
      text: "Banish chosen character, then return an item card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 148,
  cardType: "action",
  cost: 6,
  externalIds: {
    ravensburger: "638e3c73565caf3c451d46b6c081d42b4e57fa84",
  },
  franchise: "Beauty and the Beast",
  id: "rmf",
  inkType: ["ruby", "sapphire"],
  inkable: false,
  missingTests: true,
  name: "Get Out!",
  set: "008",
  text: "Banish chosen character, then return an item card from your discard to your hand.",
};
