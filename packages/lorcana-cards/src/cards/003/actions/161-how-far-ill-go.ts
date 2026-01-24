import type { ActionCard } from "@tcg/lorcana-types";

export const howFarIllGo: ActionCard = {
  id: "1tk",
  cardType: "action",
  name: "How Far I'll Go",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 161,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "eddcb5e8b24a67d1fe9ba072650341d9017300d3",
  },
  abilities: [
    {
      id: "1tk-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 2,
            target: "CONTROLLER",
            destinations: [
              {
                zone: "deck-bottom",
                remainder: true,
                ordering: "player-choice",
              },
            ],
          },
          {
            type: "put-into-inkwell",
            source: "hand",
            target: "CONTROLLER",
            exerted: true,
            facedown: true,
          },
        ],
      },
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
    },
  ],
};
