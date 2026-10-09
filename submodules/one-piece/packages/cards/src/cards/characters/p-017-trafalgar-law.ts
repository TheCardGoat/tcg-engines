import type { CharacterCard } from "@tcg/op-types";
import { pTrafalgarLaw017I18n } from "./p-017-trafalgar-law.i18n.ts";
export const pTrafalgarLaw017: CharacterCard = {
  id: "P-017",
  canonicalId: "P-017",
  slug: "trafalgar-law/p-017",
  name: "Trafalgar Law",
  printings: [
    {
      id: "P-017",
      artId: "P-017",
      setCode: "P",
      collectorNumber: "017",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-017.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["FILM", "Supernovas", "Heart Pirates"],
  attribute: "slash",
  effect: "[On Play] Give up to 1 of your opponent's Characters −2000 power during this turn.",
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
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: pTrafalgarLaw017I18n,
};
