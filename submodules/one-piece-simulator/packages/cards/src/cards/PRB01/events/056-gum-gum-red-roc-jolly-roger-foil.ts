import type { EventCard } from "@tcg/op-types";
import { prb01GumGumRedRocJollyRogerFoil056I18n } from "./056-gum-gum-red-roc-jolly-roger-foil.i18n.ts";

export const prb01GumGumRedRocJollyRogerFoil056: EventCard = {
  id: "OP04-056",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "PRB01",
  cost: 6,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p3.jpg",
      imageId: "OP04-056_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_r1.png",
      imageId: "OP04-056_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p2.jpg",
      imageId: "OP04-056_p2",
    },
  ],
  effect:
    "[Main] Place up to 1 Character at the bottom of the owner's deck.[Trigger] Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToDeck",
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
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb01GumGumRedRocJollyRogerFoil056I18n,
};
