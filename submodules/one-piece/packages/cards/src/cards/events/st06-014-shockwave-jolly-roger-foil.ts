import type { EventCard } from "@tcg/op-types";
import { prb01ShockwaveJollyRogerFoil014I18n } from "./st06-014-shockwave-jolly-roger-foil.i18n.ts";

export const prb01ShockwaveJollyRogerFoil014: EventCard = {
  id: "ST06-014",
  canonicalId: "ST06-014",
  slug: "shockwave-jolly-roger-foil",
  name: "Shockwave",
  printings: [
    {
      id: "ST06-014",
      artId: "ST06-014",
      setCode: "ST06",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-014_p2.jpg",
      label: "Shockwave (Jolly Roger Foil)",
    },
    {
      id: "ST06-014_p3",
      artId: "ST06-014_p3",
      setCode: "ST06",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-014_p3.jpg",
      label: "Shockwave (Textured Foil)",
    },
    {
      id: "ST06-014_r1",
      artId: "ST06-014_r1",
      setCode: "ST06",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-014_r1.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 2,
  traits: ["Navy"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, K.O. up to 1 of your opponent's active Characters with a cost of 3 or less.[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
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
            value: 4000,
            duration: "thisBattle",
          },
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
                  value: "active",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb01ShockwaveJollyRogerFoil014I18n,
};
