import type { EventCard } from "@tcg/op-types";
import { prb01ThreeThousandWorldsJollyRogerFoil057I18n } from "./057-three-thousand-worlds-jolly-roger-foil.i18n.ts";

export const prb01ThreeThousandWorldsJollyRogerFoil057: EventCard = {
  id: "OP03-057",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "PRB01",
  cost: 4,
  traits: ["Straw Hat Crew East Blue"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p3.jpg",
      imageId: "OP03-057_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_r1.png",
      imageId: "OP03-057_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p4.jpg",
      imageId: "OP03-057_p4",
    },
  ],
  effect:
    "[Main] Place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck.[Trigger] Place up to 1 Character with a cost of 3 or less at the bottom of the owner's deck.",
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
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
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
                  value: 3,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb01ThreeThousandWorldsJollyRogerFoil057I18n,
};
