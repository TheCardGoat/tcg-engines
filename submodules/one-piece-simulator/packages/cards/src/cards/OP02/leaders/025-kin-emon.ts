import type { LeaderCard } from "@tcg/op-types";
import { op02KinEmon025I18n } from "./025-kin-emon.i18n.ts";

export const op02KinEmon025: LeaderCard = {
  id: "OP02-025",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP02",
  power: 5000,
  life: 5,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-025_p1.jpg",
      imageId: "OP02-025_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] If you have 1 or less Characters, the next time you play a [Land of Wano] type Character card with a cost of 3 or more from your hand during this turn, the cost will be reduced by 1.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "lte",
            value: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 3,
                },
              ],
            },
            value: -1,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op02KinEmon025I18n,
};
