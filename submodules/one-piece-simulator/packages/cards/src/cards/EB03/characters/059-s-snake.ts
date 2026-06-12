import type { CharacterCard } from "@tcg/op-types";
import { eb03SSnake059I18n } from "./059-s-snake.i18n.ts";

export const eb03SSnake059: CharacterCard = {
  id: "EB03-059",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB03",
  cost: 6,
  power: 7000,
  counter: 1000,
  trigger:
    "Up to 1 of your opponent's Characters with a cost of 6 or less other than [Monkey.D.Luffy] cannot attack during this turn.",
  traits: ["Egghead Seraphim"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {Egghead} type and you have 2 or more Life cards, add up to 1 Character card with a [Trigger] from your hand to the top of your Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Egghead",
              },
              {
                condition: "lifeCount",
                player: "self",
                comparison: "gte",
                value: 2,
              },
            ],
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "hasTrigger",
                  value: true,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
      },
    ],
  },
  i18n: eb03SSnake059I18n,
};
