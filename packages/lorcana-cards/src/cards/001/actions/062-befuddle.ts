import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const befuddle: ActionCard = {
  id: "teb",
  cardType: "action",
  name: "Befuddle",
  version: "",
  fullName: "Befuddle",
  inkType: ["amethyst"],
  franchise: "General",
  set: "001",
  text: "Return a character or item with cost 2 or less to their player's hand.",
  cost: 1,
  cardNumber: 62,
  inkable: true,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 503355,
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER",
      },
      id: "teb-1",
      text: "Return a character or item with cost 2 or less to their player's hand.",
    },
  ],
};
