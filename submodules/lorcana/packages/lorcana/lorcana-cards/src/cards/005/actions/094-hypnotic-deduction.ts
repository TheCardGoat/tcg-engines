import type { ActionCard } from "@tcg/lorcana-types";
import { hypnoticDeductionI18n } from "./094-hypnotic-deduction.i18n";

export const hypnoticDeduction: ActionCard = {
  id: "LLg",
  canonicalId: "ci_LLg",
  reprints: ["set5-094"],
  cardType: "action",
  name: "Hypnotic Deduction",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "005",
  cardNumber: 94,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b467180bb50b4da59a6b99725ad7fa84",
    tcgPlayer: 561346,
  },
  text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 3,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            type: "put-on-top",
            source: {
              selector: "chosen",
              count: {
                exactly: 2,
              },
              owner: "you",
              zones: ["hand"],
            },
          },
        ],
      },
      id: "5ug-1",
      text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
      type: "action",
    },
  ],
  i18n: hypnoticDeductionI18n,
};
