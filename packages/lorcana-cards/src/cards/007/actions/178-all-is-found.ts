import type { ActionCard } from "@tcg/lorcana-types";

export const allIsFound: ActionCard = {
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "discard",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "138-1",
      text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 178,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "8e20c469e5bfb01717b1a29a7ed5e2e22d5d0694",
  },
  franchise: "Frozen",
  id: "138",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "All Is Found",
  set: "007",
  text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
};
