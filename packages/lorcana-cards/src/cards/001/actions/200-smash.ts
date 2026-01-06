import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const smash: ActionCard = {
  id: "ub4",
  cardType: "action",
  name: "Smash",
  version: "",
  fullName: "Smash",
  inkType: [
    "steel",
  ],
  franchise: "General",
  set: "001",
  text: "Deal 3 damage to chosen character.",
  cost: 3,
  cardNumber: 200,
  inkable: true,
  rarity: "uncommon",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508943,
  },
  abilities: [
    {
      type: "action",
      effect: {
          type: "deal-damage",
          amount: 3,
          target: "CHOSEN_CHARACTER",
        },
      id: "ub4-1",
      text: "Deal 3 damage to chosen character.",
    },
  ],
};
