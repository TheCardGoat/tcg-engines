import type { CharacterCard } from "@tcg/op-types";
import { op08SSnake112I18n } from "./112-s-snake.i18n.ts";

export const op08SSnake112: CharacterCard = {
  id: "OP08-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Egghead Seraphim"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-112_p1.jpg",
      imageId: "OP08-112_p1",
    },
  ],
  effect:
    "[On Play] Up to 1 of your opponent's Characters with a cost of 6 or less other than [Monkey.D.Luffy] cannot attack until the end of your opponent's next turn. [Trigger] Activate this card's [On Play] effect.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "excludeName",
                  value: "Monkey.D.Luffy",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "onPlay",
          },
        ],
      },
    ],
  },
  i18n: op08SSnake112I18n,
};
