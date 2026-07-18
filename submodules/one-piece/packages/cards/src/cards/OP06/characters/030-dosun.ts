import type { CharacterCard } from "@tcg/op-types";
import { op06Dosun030I18n } from "./030-dosun.i18n.ts";

export const op06Dosun030: CharacterCard = {
  id: "OP06-030",
  canonicalId: "OP06-030",
  slug: "dosun",
  name: "Dosun",
  printings: [
    {
      id: "OP06-030",
      artId: "OP06-030",
      setCode: "OP06",
      collectorNumber: "030",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-030.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man", "New Fish-Man Pirates"],
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
            match: "includes",
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
            duration: "untilStartOfNextTurn",
            restriction: "inBattle",
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
            value: 2000,
            duration: "untilStartOfNextTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op06Dosun030I18n,
};
