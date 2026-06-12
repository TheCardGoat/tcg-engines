import type { LeaderCard } from "@tcg/op-types";
import { op05Sabo001I18n } from "./001-sabo.i18n.ts";

export const op05Sabo001: LeaderCard = {
  id: "OP05-001",
  cardType: "leader",
  color: ["red", "black"],
  rarity: "L",
  setId: "OP05",
  power: 5000,
  life: 4,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-001_p1.jpg",
      imageId: "OP05-001_p1",
    },
  ],
  effect:
    "[DON!! x1][Opponent's Turn][Once Per Turn] If your Character with 5000 power or more would be K.O.'d, you may give that Character -1000 power during this turn instead of that Character being K.O.'d.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
          },
          value: -1000,
          duration: "thisTurn",
        },
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Sabo001I18n,
};
