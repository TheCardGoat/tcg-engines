import type { CharacterCard } from "@tcg/op-types";
import { op08MonkeyDLuffySp109I18n } from "./109-monkey-d-luffy-sp.i18n.ts";

export const op08MonkeyDLuffySp109: CharacterCard = {
  id: "OP07-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew The Four Emperors Egghead"],
  attribute: "strike",
  effect:
    "[Activate:Main] You may trash this Character: If you have 2 or less Life cards; K.O. up to 1 of your opponent's Characters with a cost of 4 or less. Then, draw 1 card. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08MonkeyDLuffySp109I18n,
};
