import type { ActionCard } from "@tcg/lorcana-types";
import { rememberWhoYouAreI18n } from "./097-remember-who-you-are.i18n";

export const rememberWhoYouAre: ActionCard = {
  id: "f6o",
  canonicalId: "ci_2KA",
  reprints: ["set5-097"],
  cardType: "action",
  name: "Remember Who You Are",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 97,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_d5e31be3b67a41c0a0f6ce871e8c69c4",
    tcgPlayer: 556975,
  },
  text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
  abilities: [
    {
      type: "action",
      text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
      effect: {
        type: "draw",
        target: "CONTROLLER",
        amount: {
          type: "difference",
          left: {
            type: "cards-in-hand",
            controller: "you",
          },
          right: {
            type: "cards-in-hand",
            controller: "opponent",
          },
          invert: true,
        },
      },
    },
  ],
  i18n: rememberWhoYouAreI18n,
};
