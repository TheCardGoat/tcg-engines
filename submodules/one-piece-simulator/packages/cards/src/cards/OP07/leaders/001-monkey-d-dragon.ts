import type { LeaderCard } from "@tcg/op-types";
import { op07MonkeyDDragon001I18n } from "./001-monkey-d-dragon.i18n.ts";

export const op07MonkeyDDragon001: LeaderCard = {
  id: "OP07-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP07",
  power: 5000,
  life: 5,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-001_p1.jpg",
      imageId: "OP07-001_p1",
    },
  ],
  effect:
    "[Activate:Main][Once Per Turn]Give up to 2 total of your currently given DON!! cards to 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "redistributeDon",
            count: {
              amount: 2,
              upTo: true,
            },
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07MonkeyDDragon001I18n,
};
