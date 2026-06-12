import type { LeaderCard } from "@tcg/op-types";
import { op01TrafalgarLaw002I18n } from "./002-trafalgar-law.i18n.ts";

export const op01TrafalgarLaw002: LeaderCard = {
  id: "OP01-002",
  cardType: "leader",
  color: ["green", "red"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 4,
  traits: ["Heart Pirates Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-002_p1.jpg",
      imageId: "OP01-002_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] (2) (You may rest the specified number of DON!! cards in your cost area.): If you have 5 Characters, return 1 of your Characters to your hand. Then, play up to 1 Character with a cost of 5 or less from your hand that is a different color than the returned Character.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "eq",
            value: 5,
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "returnToHand",
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
  i18n: op01TrafalgarLaw002I18n,
};
