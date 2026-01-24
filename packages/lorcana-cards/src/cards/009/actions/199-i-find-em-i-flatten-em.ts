import type { ActionCard } from "@tcg/lorcana-types";

export const iFindEmIFlattenEm: ActionCard = {
  id: "1xm",
  cardType: "action",
  name: "I Find ’Em, I Flatten ’Em",
  inkType: ["steel"],
  franchise: "Encanto",
  set: "009",
  text: "Banish all items.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 199,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fb56f29241ca17496d5e5417bca9cff146007bf3",
  },
  abilities: [
    {
      id: "1xm-1",
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      text: "Banish all items.",
    },
  ],
};
