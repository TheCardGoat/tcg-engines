import type { EventCard } from "@tcg/op-types";
import { eb03ThereYouAreSoreLoser020I18n } from "./020-there-you-are-sore-loser.i18n.ts";

export const eb03ThereYouAreSoreLoser020: EventCard = {
  id: "EB03-020",
  canonicalId: "EB03-020",
  slug: "there-you-are-sore-loser",
  name: "There You Are, Sore Loser!",
  printings: [
    {
      id: "EB03-020",
      artId: "EB03-020",
      setCode: "EB03",
      collectorNumber: "020",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-020_nMEgf3n.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  trigger: "Set up to 1 of your Characters as active.",
  traits: ["FILM"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 2 or more {FILM} type Characters, that card gains an additional +2000 power during this battle.",
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
              zone: "character",
              comparison: "gte",
              value: 2,
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                  match: "includes",
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
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: eb03ThereYouAreSoreLoser020I18n,
};
