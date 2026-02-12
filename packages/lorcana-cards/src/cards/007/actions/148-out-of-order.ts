import type { ActionCard } from "@tcg/lorcana-types";

export const outOfOrder: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "155-1",
      text: "Banish chosen character.",
      type: "action",
    },
  ],
  cardNumber: 148,
  cardType: "action",
  cost: 7,
  externalIds: {
    ravensburger: "940eb941273724b043f6118b17a05f669488de72",
  },
  franchise: "Wreck It Ralph",
  id: "155",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Out of Order",
  set: "007",
  text: "Banish chosen character.",
};
