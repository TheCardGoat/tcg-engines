import type { CharacterCard } from "@tcg/op-types";
import { st29Kaku003I18n } from "./st29-003-kaku.i18n.ts";
export const st29Kaku003: CharacterCard = {
  id: "ST29-003",
  canonicalId: "ST29-003",
  slug: "kaku/st29-003",
  name: "Kaku",
  printings: [
    {
      id: "ST29-003",
      artId: "ST29-003",
      setCode: "ST29",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-003.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Egghead", "CP0"],
  attribute: "slash",
  effect:
    "If the number of your Life cards is equal to or less than the number of your opponent's Life cards, this Character gains +1000 power.",
  trigger: "K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
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
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "lifeComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st29Kaku003I18n,
};
