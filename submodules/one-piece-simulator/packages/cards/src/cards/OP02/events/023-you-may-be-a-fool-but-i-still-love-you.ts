import type { EventCard } from "@tcg/op-types";
import { op02YouMayBeAFoolButIStillLoveYou023I18n } from "./023-you-may-be-a-fool-but-i-still-love-you.i18n.ts";

export const op02YouMayBeAFoolButIStillLoveYou023: EventCard = {
  id: "OP02-023",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  traits: ["The Four Emperors Whitebeard Pirates"],
  effect:
    "[Main] If you have 3 or less Life cards, you cannot add Life cards to your hand using your own effects during this turn. [Trigger] Up to 1 of your Leader gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["life"],
              count: {
                amount: "all",
              },
            },
            duration: "thisTurn",
            bySource: "ownEffect",
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
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02YouMayBeAFoolButIStillLoveYou023I18n,
};
