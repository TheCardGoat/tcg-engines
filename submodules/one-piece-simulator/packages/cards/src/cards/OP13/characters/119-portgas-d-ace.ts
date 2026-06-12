import type { CharacterCard } from "@tcg/op-types";
import { op13PortgasDAce119I18n } from "./119-portgas-d-ace.i18n.ts";

export const op13PortgasDAce119: CharacterCard = {
  id: "OP13-119",
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-119_p4_WLOgMvR.png",
      imageId: "OP13-119_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-119_p2_lq7yqKH.png",
      imageId: "OP13-119_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-119_p3_xilqQGs.png",
      imageId: "OP13-119_p3",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-119_p1_JEaVVuj.jpg",
      imageId: "OP13-119_p1",
    },
  ],
  effect:
    "If you have 3 or less Life cards, this Character gains [Rush].\n[On Play] Give up to 1 rested DON!! card to your Leader. Then, you may return up to 1 of your opponent's Characters with a cost of 5 or less to the owner's hand. If you do, your opponent plays up to 1 Character card with a cost of 4 or less from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op13PortgasDAce119I18n,
};
