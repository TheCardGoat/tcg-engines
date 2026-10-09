import type { CharacterCard } from "@tcg/op-types";
import { st24XDrake005I18n } from "./st24-005-x-drake.i18n.ts";
export const st24XDrake005: CharacterCard = {
  id: "ST24-005",
  canonicalId: "ST24-005",
  slug: "x-drake/st24-005",
  name: "X.Drake",
  printings: [
    {
      id: "ST24-005",
      artId: "ST24-005",
      setCode: "ST24",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST24-005.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST24",
  cost: 5,
  traits: ["Supernovas", "Navy", "Drake Pirates"],
  power: 5000,
  attribute: "slash",
  counter: 2000,
  effect:
    "[On Play] If your Leader has the {Supernovas} type, rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, set up to 1 of your DON!! cards as active at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
            match: "exact",
          },
        ],
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
                  value: 5,
                },
              ],
            },
          },
          {
            action: "delayed",
            timing: "endOfThisTurn",
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
            ],
          },
        ],
      },
    ],
  },
  i18n: st24XDrake005I18n,
};
