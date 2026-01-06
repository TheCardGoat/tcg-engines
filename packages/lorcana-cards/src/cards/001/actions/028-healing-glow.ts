import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const healingGlow: ActionCard = {
  id: "ta0",
  cardType: "action",
  name: "Healing Glow",
  version: "",
  fullName: "Healing Glow",
  inkType: [
    "amber",
  ],
  franchise: "General",
  set: "001",
  text: "Remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 28,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 492713,
  },
  abilities: [
    {
      type: "action",
      effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: "CHOSEN_CHARACTER",
        },
      id: "ta0-1",
      text: "Remove up to 2 damage from chosen character.",
    },
  ],
};
