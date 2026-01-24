import type { ActionCard } from "@tcg/lorcana-types";

export const beyondTheHorizon: ActionCard = {
  id: "1cf",
  cardType: "action",
  name: "Beyond the Horizon",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "008",
  text: "Sing Together 7 Choose any number of players. They discard their hands and draw 3 cards each.",
  actionSubtype: "song",
  cost: 7,
  cardNumber: 202,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "ad132a4c53b4856d48b36de8985d765bed38f07f",
  },
  abilities: [
    {
      id: "1cf-1",
      type: "action",
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
      text: "Sing Together 7 Choose any number of players. They discard their hands and draw 3 cards each.",
    },
  ],
};
