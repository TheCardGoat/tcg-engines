import type { CharacterCard } from "@tcg/op-types";
import { pMissGoldenweekMarianne146I18n } from "./p-146-miss-goldenweek-marianne.i18n.ts";
export const pMissGoldenweekMarianne146: CharacterCard = {
  id: "P-146",
  canonicalId: "P-146",
  slug: "miss-goldenweek-marianne/p-146",
  name: "Miss.Goldenweek(Marianne)",
  printings: [
    {
      id: "P-146",
      artId: "P-146",
      setCode: "P",
      collectorNumber: "146",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-146.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 1,
  traits: ["Baroque Works"],
  power: 2000,
  attribute: "wisdom",
  counter: 1000,
  effect: "[On K.O.] Draw 1 card and rest up to 1 of your opponent's Characters with a cost of 0.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "rest",
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
                  value: 0,
                  comparison: "eq",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pMissGoldenweekMarianne146I18n,
};
