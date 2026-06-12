import type { LeaderCard } from "@tcg/op-types";
import { op01King091I18n } from "./091-king.i18n.ts";

export const op01King091: LeaderCard = {
  id: "OP01-091",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 5,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-091_p1.jpg",
      imageId: "OP01-091_p1",
    },
  ],
  effect:
    "[Your Turn] If you have 10 DON!! cards on your field, give all of your opponent's Characters -1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "eq",
            value: 10,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op01King091I18n,
};
