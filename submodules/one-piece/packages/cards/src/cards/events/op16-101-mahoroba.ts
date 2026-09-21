import type { EventCard } from "@tcg/op-types";
import { op16Mahoroba101I18n } from "./op16-101-mahoroba.i18n.ts";

export const op16Mahoroba101: EventCard = {
  id: "OP16-101",
  canonicalId: "OP16-101",
  slug: "mahoroba/op16-101",
  name: "Mahoroba",
  printings: [
    {
      id: "OP16-101",
      artId: "OP16-101",
      setCode: "OP16",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-101_YfEpHnx.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP16",
  cost: 2,
  trigger: "Add up to 1 [Yamato] from your trash to your hand.",
  traits: ["Land of Wano"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, if you have 10 or more cards in your trash, K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            value: 3000,
            duration: "thisTurn",
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
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 10,
            },
          },
        ],
      },
    ],
  },
  i18n: op16Mahoroba101I18n,
};
