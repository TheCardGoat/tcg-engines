import type { CharacterCard } from "@tcg/op-types";
import { op13Rakuyo055I18n } from "./055-rakuyo.i18n.ts";

export const op13Rakuyo055: CharacterCard = {
  id: "OP13-055",
  canonicalId: "OP13-055",
  slug: "rakuyo/op13-055",
  name: "Rakuyo",
  printings: [
    {
      id: "OP13-055",
      artId: "OP13-055",
      setCode: "OP13",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-055_3hg2dZz.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[When Attacking] If you have 4 or less cards in your hand, all of your Characters with a type including "Whitebeard Pirates" gain +1000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13Rakuyo055I18n,
};
