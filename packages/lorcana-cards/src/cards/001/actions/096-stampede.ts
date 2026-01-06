import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const stampede: ActionCard = {
  id: "eje",
  cardType: "action",
  name: "Stampede",
  version: "",
  fullName: "Stampede",
  inkType: ["emerald"],
  franchise: "General",
  set: "001",
  text: "Deal 2 damage to chosen damaged character.",
  cost: 1,
  cardNumber: 96,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 505953,
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
      id: "eje-1",
      text: "Deal 2 damage to chosen damaged character.",
    },
  ],
};
