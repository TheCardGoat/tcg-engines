import type { ActionCard } from "@tcg/lorcana-types";

export const outOfOrder: ActionCard = {
  id: "155",
  cardType: "action",
  name: "Out of Order",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "Banish chosen character.",
  cost: 7,
  cardNumber: 148,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "940eb941273724b043f6118b17a05f669488de72",
  },
  abilities: [
    {
      id: "155-1",
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Banish chosen character.",
    },
  ],
};
