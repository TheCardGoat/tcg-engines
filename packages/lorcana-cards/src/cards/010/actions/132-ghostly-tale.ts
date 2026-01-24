import type { ActionCard } from "@tcg/lorcana-types";

export const ghostlyTale: ActionCard = {
  id: "z6e",
  cardType: "action",
  name: "Ghostly Tale",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Exert all opposing characters with 2 {S} or less.",
  cost: 4,
  cardNumber: 132,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ec895bb3d6454e9f1b323a886dc65c897b5a77f",
  },
  abilities: [
    {
      id: "z6e-1",
      type: "action",
      effect: {
        type: "exert",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Exert all opposing characters with 2 {S} or less.",
    },
  ],
};
