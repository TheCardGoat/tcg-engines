import type { CharacterCard } from "@tcg/op-types";
import { st08Makino009I18n } from "./st08-009-makino.i18n.ts";
export const st08Makino009: CharacterCard = {
  id: "ST08-009",
  canonicalId: "ST08-009",
  slug: "makino/st08-009",
  name: "Makino",
  printings: [
    {
      id: "ST08-009",
      artId: "ST08-009",
      setCode: "ST08",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-009.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["Windmill Village"],
  cost: 2,
  counter: 2000,
  power: 0,
  attribute: "wisdom",
  effect: "[On Play] If there is a Character with a cost of 0, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st08Makino009I18n,
};
