import type { LeaderCard } from "@tcg/op-types";
import { op14eb04DraculeMihawkOp14020020I18n } from "./020-dracule-mihawk-op14-020.i18n.ts";

export const op14eb04DraculeMihawkOp14020020: LeaderCard = {
  id: "OP14-020",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP14EB04",
  power: 5000,
  life: 5,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-020_p1_jDSsWWh.jpg",
      imageId: "OP14-020_p1",
    },
  ],
  effect:
    'If your opponent\'s Leader has the "Slash" attribute, this leader gains +1000 power.\n[Activate:Main] [Once Per Turn] You may rest 1 of your cards: If there is a Character with a cost of 5 or more, set up to 3 of your DON!! cards as active. Then, you cannot play character cards during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 5,
              },
            ],
          },
        ],
        costs: [
          {
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 3,
                upTo: true,
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04DraculeMihawkOp14020020I18n,
};
