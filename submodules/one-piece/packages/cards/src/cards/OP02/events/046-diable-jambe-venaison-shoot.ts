import type { EventCard } from "@tcg/op-types";
import { op02DiableJambeVenaisonShoot046I18n } from "./046-diable-jambe-venaison-shoot.i18n.ts";

export const op02DiableJambeVenaisonShoot046: EventCard = {
  id: "OP02-046",
  canonicalId: "OP02-046",
  slug: "diable-jambe-venaison-shoot",
  name: "Diable Jambe Venaison Shoot",
  printings: [
    {
      id: "OP02-046",
      artId: "OP02-046",
      setCode: "OP02",
      collectorNumber: "046",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-046.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP02",
  cost: 2,
  traits: ["Film Straw Hat Crew"],
  effect:
    "[Main] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less. [Trigger] Play up to 1 Character card with a cost of 4 or less and no base effect from your hand.",
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
                amount: 1,
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
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "hasEffectType",
                value: "onPlay",
                negate: true,
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op02DiableJambeVenaisonShoot046I18n,
};
