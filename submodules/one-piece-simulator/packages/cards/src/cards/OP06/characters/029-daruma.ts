import type { CharacterCard } from "@tcg/op-types";
import { op06Daruma029I18n } from "./029-daruma.i18n.ts";

export const op06Daruma029: CharacterCard = {
  id: "OP06-029",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man New Fish-Man Pirates"],
  attribute: "slash",
  effect:
    "[DON!! x1][When Attacking][Once Per Turn] If your Leader has the [New FIsh-Man Pirates] type, set this Character as active and this Character gains +1000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "leaderTrait",
            trait: "New FIsh-Man Pirates",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
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
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Daruma029I18n,
};
