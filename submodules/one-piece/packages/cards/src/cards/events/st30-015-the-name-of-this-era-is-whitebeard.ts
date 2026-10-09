import type { EventCard } from "@tcg/op-types";
import { st30TheNameOfThisEraIsWhitebeard015I18n } from "./st30-015-the-name-of-this-era-is-whitebeard.i18n.ts";
export const st30TheNameOfThisEraIsWhitebeard015: EventCard = {
  id: "ST30-015",
  canonicalId: "ST30-015",
  slug: "the-name-of-this-era-is-whitebeard/st30-015",
  name: 'The Name of This Era Is "Whitebeard"!!',
  printings: [
    {
      id: "ST30-015",
      artId: "ST30-015",
      setCode: "ST30",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-015.png",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Counter] If you have 2 or more Characters with 6000 base power, up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  trigger: "K.O. up to 1 of your opponent's Characters with 6000 power or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "basePower",
                comparison: "eq",
                value: 6000,
              },
            ],
          },
        ],
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
                  filter: "power",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st30TheNameOfThisEraIsWhitebeard015I18n,
};
