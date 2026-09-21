import type { EventCard } from "@tcg/op-types";
import { op04GumGumRedRoc056I18n } from "./op04-056-gum-gum-red-roc.i18n.ts";

export const op04GumGumRedRoc056: EventCard = {
  id: "OP04-056",
  canonicalId: "OP04-056",
  slug: "gum-gum-red-roc",
  name: "Gum-Gum Red Roc",
  printings: [
    {
      id: "OP04-056",
      artId: "OP04-056",
      setCode: "OP04",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056.jpg",
    },
    {
      id: "OP04-056_p2",
      artId: "OP04-056_p2",
      setCode: "OP04",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p2.jpg",
    },
    {
      id: "OP04-056_p2_6KicMKv",
      artId: "OP04-056_p2_6KicMKv",
      setCode: "OP04",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056.jpg",
    },
    {
      id: "OP04-056_p3",
      artId: "OP04-056_p3",
      setCode: "OP04",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_p3.jpg",
      label: "Gum-Gum Red Roc (Textured Foil)",
    },
    {
      id: "OP04-056_r1",
      artId: "OP04-056_r1",
      setCode: "OP04",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-056_r1.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP04",
  cost: 6,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] Place up to 1 Character at the bottom of the owner's deck. [Trigger] Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.",
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
  i18n: op04GumGumRedRoc056I18n,
};
