import type { CharacterCard } from "@tcg/op-types";
import { st12Rika007I18n } from "./st12-007-rika.i18n.ts";
export const st12Rika007: CharacterCard = {
  id: "ST12-007",
  canonicalId: "ST12-007",
  slug: "rika/st12-007",
  name: "Rika",
  printings: [
    {
      id: "ST12-007",
      artId: "ST12-007",
      setCode: "ST12",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-007.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST12",
  cost: 2,
  traits: ["East Blue"],
  power: 0,
  attribute: "wisdom",
  counter: 2000,
  effect:
    "[On Play] ➁ (You may rest the specified number of DON!! cards in your cost area.): If your opponent has 3 or more Life cards, set up to 1 of your <Slash> attribute Characters with a cost of 4 or less as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "setActive",
            condition: {
              condition: "lifeCount",
              player: "opponent",
              comparison: "gte",
              value: 3,
            },
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "attribute",
                  value: "slash",
                },
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
  i18n: st12Rika007I18n,
};
