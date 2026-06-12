import type { CharacterCard } from "@tcg/op-types";
import { op01Kanjuro038I18n } from "./038-kanjuro.i18n.ts";

export const op01Kanjuro038: CharacterCard = {
  id: "OP01-038",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less. [On K.O.] Your opponent chooses 1 card from your hand; trash that card.  This card has been officially errata'd.",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op01Kanjuro038I18n,
};
