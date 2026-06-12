import type { ActionCard } from "@tcg/lorcana-types";
import { healingTouchI18n } from "./026-healing-touch.i18n";

export const healingTouch: ActionCard = {
  id: "b5J",
  canonicalId: "ci_b5J",
  reprints: ["set5-026"],
  cardType: "action",
  name: "Healing Touch",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 26,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_10b23643a0b146bcb95389cfb37c6133",
    tcgPlayer: 561259,
  },
  text: "Remove up to 4 damage from chosen character. Draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: { type: "up-to", value: 4 },
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "remove-damage",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "9qq-1",
      text: "Remove up to 4 damage from chosen character. Draw a card.",
      type: "action",
    },
  ],
  i18n: healingTouchI18n,
};
