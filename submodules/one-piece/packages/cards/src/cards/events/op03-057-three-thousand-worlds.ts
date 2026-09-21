import type { EventCard } from "@tcg/op-types";
import { op03ThreeThousandWorlds057I18n } from "./op03-057-three-thousand-worlds.i18n.ts";

export const op03ThreeThousandWorlds057: EventCard = {
  id: "OP03-057",
  canonicalId: "OP03-057",
  slug: "three-thousand-worlds",
  name: "Three Thousand Worlds",
  printings: [
    {
      id: "OP03-057",
      artId: "OP03-057",
      setCode: "OP03",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057.jpg",
    },
    {
      id: "OP03-057_p2",
      artId: "OP03-057_p2",
      setCode: "OP03",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p2.jpg",
    },
    {
      id: "OP03-057_p3",
      artId: "OP03-057_p3",
      setCode: "OP03",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p3.jpg",
      label: "Three Thousand Worlds (Textured Foil)",
    },
    {
      id: "OP03-057_p4",
      artId: "OP03-057_p4",
      setCode: "OP03",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_p4.jpg",
      label: "Three Thousand Worlds (Alternate Art)",
    },
    {
      id: "OP03-057_r1",
      artId: "OP03-057_r1",
      setCode: "OP03",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-057_r1.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP03",
  cost: 4,
  traits: ["Straw Hat Crew East Blue"],
  effect:
    "[Main] Place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck. [Trigger] Place up to 1 Character with a cost of 3 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "any",
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
              player: "any",
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
  i18n: op03ThreeThousandWorlds057I18n,
};
