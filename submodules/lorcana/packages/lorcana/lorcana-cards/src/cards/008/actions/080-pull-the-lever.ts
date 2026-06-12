import type { ActionCard } from "@tcg/lorcana-types";
import { pullTheLeverI18n } from "./080-pull-the-lever.i18n";

export const pullTheLever: ActionCard = {
  id: "e3L",
  canonicalId: "ci_e3L",
  reprints: ["set8-080"],
  cardType: "action",
  name: "Pull the Lever!",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 80,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_6cc548274208402aa28a8b1da0c983aa",
    tcgPlayer: 631402,
  },
  text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
  abilities: [
    {
      type: "action",
      text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
      effect: {
        type: "choice",
        optionLabels: ["Draw 2 cards.", "Each opponent chooses and discards a card."],
        options: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "EACH_OPPONENT",
          },
        ],
      },
    },
  ],
  i18n: pullTheLeverI18n,
};
