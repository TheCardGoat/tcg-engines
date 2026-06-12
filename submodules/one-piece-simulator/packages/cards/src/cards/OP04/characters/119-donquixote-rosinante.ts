import type { CharacterCard } from "@tcg/op-types";
import { op04DonquixoteRosinante119I18n } from "./119-donquixote-rosinante.i18n.ts";

export const op04DonquixoteRosinante119: CharacterCard = {
  id: "OP04-119",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP04",
  cost: 8,
  power: 8000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-119_p1.jpg",
      imageId: "OP04-119_p1",
    },
  ],
  effect:
    "[Opponent's Turn] If this Character is rested, your active Characters with a base cost of 5 cannot be K.O.'d by effects. [On Play] You may rest this Character: Play up to 1 green Character card with a cost of 5 from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
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
                comparison: "eq",
                value: 5,
              },
              {
                filter: "color",
                value: "green",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "state",
                  value: "active",
                },
                {
                  filter: "baseCost",
                  comparison: "eq",
                  value: 5,
                },
              ],
            },
            duration: "permanent",
            restriction: "byEffect",
          },
        ],
      },
    ],
  },
  i18n: op04DonquixoteRosinante119I18n,
};
