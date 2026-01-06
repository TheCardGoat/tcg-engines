import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const ifItSNotBaroque: ActionCard = {
  id: "m65",
  cardType: "action",
  name: "If It's Not Baroque",
  version: "",
  fullName: "If It's Not Baroque",
  inkType: ["sapphire"],
  franchise: "General",
  set: "001",
  text: "Return an item card from your discard to your hand.",
  cost: 3,
  cardNumber: 162,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 505980,
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER",
      },
      id: "m65-1",
      text: "",
    },
  ],
};
