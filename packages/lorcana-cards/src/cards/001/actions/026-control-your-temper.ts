import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const controlYourTemper!: ActionCard = {
  id: "eny",
  cardType: "action",
  name: "Control Your Temper!",
  version: "",
  fullName: "Control Your Temper!",
  inkType: [
    "amber",
  ],
  franchise: "General",
  set: "001",
  text: "Chosen character gets -2 {S} this turn.",
  cost: 1,
  cardNumber: 26,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 493501,
  },
  abilities: [
    {
      type: "action",
      effect: {
          type: "modify-stat",
          stat: undefined,
          modifier: 2,
          target: "CHOSEN_CHARACTER",
        },
      id: "eny-1",
      text: "",
    },
  ],
};
