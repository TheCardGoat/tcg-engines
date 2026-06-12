import type { EventCard } from "@tcg/op-types";
import { prb01ThunderBoltJollyRogerFoil121I18n } from "./121-thunder-bolt-jolly-roger-foil.i18n.ts";

export const prb01ThunderBoltJollyRogerFoil121: EventCard = {
  id: "OP03-121",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB01",
  cost: 2,
  traits: ["The Four Emperors Big Mom Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_p4.jpg",
      imageId: "OP03-121_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-121_r2.png",
      imageId: "OP03-121_r2",
    },
  ],
  effect:
    "[Main] You may trash 1 card from the top of your Life cards: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb01ThunderBoltJollyRogerFoil121I18n,
};
