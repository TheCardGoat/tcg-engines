import type { CharacterCard } from "@tcg/op-types";
import { st21RoronoaZoro015I18n } from "./st21-015-roronoa-zoro.i18n.ts";
export const st21RoronoaZoro015: CharacterCard = {
  id: "ST21-015",
  canonicalId: "ST21-015",
  slug: "roronoa-zoro/st21-015",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "ST21-015",
      artId: "ST21-015",
      setCode: "ST21",
      collectorNumber: "015",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-015.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "ST21",
  cost: 4,
  traits: ["Straw Hat Crew"],
  power: 5000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[DON!! x2] This Character gains [Rush]. [On K.O.] Play up to 1 red Character card with 6000 power or less other than [Roronoa Zoro] from your hand.",
  effects: {
    effects: [
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
                filter: "excludeName",
                value: "Roronoa Zoro",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st21RoronoaZoro015I18n,
};
