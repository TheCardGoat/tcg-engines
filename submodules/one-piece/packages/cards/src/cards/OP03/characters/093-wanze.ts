import type { CharacterCard } from "@tcg/op-types";
import { op03Wanze093I18n } from "./093-wanze.i18n.ts";

export const op03Wanze093: CharacterCard = {
  id: "OP03-093",
  canonicalId: "OP03-093",
  slug: "wanze",
  name: "Wanze",
  printings: [
    {
      id: "OP03-093",
      artId: "OP03-093",
      setCode: "OP03",
      collectorNumber: "093",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-093.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  power: 4000,
  traits: ["CP7"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: If your Leader's type includes \"CP\", K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "CP",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Wanze093I18n,
};
