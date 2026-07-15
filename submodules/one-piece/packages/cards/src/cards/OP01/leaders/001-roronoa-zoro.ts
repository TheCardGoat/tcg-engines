import type { LeaderCard } from "@tcg/op-types";
import { op01RoronoaZoro001I18n } from "./001-roronoa-zoro.i18n.ts";

export const op01RoronoaZoro001: LeaderCard = {
  id: "OP01-001",
  canonicalId: "OP01-001",
  slug: "roronoa-zoro/op01-001",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP01-001",
      artId: "OP01-001",
      setCode: "OP01",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-001.jpg",
    },
    {
      id: "OP01-001_p1",
      artId: "OP01-001_p1",
      setCode: "OP01",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-001_p1.jpg",
    },
  ],
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
