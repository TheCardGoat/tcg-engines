import type { ItemCard } from "@tcg/lorcana-types";

export const theSorcerersSpellbook: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1pk-1",
      text: "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.",
      type: "activated",
    },
  ],
  cardNumber: 68,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "dc6543d1125aab8c86e10f0d622bc9608042ca5c",
  },
  franchise: "Fantasia",
  id: "1pk",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "The Sorcerer's Spellbook",
  set: "002",
  text: "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.",
};
