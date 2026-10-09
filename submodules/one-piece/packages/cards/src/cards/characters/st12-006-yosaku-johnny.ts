import type { CharacterCard } from "@tcg/op-types";
import { st12YosakuJohnny006I18n } from "./st12-006-yosaku-johnny.i18n.ts";
export const st12YosakuJohnny006: CharacterCard = {
  id: "ST12-006",
  canonicalId: "ST12-006",
  slug: "yosaku-johnny/st12-006",
  name: "Yosaku & Johnny",
  printings: [
    {
      id: "ST12-006",
      artId: "ST12-006",
      setCode: "ST12",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-006.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST12",
  cost: 2,
  traits: ["East Blue"],
  power: 3000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[DON!! x1] [When Attacking] Choose one: • Rest up to 1 of your opponent's Characters with a cost of 2 or less. • K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        comparison: "lte",
                        value: 2,
                      },
                    ],
                  },
                },
              ],
              [
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
                        filter: "state",
                        value: "rested",
                      },
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 2,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: st12YosakuJohnny006I18n,
};
