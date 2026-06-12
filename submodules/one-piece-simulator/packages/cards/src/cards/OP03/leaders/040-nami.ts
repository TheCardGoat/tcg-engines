import type { LeaderCard } from "@tcg/op-types";
import { op03Nami040I18n } from "./040-nami.i18n.ts";

export const op03Nami040: LeaderCard = {
  id: "OP03-040",
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 5,
  traits: ["East Blue"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-040_p1.jpg",
      imageId: "OP03-040_p1",
    },
  ],
  effect:
    "When your deck is reduced to 0, you win the game instead of losing, according to the rules. [DON!! x1] When this Leader's attack deals damage to your opponent's Life, you may trash 1 card from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenDealsDamage",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op03Nami040I18n,
};
