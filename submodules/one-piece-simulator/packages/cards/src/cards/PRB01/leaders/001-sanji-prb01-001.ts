import type { LeaderCard } from "@tcg/op-types";
import { prb01SanjiPrb01001001I18n } from "./001-sanji-prb01-001.i18n.ts";

export const prb01SanjiPrb01001001: LeaderCard = {
  id: "PRB01-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "PRB01",
  power: 5000,
  life: 5,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB01-001_p1.jpg",
      imageId: "PRB01-001_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] Up to 1 of your Characters without an [On Play] effect and with a cost of 8 or less gains [Rush] during this turn.(This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "hasEffectType",
                  value: "onPlay",
                  negate: true,
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb01SanjiPrb01001001I18n,
};
