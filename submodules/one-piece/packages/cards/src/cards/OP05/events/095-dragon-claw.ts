import type { EventCard } from "@tcg/op-types";
import { op05DragonClaw095I18n } from "./095-dragon-claw.i18n.ts";

export const op05DragonClaw095: EventCard = {
  id: "OP05-095",
  canonicalId: "OP05-095",
  slug: "dragon-claw",
  name: "Dragon Claw",
  printings: [
    {
      id: "OP05-095",
      artId: "OP05-095",
      setCode: "OP05",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-095.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  traits: ["Revolutionary Army Dressrosa"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 15 or more cards in your trash, K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
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
            },
            value: 4000,
            duration: "thisBattle",
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
                  value: 4,
                },
              ],
            },
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 15,
            },
          },
        ],
      },
    ],
  },
  i18n: op05DragonClaw095I18n,
};
