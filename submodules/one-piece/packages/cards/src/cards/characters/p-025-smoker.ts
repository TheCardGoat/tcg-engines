import type { CharacterCard } from "@tcg/op-types";
import { pSmoker025I18n } from "./p-025-smoker.i18n.ts";
export const pSmoker025: CharacterCard = {
  id: "P-025",
  canonicalId: "P-025",
  slug: "smoker/p-025",
  name: "Smoker",
  printings: [
    {
      id: "P-025",
      artId: "P-025",
      setCode: "P",
      collectorNumber: "025",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-025.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 5000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[DON!! x1] This Character cannot be K.O.'d in battle by Characters without the <Special> attribute.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
            byFilter: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "attribute",
                value: "special",
                negate: true,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: pSmoker025I18n,
};
