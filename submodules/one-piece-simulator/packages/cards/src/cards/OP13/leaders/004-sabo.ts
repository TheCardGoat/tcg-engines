import type { LeaderCard } from "@tcg/op-types";
import { op13Sabo004I18n } from "./004-sabo.i18n.ts";

export const op13Sabo004: LeaderCard = {
  id: "OP13-004",
  cardType: "leader",
  color: ["red", "black"],
  rarity: "L",
  setId: "OP13",
  power: 5000,
  life: 5,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-004_p1_EdPEmQv.jpg",
      imageId: "OP13-004_p1",
    },
  ],
  effect:
    "If you have 4 or more Life cards, give this Leader 1000 power.\n[DON!! x1] If you have a Character with a cost of 8 or more, your Leader and all of your Characters gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
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
  i18n: op13Sabo004I18n,
};
