import type { EventCard } from "@tcg/op-types";
import { prb01TheBillionFoldWorldTrichiliocosmJollyRogerFoil038I18n } from "./038-the-billion-fold-world-trichiliocosm-jolly-roger-foil.i18n.ts";

export const prb01TheBillionFoldWorldTrichiliocosmJollyRogerFoil038: EventCard = {
  id: "OP06-038",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  traits: ["Straw Hat Crew Dressrosa"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-038_p3.jpg",
      imageId: "OP06-038_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-038_r1.png",
      imageId: "OP06-038_r1",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 8 or more rested cards, that card gains an additional +2000 power during this battle.[Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
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
                  filter: "state",
                  value: "rested",
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
    ],
  },
  i18n: prb01TheBillionFoldWorldTrichiliocosmJollyRogerFoil038I18n,
};
