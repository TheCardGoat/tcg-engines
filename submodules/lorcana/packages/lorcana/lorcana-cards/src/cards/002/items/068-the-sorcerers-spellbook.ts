import type { ItemCard } from "@tcg/lorcana-types";
import { theSorcerersSpellbookI18n } from "./068-the-sorcerers-spellbook.i18n";

export const theSorcerersSpellbook: ItemCard = {
  id: "ES1",
  canonicalId: "ci_ES1",
  reprints: ["set2-068"],
  cardType: "item",
  name: "The Sorcerer's Spellbook",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "002",
  cardNumber: 68,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_c48a5579b74d4299b4bc48db0776cd36",
    tcgPlayer: 516340,
  },
  text: [
    {
      title: "KNOWLEDGE",
      description: "{E}, 1 {I} — Gain 1 lore.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      id: "1pk-1",
      name: "KNOWLEDGE",
      text: "KNOWLEDGE {E}, 1 {I} — Gain 1 lore.",
      type: "activated",
    },
  ],
  i18n: theSorcerersSpellbookI18n,
};
