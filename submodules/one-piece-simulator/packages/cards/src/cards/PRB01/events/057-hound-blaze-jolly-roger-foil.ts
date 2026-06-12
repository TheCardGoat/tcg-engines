import type { EventCard } from "@tcg/op-types";
import { prb01HoundBlazeJollyRogerFoil057I18n } from "./057-hound-blaze-jolly-roger-foil.i18n.ts";

export const prb01HoundBlazeJollyRogerFoil057: EventCard = {
  id: "OP05-057",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "PRB01",
  cost: 2,
  traits: ["Navy"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_p3.jpg",
      imageId: "OP05-057_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_r1.png",
      imageId: "OP05-057_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-057_p4.jpg",
      imageId: "OP05-057_p4",
    },
  ],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.[Trigger] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            duration: "thisTurn",
          },
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
                  value: 2,
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
            action: "returnToHand",
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
          },
        ],
      },
    ],
  },
  i18n: prb01HoundBlazeJollyRogerFoil057I18n,
};
