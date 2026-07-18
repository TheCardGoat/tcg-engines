import type { CharacterCard } from "@tcg/op-types";
import { op08SHawk114I18n } from "./114-s-hawk.i18n.ts";

export const op08SHawk114: CharacterCard = {
  id: "OP08-114",
  canonicalId: "OP08-114",
  slug: "s-hawk",
  name: "S-Hawk",
  printings: [
    {
      id: "OP08-114",
      artId: "OP08-114",
      setCode: "OP08",
      collectorNumber: "114",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-114.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Egghead Seraphim"],
  attribute: "slash",
  effect:
    "[DON!! x1] If you have less Life cards than your opponent, this Character cannot be K.O.'d in battle by <Slash> attribute cards and gains +2000 power. [Trigger] You may trash 1 card from your hand: If you have 2 or less Life cards, play this card.",
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
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "lifeComparison",
            selfComparison: "lt",
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
                filter: "attribute",
                value: "slash",
              },
            ],
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op08SHawk114I18n,
};
