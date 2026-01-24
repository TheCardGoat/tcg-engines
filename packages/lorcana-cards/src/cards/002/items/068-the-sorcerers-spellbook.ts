import type { ItemCard } from "@tcg/lorcana-types";

export const theSorcerersSpellbook: ItemCard = {
  id: "1pk",
  cardType: "item",
  name: "The Sorcerer's Spellbook",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "002",
  text: "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.",
  cost: 3,
  cardNumber: 68,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "dc6543d1125aab8c86e10f0d622bc9608042ca5c",
  },
  abilities: [
    {
      id: "1pk-1",
      type: "activated",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.",
    },
  ],
};
