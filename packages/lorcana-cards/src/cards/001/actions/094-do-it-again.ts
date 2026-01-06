import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const doItAgain!: ActionCard = {
  id: "yld",
  cardType: "action",
  name: "Do It Again!",
  version: "",
  fullName: "Do It Again!",
  inkType: [
    "emerald",
  ],
  franchise: "General",
  set: "001",
  text: "Return an action card from your discard to your hand.",
  cost: 3,
  cardNumber: 94,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 506830,
  },
  abilities: [
    {
      type: "action",
      effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
      id: "yld-1",
      text: "Return an action card from your discard to your hand.",
    },
  ],
};
