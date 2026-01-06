import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const fireTheCannons!: ActionCard = {
  id: "lhl",
  cardType: "action",
  name: "Fire the Cannons!",
  version: "",
  fullName: "Fire the Cannons!",
  inkType: [
    "steel",
  ],
  franchise: "General",
  set: "001",
  text: "Deal 2 damage to chosen character.",
  cost: 1,
  cardNumber: 197,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 493483,
  },
  abilities: [
    {
      type: "action",
      effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      id: "lhl-1",
      text: "Deal 2 damage to chosen character.",
    },
  ],
};
