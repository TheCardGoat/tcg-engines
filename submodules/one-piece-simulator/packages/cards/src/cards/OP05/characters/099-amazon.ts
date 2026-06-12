import type { CharacterCard } from "@tcg/op-types";
import { op05Amazon099I18n } from "./099-amazon.i18n.ts";

export const op05Amazon099: CharacterCard = {
  id: "OP05-099",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] You may rest this Character: Your opponent may trash 1 card from the top of their Life cards. If they do not, give up to 1 of your opponent's Leader or Character cards -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "removeFromLife",
                  player: "opponent",
                  count: {
                    amount: 1,
                  },
                  destination: "trash",
                },
              ],
              [
                {
                  action: "modifyPower",
                  target: {
                    player: "opponent",
                    zones: ["leader", "character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  value: -2000,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Amazon099I18n,
};
