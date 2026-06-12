import type { LeaderCard } from "@tcg/op-types";
import { op03RobLucci076I18n } from "./076-rob-lucci.i18n.ts";

export const op03RobLucci076: LeaderCard = {
  id: "OP03-076",
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 5,
  traits: ["CP9"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-076_p1.jpg",
      imageId: "OP03-076_p1",
    },
  ],
  effect:
    "[Your Turn] [Once Per Turn] You may trash 2 cards from your hand: When your opponent's Character is K.O.'d, set this Leader as active.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op03RobLucci076I18n,
};
