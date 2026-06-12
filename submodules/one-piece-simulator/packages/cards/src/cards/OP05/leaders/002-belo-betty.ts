import type { LeaderCard } from "@tcg/op-types";
import { op05BeloBetty002I18n } from "./002-belo-betty.i18n.ts";

export const op05BeloBetty002: LeaderCard = {
  id: "OP05-002",
  cardType: "leader",
  color: ["red", "yellow"],
  rarity: "L",
  setId: "OP05",
  power: 5000,
  life: 4,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-002_p1.jpg",
      imageId: "OP05-002_p1",
    },
  ],
  effect:
    "[Activate:Main][Once Per Turn] You may trash 1 [Revolutionary Army] type card from your hand: Up to 3 of your [Revolutionary Army] type Characters or Characters with a [Trigger] gain +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Revolutionary Army",
                },
                {
                  filter: "hasTrigger",
                  value: true,
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05BeloBetty002I18n,
};
