import type { EventCard } from "@tcg/op-types";
import { st12LionStrike016I18n } from "./st12-016-lion-strike.i18n.ts";
export const st12LionStrike016: EventCard = {
  id: "ST12-016",
  canonicalId: "ST12-016",
  slug: "lion-strike/st12-016",
  name: "Lion Strike",
  printings: [
    {
      id: "ST12-016",
      artId: "ST12-016",
      setCode: "ST12",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-016.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "ST12",
  cost: 2,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main]/[Counter] Rest up to 1 of your opponent's Leader or Character cards with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
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
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
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
  trigger: "[Trigger] Activate this card's [Main] effect.",
  i18n: st12LionStrike016I18n,
};
