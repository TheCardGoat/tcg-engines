import type { ActionCard } from "@tcg/lorcana-types";

export const itCallsMe: ActionCard = {
  id: "1sd",
  cardType: "action",
  name: "It Calls Me",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "003",
  text: "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.",
  actionSubtype: "song",
  cost: 1,
  cardNumber: 61,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e78fcfdbd854c2d512d3769ebb8b9457a43ed90f",
  },
  abilities: [
    {
      id: "1sd-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "shuffle-into-deck",
            target: "CHOSEN_CHARACTER",
            intoDeck: "owner",
          },
        ],
      },
      text: "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.",
    },
  ],
};
