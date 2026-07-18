import type { CharacterCard } from "@tcg/op-types";
import { op08SilversRayleigh118I18n } from "./118-silvers-rayleigh.i18n.ts";

export const op08SilversRayleigh118: CharacterCard = {
  id: "OP08-118",
  canonicalId: "OP08-118",
  slug: "silvers-rayleigh/op08-118",
  name: "Silvers Rayleigh",
  printings: [
    {
      id: "OP08-118",
      artId: "OP08-118",
      setCode: "OP08",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-118.jpg",
    },
    {
      id: "OP08-118_p1",
      artId: "OP08-118_p1",
      setCode: "OP08",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-118_p1.jpg",
    },
    {
      id: "OP08-118_p2",
      artId: "OP08-118_p2",
      setCode: "OP08",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-118_p2.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "OP08",
  cost: 8,
  power: 8000,
  traits: ["Former Roger Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-118_p1.jpg",
      imageId: "OP08-118_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-118_p2.jpg",
      imageId: "OP08-118_p2",
    },
  ],
  effect:
    "[On Play] Select up to 2 of your opponent's Characters, and give 1 Character −3000 power and the other −2000 power until the end of your opponent's next turn. Then, K.O. up to 1 of your opponent's Characters with 3000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -3000,
            distributedValues: [-3000, -2000],
            duration: "untilEndOfOpponentNextTurn",
          },
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
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08SilversRayleigh118I18n,
};
