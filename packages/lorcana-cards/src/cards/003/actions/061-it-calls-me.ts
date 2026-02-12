import type { ActionCard } from "@tcg/lorcana-types";

export const itCallsMe: ActionCard = {
  abilities: [
    {
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
      id: "1sd-1",
      text: "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 61,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "e78fcfdbd854c2d512d3769ebb8b9457a43ed90f",
  },
  franchise: "Moana",
  id: "1sd",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "It Calls Me",
  set: "003",
  text: "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.",
};
