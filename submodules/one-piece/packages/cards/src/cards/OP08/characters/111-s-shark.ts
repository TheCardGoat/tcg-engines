import type { CharacterCard } from "@tcg/op-types";
import { op08SShark111I18n } from "./111-s-shark.i18n.ts";

export const op08SShark111: CharacterCard = {
  id: "OP08-111",
  canonicalId: "OP08-111",
  slug: "s-shark",
  name: "S-Shark",
  printings: [
    {
      id: "OP08-111",
      artId: "OP08-111",
      setCode: "OP08",
      collectorNumber: "111",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-111.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Egghead Seraphim"],
  attribute: "special",
  effect:
    "[DON!! x1] [When Attacking] Your opponent cannot activate [Blocker] during this battle. [Trigger] You may trash 1 card from your hand: If you have 2 or less Life cards, play this card.",
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
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
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
  },
  i18n: op08SShark111I18n,
};
