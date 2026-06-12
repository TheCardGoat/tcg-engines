import type { ItemCard } from "@tcg/lorcana-types";
import { weightSetI18n } from "./204-weight-set.i18n";

export const weightSet: ItemCard = {
  id: "X1T",
  canonicalId: "ci_X1T",
  reprints: ["set2-204"],
  cardType: "item",
  name: "Weight Set",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  cardNumber: 204,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_c3f4b42a04de464a8f93814fd4e1884b",
    tcgPlayer: 527529,
  },
  text: [
    {
      title: "TRAINING",
      description:
        "Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        },
        type: "optional",
      },
      id: "X1T-1",
      name: "TRAINING",
      text: "TRAINING Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          filters: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 4,
            },
          ],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: weightSetI18n,
};
