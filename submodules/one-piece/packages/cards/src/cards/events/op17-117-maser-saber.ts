import type { EventCard } from "@tcg/op-types";
import { op17MaserSaber117I18n } from "./op17-117-maser-saber.i18n.ts";

export const op17MaserSaber117: EventCard = {
  id: "OP17-117",
  canonicalId: "OP17-117",
  slug: "maser-saber/op17-117",
  name: "Maser Saber",
  printings: [
    {
      id: "OP17-117",
      artId: "OP17-117",
      setCode: "OP17",
      collectorNumber: "117",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-117_mzAwgkO.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  trigger:
    "Your opponent may trash 3 cards from their hand. If they do not, K.O. up to 1 of your opponent's Characters with a cost of 6 or less.",
  traits: ["The Four Emperors", "Big Mom Pirates"],
  effect: "[Counter] Up to 1 of your [Charlotte Linlin] gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
              filters: [
                {
                  filter: "name",
                  value: "Charlotte Linlin",
                },
              ],
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "conditional",
            predicate: {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 3,
            },
            whenTrue: [
              {
                action: "choice",
                player: "opponent",
                options: [
                  [
                    {
                      action: "trashFromHand",
                      player: "opponent",
                      amount: 3,
                    },
                  ],
                  [
                    {
                      action: "ko",
                      target: {
                        player: "opponent",
                        zones: ["character"],
                        count: {
                          amount: 1,
                          upTo: true,
                        },
                        filters: [
                          {
                            filter: "cost",
                            comparison: "lte",
                            value: 6,
                          },
                        ],
                      },
                    },
                  ],
                ],
              },
            ],
            whenFalse: [
              {
                action: "choice",
                player: "opponent",
                options: [
                  [
                    {
                      action: "trashFromHand",
                      player: "opponent",
                      amount: 3,
                    },
                    {
                      action: "ko",
                      target: {
                        player: "opponent",
                        zones: ["character"],
                        count: {
                          amount: 1,
                          upTo: true,
                        },
                        filters: [
                          {
                            filter: "cost",
                            comparison: "lte",
                            value: 6,
                          },
                        ],
                      },
                    },
                  ],
                  [
                    {
                      action: "ko",
                      target: {
                        player: "opponent",
                        zones: ["character"],
                        count: {
                          amount: 1,
                          upTo: true,
                        },
                        filters: [
                          {
                            filter: "cost",
                            comparison: "lte",
                            value: 6,
                          },
                        ],
                      },
                    },
                  ],
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op17MaserSaber117I18n,
};
