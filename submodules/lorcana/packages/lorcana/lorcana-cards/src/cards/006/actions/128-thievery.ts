import type { ActionCard } from "@tcg/lorcana-types";
import { thieveryI18n } from "./128-thievery.i18n";

export const thievery: ActionCard = {
  id: "C0T",
  canonicalId: "ci_C0T",
  reprints: ["set6-128"],
  cardType: "action",
  name: "Thievery",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 128,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_abdee4f2746b40b48c29ea5f3da815b2",
    tcgPlayer: 588086,
  },
  text: "Chosen opponent loses 1 lore. Gain 1 lore.",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "OPPONENT",
            type: "lose-lore",
          },
          {
            amount: 1,
            type: "gain-lore",
          },
        ],
        type: "sequence",
      },
      id: "f60-1",
      text: "Chosen opponent loses 1 lore. Gain 1 lore.",
      type: "action",
    },
  ],
  i18n: thieveryI18n,
};
