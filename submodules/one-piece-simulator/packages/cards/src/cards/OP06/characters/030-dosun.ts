import type { CharacterCard } from "@tcg/op-types";
import { op06Dosun030I18n } from "./030-dosun.i18n.ts";

export const op06Dosun030: CharacterCard = {
  id: "OP06-030",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man New Fish-Man Pirates"],
  attribute: "strike",
  effect:
    "[When Attacking] If your Leader has the [New Fish-Man Pirates] type, this Character cannot be K.O.'d in battle and gains +2000 power until the start of your next turn. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "New Fish-Man Pirates",
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
      },
    ],
  },
  i18n: op06Dosun030I18n,
};
