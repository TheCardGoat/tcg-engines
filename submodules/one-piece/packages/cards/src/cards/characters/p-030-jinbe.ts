import type { CharacterCard } from "@tcg/op-types";
import { pJinbe030I18n } from "./p-030-jinbe.i18n.ts";
export const pJinbe030: CharacterCard = {
  id: "P-030",
  canonicalId: "P-030",
  slug: "jinbe/p-030",
  name: "Jinbe",
  printings: [
    {
      id: "P-030",
      artId: "P-030",
      setCode: "P",
      collectorNumber: "030",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-030.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man", "The Seven Warlords of the Sea", "The Sun Pirates"],
  attribute: "strike",
  effect:
    "[On K.O.] Place up to 1 Character with a cost of 3 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "any",
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
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: pJinbe030I18n,
};
