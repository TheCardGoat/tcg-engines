import type { EventCard } from "@tcg/op-types";
import { prb01GuardPointJollyRogerFoil014I18n } from "./014-guard-point-jolly-roger-foil.i18n.ts";

export const prb01GuardPointJollyRogerFoil014: EventCard = {
  id: "ST01-014",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  traits: ["Animal Straw Hat Crew"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_p3.jpg",
      imageId: "ST01-014_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-014_r1.png",
      imageId: "ST01-014_r1",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle.[Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb01GuardPointJollyRogerFoil014I18n,
};
