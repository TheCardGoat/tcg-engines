import type { CharacterCard } from "@tcg/op-types";
import { op06Zeo028I18n } from "./028-zeo.i18n.ts";

export const op06Zeo028: CharacterCard = {
  id: "OP06-028",
  canonicalId: "OP06-028",
  slug: "zeo",
  name: "Zeo",
  printings: [
    {
      id: "OP06-028",
      artId: "OP06-028",
      setCode: "OP06",
      collectorNumber: "028",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-028.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Fish-Man", "New Fish-Man Pirates"],
  attribute: "wisdom",
  effect:
    "[DON!! x1][When Attacking] If your Leader has the [New Fish-Man Pirates] type, set up to 1 of your DON!! cards as active and this Character gains +1000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.",
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
            trait: "New Fish-Man Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
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
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op06Zeo028I18n,
};
