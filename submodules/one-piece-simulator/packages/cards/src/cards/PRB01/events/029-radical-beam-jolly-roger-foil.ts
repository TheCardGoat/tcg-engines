import type { EventCard } from "@tcg/op-types";
import { prb01RadicalBeamJollyRogerFoil029I18n } from "./029-radical-beam-jolly-roger-foil.i18n.ts";

export const prb01RadicalBeamJollyRogerFoil029: EventCard = {
  id: "OP01-029",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-029_p3.jpg",
      imageId: "OP01-029_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-029_r1.png",
      imageId: "OP01-029_r1",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 2 or less Life cards, that card gains an additional +2000 power.This card has been officially errata'd.",
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
    ],
  },
  i18n: prb01RadicalBeamJollyRogerFoil029I18n,
};
