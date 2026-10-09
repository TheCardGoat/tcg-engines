import type { CharacterCard } from "@tcg/op-types";
import { st12Kuina002I18n } from "./st12-002-kuina.i18n.ts";
export const st12Kuina002: CharacterCard = {
  id: "ST12-002",
  canonicalId: "ST12-002",
  slug: "kuina/st12-002",
  name: "Kuina",
  printings: [
    {
      id: "ST12-002",
      artId: "ST12-002",
      setCode: "ST12",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-002.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST12",
  cost: 3,
  traits: ["Frost Moon Village"],
  power: 2000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[Activate: Main] You may rest this Character: Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
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
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  trigger: "[Trigger] Play this card.",
  i18n: st12Kuina002I18n,
};
