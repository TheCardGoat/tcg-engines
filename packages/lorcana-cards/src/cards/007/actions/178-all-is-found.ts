import type { ActionCard } from "@tcg/lorcana-types";

export const allIsFound: ActionCard = {
  id: "138",
  cardType: "action",
  name: "All Is Found",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 178,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e20c469e5bfb01717b1a29a7ed5e2e22d5d0694",
  },
  abilities: [
    {
      id: "138-1",
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "discard",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
    },
  ],
};
