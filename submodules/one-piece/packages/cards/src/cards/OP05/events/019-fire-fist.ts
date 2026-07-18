import type { EventCard } from "@tcg/op-types";
import { op05FireFist019I18n } from "./019-fire-fist.i18n.ts";

export const op05FireFist019: EventCard = {
  id: "OP05-019",
  canonicalId: "OP05-019",
  slug: "fire-fist/op05-019",
  name: "Fire Fist",
  printings: [
    {
      id: "OP05-019",
      artId: "OP05-019",
      setCode: "OP05",
      collectorNumber: "019",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-019.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP05",
  cost: 2,
  traits: ["Revolutionary Army"],
  effect:
    "[Main] Give up to 1 of your opponent's Characters -4000 power during this turn. Then, if you have 2 or less Life cards, K.O. up to 1 of your opponent's Characters with 0 power or less. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4000,
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
                  filter: "power",
                  comparison: "lte",
                  value: 0,
                },
              ],
            },
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op05FireFist019I18n,
};
