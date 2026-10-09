import type { CharacterCard } from "@tcg/op-types";
import { pSengoku032I18n } from "./p-032-sengoku.i18n.ts";
export const pSengoku032: CharacterCard = {
  id: "P-032",
  canonicalId: "P-032",
  slug: "sengoku/p-032",
  name: "Sengoku",
  printings: [
    {
      id: "P-032",
      artId: "P-032",
      setCode: "P",
      collectorNumber: "032",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-032.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect: "[DON!! x1] [Your Turn] Give all of your opponent's Characters −2 cost.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -2,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pSengoku032I18n,
};
