import type { EventCard } from "@tcg/op-types";
import { op08IronBodyFangFlash095I18n } from "./095-iron-body-fang-flash.i18n.ts";

export const op08IronBodyFangFlash095: EventCard = {
  id: "OP08-095",
  canonicalId: "OP08-095",
  slug: "iron-body-fang-flash",
  name: "Iron Body Fang Flash",
  printings: [
    {
      id: "OP08-095",
      artId: "OP08-095",
      setCode: "OP08",
      collectorNumber: "095",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-095.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP08",
  cost: 2,
  traits: ["Animal Kingdom Pirates Former CP9"],
  effect:
    "[Main] If you have 10 or more cards in your trash, up to 1 of your Characters gains +2000 power until the end of your opponent's next turn. [Trigger] Up to 1 of your Leader or Character cards gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 10,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op08IronBodyFangFlash095I18n,
};
