import type { CharacterCard } from "@tcg/op-types";
import { op13Uta023I18n } from "./023-uta.i18n.ts";

export const op13Uta023: CharacterCard = {
  id: "OP13-023",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["FILM"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-023_p1_QoP0Ctw.jpg",
      imageId: "OP13-023_p1",
    },
  ],
  effect:
    "[On Play] Set up to 2 of your DON!! cards as active. Then, you cannot play Character cards with a base cost of 5 or more during this turn.\n[On K.O.] Play up to 1 Character card with a cost of 5 or less from your hand rested.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "baseCost",
                comparison: "gte",
                value: 5,
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
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
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13Uta023I18n,
};
