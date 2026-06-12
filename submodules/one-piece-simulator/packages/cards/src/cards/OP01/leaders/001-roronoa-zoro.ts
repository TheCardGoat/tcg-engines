import type { LeaderCard } from "@tcg/op-types";
import { op01RoronoaZoro001I18n } from "./001-roronoa-zoro.i18n.ts";

export const op01RoronoaZoro001: LeaderCard = {
  id: "OP01-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 5,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-001_p1.jpg",
      imageId: "OP01-001_p1",
    },
  ],
  effect: "[DON!! x1] [Your Turn] All of your Characters gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op01RoronoaZoro001I18n,
};
