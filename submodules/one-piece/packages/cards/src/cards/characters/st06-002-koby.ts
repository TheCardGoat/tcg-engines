import type { CharacterCard } from "@tcg/op-types";
import { st06Koby002I18n } from "./st06-002-koby.i18n.ts";
export const st06Koby002: CharacterCard = {
  id: "ST06-002",
  canonicalId: "ST06-002",
  slug: "koby/st06-002",
  name: "Koby",
  printings: [
    {
      id: "ST06-002",
      artId: "ST06-002",
      setCode: "ST06",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-002.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 0.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
                  filter: "cost",
                  value: 0,
                  comparison: "eq",
                },
              ],
            },
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st06Koby002I18n,
};
