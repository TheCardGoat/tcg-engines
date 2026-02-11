import type { ActionCard } from "@tcg/lorcana-types";

export const beyondTheHorizon: ActionCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 3,
        target: "CONTROLLER",
      },
      id: "1cf-1",
      text: "Sing Together 7 Choose any number of players. They discard their hands and draw 3 cards each.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 202,
  cardType: "action",
  cost: 7,
  externalIds: {
    ravensburger: "ad132a4c53b4856d48b36de8985d765bed38f07f",
  },
  franchise: "Lilo and Stitch",
  id: "1cf",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Beyond the Horizon",
  set: "008",
  text: "Sing Together 7 Choose any number of players. They discard their hands and draw 3 cards each.",
};
