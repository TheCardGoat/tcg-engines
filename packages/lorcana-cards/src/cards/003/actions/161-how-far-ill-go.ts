import type { ActionCard } from "@tcg/lorcana-types";

export const howFarIllGo: ActionCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1tk-1",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 161,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "eddcb5e8b24a67d1fe9ba072650341d9017300d3",
  },
  franchise: "Moana",
  id: "1tk",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "How Far I'll Go",
  set: "003",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
};
