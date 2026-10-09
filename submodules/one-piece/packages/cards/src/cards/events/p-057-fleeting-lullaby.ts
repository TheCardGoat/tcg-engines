import type { EventCard } from "@tcg/op-types";
import { pFleetingLullaby057I18n } from "./p-057-fleeting-lullaby.i18n.ts";
export const pFleetingLullaby057: EventCard = {
  id: "P-057",
  canonicalId: "P-057",
  slug: "fleeting-lullaby/p-057",
  name: "Fleeting Lullaby",
  printings: [
    {
      id: "P-057",
      artId: "P-057",
      setCode: "P",
      collectorNumber: "057",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-057.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 3,
  traits: ["Music", "FILM"],
  effect:
    "[Main] If your Leader is [Uta], up to 2 of your opponent's rested Characters with a cost of 4 or less will not become active in your opponent's next Refresh Phase.",
  trigger: "Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Uta",
          },
        ],
        actions: [
          {
            action: "freeze",
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
  i18n: pFleetingLullaby057I18n,
};
