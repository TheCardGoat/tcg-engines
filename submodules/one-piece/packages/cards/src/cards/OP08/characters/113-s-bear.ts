import type { CharacterCard } from "@tcg/op-types";
import { op08SBear113I18n } from "./113-s-bear.i18n.ts";

export const op08SBear113: CharacterCard = {
  id: "OP08-113",
  canonicalId: "OP08-113",
  slug: "s-bear",
  name: "S-Bear",
  printings: [
    {
      id: "OP08-113",
      artId: "OP08-113",
      setCode: "OP08",
      collectorNumber: "113",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger:
    "You may trash 1 card from your hand: If you have 2 or less Life cards, play this card and K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  traits: ["Egghead Seraphim"],
  attribute: "special",
  effect:
    "[Trigger] You may trash 1 card from your hand: If you have 2 or less Life cards, play this card and K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "playThisCard",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
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
                  value: 3,
                },
              ],
            },
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08SBear113I18n,
};
