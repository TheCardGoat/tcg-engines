import type { CharacterCard } from "@tcg/op-types";
import { eb01Laboon048I18n } from "./048-laboon.i18n.ts";

export const eb01Laboon048: CharacterCard = {
  id: "EB01-048",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "EB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-048_p2.jpg",
      imageId: "EB01-048_p2",
    },
  ],
  effect:
    "[Activate:Main]You may rest this Character: Give up to 1 of your opponent's Characters -4 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01Laboon048I18n,
};
