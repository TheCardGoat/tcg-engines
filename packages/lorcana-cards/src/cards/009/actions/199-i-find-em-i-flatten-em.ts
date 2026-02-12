import type { ActionCard } from "@tcg/lorcana-types";

export const iFindEmIFlattenEm: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
        type: "banish",
      },
      id: "1xm-1",
      text: "Banish all items.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 199,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "fb56f29241ca17496d5e5417bca9cff146007bf3",
  },
  franchise: "Encanto",
  id: "1xm",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "I Find ’Em, I Flatten ’Em",
  set: "009",
  text: "Banish all items.",
};
