import type { CharacterCard } from "@tcg/op-types";
import { op06Braham111I18n } from "./111-braham.i18n.ts";

export const op06Braham111: CharacterCard = {
  id: "OP06-111",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger: "If you have 2 or less Life cards, play this card.",
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  effect:
    "[Activate:Main][Once Per Turn] You may place 1 Stage with a cost of 1 at the bottom of the owner's deck: Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Braham111I18n,
};
