import type { CharacterCard } from "@tcg/op-types";
import { pBoaHancock066I18n } from "./p-066-boa-hancock.i18n.ts";
export const pBoaHancock066: CharacterCard = {
  id: "P-066",
  canonicalId: "P-066",
  slug: "boa-hancock/p-066",
  name: "Boa Hancock",
  printings: [
    {
      id: "P-066",
      artId: "P-066",
      setCode: "P",
      collectorNumber: "066",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-066.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  power: 5000,
  traits: ["The Seven Warlords of the Sea", "Kuja Pirates"],
  attribute: "special",
  cost: 4,
  counter: 1000,
  effect:
    "[Your Turn] If you have 5 or less cards in your hand, all of your {Kuja Pirates} type Characters gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 5,
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
                  value: "Kuja Pirates",
                  match: "exact",
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
  i18n: pBoaHancock066I18n,
};
