import type { LeaderCard } from "@tcg/op-types";
import { op01Crocodile062I18n } from "./062-crocodile.i18n.ts";

export const op01Crocodile062: LeaderCard = {
  id: "OP01-062",
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 4,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-062_p1.jpg",
      imageId: "OP01-062_p1",
    },
  ],
  effect:
    "[DON!! x1] When you activate an Event, you may draw 1 card if you have 4 or less cards in your hand and haven't drawn a card using this Leader's effect during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenYouActivateEvent",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 4,
            },
          },
        ],
      },
    ],
  },
  i18n: op01Crocodile062I18n,
};
