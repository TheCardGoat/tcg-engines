import type { CharacterCard } from "@tcg/op-types";
import { pHelmeppo020I18n } from "./p-020-helmeppo.i18n.ts";
export const pHelmeppo020: CharacterCard = {
  id: "P-020",
  canonicalId: "P-020",
  slug: "helmeppo/p-020",
  name: "Helmeppo",
  printings: [
    {
      id: "P-020",
      artId: "P-020",
      setCode: "P",
      collectorNumber: "020",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-020.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["FILM", "Navy"],
  attribute: "slash",
  effect: "[On Play] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: pHelmeppo020I18n,
};
