import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const heSGotASword!: ActionCard = {
  id: "wmw",
  cardType: "action",
  name: "He's Got a Sword!",
  version: "",
  fullName: "He's Got a Sword!",
  inkType: [
    "ruby",
  ],
  franchise: "General",
  set: "001",
  text: "Chosen character gets +2 {S} this turn.",
  cost: 1,
  cardNumber: 132,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508782,
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
      id: "wmw-1",
      text: "",
    },
  ],
};
