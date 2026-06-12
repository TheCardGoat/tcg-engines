import type { LeaderCard } from "@tcg/op-types";
import { op03CharlotteKatakuri099I18n } from "./099-charlotte-katakuri.i18n.ts";

export const op03CharlotteKatakuri099: LeaderCard = {
  id: "OP03-099",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 5,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-099_p1.jpg",
      imageId: "OP03-099_p1",
    },
  ],
  effect:
    "[DON!! x1] [When Attacking] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, this Leader gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op03CharlotteKatakuri099I18n,
};
