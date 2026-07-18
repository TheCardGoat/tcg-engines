import type { EventCard } from "@tcg/op-types";
import { op09BlackHole098I18n } from "./098-black-hole.i18n.ts";

export const op09BlackHole098: EventCard = {
  id: "OP09-098",
  canonicalId: "OP09-098",
  slug: "black-hole",
  name: "Black Hole",
  printings: [
    {
      id: "OP09-098",
      artId: "OP09-098",
      setCode: "OP09",
      collectorNumber: "098",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-098.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  trigger:
    "Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
  traits: ["Blackbeard Pirates"],
  effect:
    '[Main] If your Leader has the "Blackbeard Pirates" type, negate the effect of up to 1 of your opponent\'s Characters during this turn. Then, if that Character has a cost of 4 or less, K.O. it.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 4 }],
            },
            previousActionTargets: true,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op09BlackHole098I18n,
};
