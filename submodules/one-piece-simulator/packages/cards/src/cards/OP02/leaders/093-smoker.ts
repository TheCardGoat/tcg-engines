import type { LeaderCard } from "@tcg/op-types";
import { op02Smoker093I18n } from "./093-smoker.i18n.ts";

export const op02Smoker093: LeaderCard = {
  id: "OP02-093",
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP02",
  power: 5000,
  life: 5,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-093_p1.jpg",
      imageId: "OP02-093_p1",
    },
  ],
  effect:
    "[DON!! x1] [Activate:Main] [Once Per Turn] Give up to 1o of your opponent's Characters -1 cost during this turn. Then, if there is a Character with a cost of 0, this Leader gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
            value: -1,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op02Smoker093I18n,
};
