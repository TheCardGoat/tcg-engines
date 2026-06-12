import type { LeaderCard } from "@tcg/op-types";
import { op08Kalgara098I18n } from "./098-kalgara.i18n.ts";

export const op08Kalgara098: LeaderCard = {
  id: "OP08-098",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "OP08",
  power: 5000,
  life: 5,
  traits: ["Sky Island Shandian Warrior Jaya"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-098_p1.jpg",
      imageId: "OP08-098_p1",
    },
  ],
  effect:
    "[DON!! x1] [When Attacking] Play up to 1 {Shandian Warrior} type Character card from your hand with a cost equal to or less than the number of DON!! cards on your field. If you do, add 1 card from the top of your Life cards to your hand.",
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
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "trait",
                value: "Shandian Warrior",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op08Kalgara098I18n,
};
