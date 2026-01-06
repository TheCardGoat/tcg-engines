import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const freeze: ActionCard = {
  id: "e7s",
  cardType: "action",
  name: "Freeze",
  version: "",
  fullName: "Freeze",
  inkType: ["amethyst"],
  franchise: "General",
  set: "001",
  text: "Exert chosen opposing character.",
  cost: 2,
  cardNumber: 63,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508733,
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "exert",
        target: "CHOSEN_CHARACTER",
      },
      id: "e7s-1",
      text: "Exert chosen opposing character.",
    },
  ],
};
