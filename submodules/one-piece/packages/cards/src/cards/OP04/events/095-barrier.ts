import type { EventCard } from "@tcg/op-types";
import { op04Barrier095I18n } from "./095-barrier.i18n.ts";

export const op04Barrier095: EventCard = {
  id: "OP04-095",
  canonicalId: "OP04-095",
  slug: "barrier",
  name: "Barrier!!",
  printings: [
    {
      id: "OP04-095",
      artId: "OP04-095",
      setCode: "OP04",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-095.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  traits: ["Dressrosa Barto Club"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 15 or more cards in your trash, that card gains an additional +2000 power during this battle. [Trigger] Draw 2 cards and trash 1 card from your hand.",
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
            value: 2000,
            duration: "thisBattle",
          },
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
            duration: "thisBattle",
            previousActionTargets: true,
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op04Barrier095I18n,
};
