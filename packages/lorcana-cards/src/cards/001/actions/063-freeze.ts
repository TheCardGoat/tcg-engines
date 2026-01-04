import type { ActionCard } from "@tcg/lorcana-types";

export const freeze: ActionCard = {
  id: "1cq",
  cardType: "action",
  name: "Freeze",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  text: "Exert chosen opposing character.",
  cost: 2,
  cardNumber: 63,
  inkable: false,
  externalIds: {
    ravensburger: "adcdee7c29e76d6c7249456e6ff99ae44efe9e6e",
  },
  abilities: [
    {
      id: "1cq-1",
      text: "Exert chosen opposing character.",
      type: "action",
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
};
