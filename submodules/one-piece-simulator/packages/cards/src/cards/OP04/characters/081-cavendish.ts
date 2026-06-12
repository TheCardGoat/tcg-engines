import type { CharacterCard } from "@tcg/op-types";
import { op04Cavendish081I18n } from "./081-cavendish.i18n.ts";

export const op04Cavendish081: CharacterCard = {
  id: "OP04-081",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP04",
  cost: 5,
  power: 6000,
  traits: ["Beautiful Pirates Dressrosa"],
  attribute: "slash",
  effect:
    "[DON!! x1] This Character can also attack active Characters. [When Attacking] You may rest your Leader: K.O. up to 1 of your opponent's Characters with a cost of 1 or less. Then, trash 2 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
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
        ],
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04Cavendish081I18n,
};
