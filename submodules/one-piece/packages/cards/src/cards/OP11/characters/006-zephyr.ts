import type { CharacterCard } from "@tcg/op-types";
import { op11Zephyr006I18n } from "./006-zephyr.i18n.ts";

export const op11Zephyr006: CharacterCard = {
  id: "OP11-006",
  canonicalId: "OP11-006",
  slug: "zephyr/op11-006",
  name: "Zephyr",
  printings: [
    {
      id: "OP11-006",
      artId: "OP11-006",
      setCode: "OP11",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-006.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM Neo Navy"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Give up to 1 of your opponent's (Special) attribute Characters 5000 power during this turn.",
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "attribute",
                  value: "special",
                },
              ],
            },
            value: 5000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11Zephyr006I18n,
};
