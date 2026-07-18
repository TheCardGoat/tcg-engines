import type { EventCard } from "@tcg/op-types";
import { op11BlueHole098I18n } from "./098-blue-hole.i18n.ts";

export const op11BlueHole098: EventCard = {
  id: "OP11-098",
  canonicalId: "OP11-098",
  slug: "blue-hole",
  name: "Blue Hole",
  printings: [
    {
      id: "OP11-098",
      artId: "OP11-098",
      setCode: "OP11",
      collectorNumber: "098",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-098.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  traits: ["Navy"],
  effect:
    "[Main] You may trash 3 cards from the top of your deck: K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
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
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11BlueHole098I18n,
};
