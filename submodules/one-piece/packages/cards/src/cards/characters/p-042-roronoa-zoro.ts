import type { CharacterCard } from "@tcg/op-types";
import { pRoronoaZoro042I18n } from "./p-042-roronoa-zoro.i18n.ts";
export const pRoronoaZoro042: CharacterCard = {
  id: "P-042",
  canonicalId: "P-042",
  slug: "roronoa-zoro/p-042",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "P-042",
      artId: "P-042",
      setCode: "P",
      collectorNumber: "042",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-042.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano", "Straw Hat Crew"],
  attribute: "slash",
  effect: "-",
  trigger: "K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pRoronoaZoro042I18n,
};
