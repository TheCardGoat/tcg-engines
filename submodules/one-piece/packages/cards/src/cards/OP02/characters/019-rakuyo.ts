import type { CharacterCard } from "@tcg/op-types";
import { op02Rakuyo019I18n } from "./019-rakuyo.i18n.ts";

export const op02Rakuyo019: CharacterCard = {
  id: "OP02-019",
  canonicalId: "OP02-019",
  slug: "rakuyo/op02-019",
  name: "Rakuyo",
  printings: [
    {
      id: "OP02-019",
      artId: "OP02-019",
      setCode: "OP02",
      collectorNumber: "019",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-019.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[DON!! x1] [Your Turn] All of your Characters with a type including "Whitebeard Pirates" gain +1000 power.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
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
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op02Rakuyo019I18n,
};
