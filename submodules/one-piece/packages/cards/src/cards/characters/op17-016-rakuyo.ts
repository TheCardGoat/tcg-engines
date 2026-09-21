import type { CharacterCard } from "@tcg/op-types";
import { op17Rakuyo016I18n } from "./op17-016-rakuyo.i18n.ts";

export const op17Rakuyo016: CharacterCard = {
  id: "OP17-016",
  canonicalId: "OP17-016",
  slug: "rakuyo/op17-016",
  name: "Rakuyo",
  printings: [
    {
      id: "OP17-016",
      artId: "OP17-016",
      setCode: "OP17",
      collectorNumber: "016",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-016_hB49Y7j.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP17",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect: "[On Play] K.O. up to 2 of your opponent's Characters with 2000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op17Rakuyo016I18n,
};
