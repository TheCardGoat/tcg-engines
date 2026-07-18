import type { LeaderCard } from "@tcg/op-types";
import { op08King057I18n } from "./057-king.i18n.ts";

export const op08King057: LeaderCard = {
  id: "OP08-057",
  canonicalId: "OP08-057",
  slug: "king/op08-057",
  name: "King",
  printings: [
    {
      id: "OP08-057",
      artId: "OP08-057",
      setCode: "OP08",
      collectorNumber: "057",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-057.jpg",
    },
    {
      id: "OP08-057_p1",
      artId: "OP08-057_p1",
      setCode: "OP08",
      collectorNumber: "057",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-057_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["purple", "black"],
  rarity: "L",
  setId: "OP08",
  power: 5000,
  life: 4,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-057_p1.jpg",
      imageId: "OP08-057_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Choose one: • If you have 5 or less cards in your hand, draw 1 card. • Give up to 1 of your opponent's Characters −2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "draw",
                  player: "self",
                  amount: 1,
                  condition: {
                    condition: "handCount",
                    player: "self",
                    comparison: "lte",
                    value: 5,
                  },
                },
              ],
              [
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
                  value: -2,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08King057I18n,
};
