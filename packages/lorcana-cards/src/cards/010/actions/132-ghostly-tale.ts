import type { ActionCard } from "@tcg/lorcana-types";

export const ghostlyTale: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "z6e-1",
      text: "Exert all opposing characters with 2 {S} or less.",
      type: "action",
    },
  ],
  cardNumber: 132,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "7ec895bb3d6454e9f1b323a886dc65c897b5a77f",
  },
  franchise: "Sleepy Hollow",
  id: "z6e",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Ghostly Tale",
  set: "010",
  text: "Exert all opposing characters with 2 {S} or less.",
};
