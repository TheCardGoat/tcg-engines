import type { ActionCard } from "@tcg/lorcana-types";

export const onlySoMuchRoom: ActionCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
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
            cardType: "character",
          },
        ],
      },
      id: "12f-1",
      text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 41,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "898aeafea2572b546272d33c7c03c94339016961",
  },
  franchise: "Lady and the Tramp",
  id: "12f",
  inkType: ["amber", "emerald"],
  inkable: true,
  missingTests: true,
  name: "Only So Much Room",
  set: "008",
  text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
};
