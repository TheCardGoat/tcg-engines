import type { ActionCard } from "@tcg/lorcana-types";

export const onlySoMuchRoom: ActionCard = {
  id: "12f",
  cardType: "action",
  name: "Only So Much Room",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
  cost: 4,
  cardNumber: 41,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "898aeafea2572b546272d33c7c03c94339016961",
  },
  abilities: [
    {
      id: "12f-1",
      type: "action",
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
      text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
    },
  ],
};
