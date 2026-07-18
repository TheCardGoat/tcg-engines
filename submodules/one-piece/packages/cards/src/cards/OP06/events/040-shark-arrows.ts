import type { EventCard } from "@tcg/op-types";
import { op06SharkArrows040I18n } from "./040-shark-arrows.i18n.ts";

export const op06SharkArrows040: EventCard = {
  id: "OP06-040",
  canonicalId: "OP06-040",
  slug: "shark-arrows",
  name: "Shark Arrows",
  printings: [
    {
      id: "OP06-040",
      artId: "OP06-040",
      setCode: "OP06",
      collectorNumber: "040",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-040.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Fish-Man New Fish-Man Pirates"],
  effect: "[Main] K.O. up to 2 of your opponent's rested Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
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
  i18n: op06SharkArrows040I18n,
};
