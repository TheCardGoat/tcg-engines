import type { CharacterCard } from "@tcg/op-types";
import { op01Caribou007I18n } from "./007-caribou.i18n.ts";

export const op01Caribou007: CharacterCard = {
  id: "OP01-007",
  canonicalId: "OP01-007",
  slug: "caribou/op01-007",
  name: "Caribou",
  printings: [
    {
      id: "OP01-007",
      artId: "OP01-007",
      setCode: "OP01",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Caribou Pirates Supernovas"],
  attribute: "special",
  effect:
    "[On K.O.] K.O. up to 1 of your opponent's Characters with 4000 power or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                  value: 4000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01Caribou007I18n,
};
