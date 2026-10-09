import type { CharacterCard } from "@tcg/op-types";
import { st02XDrake014I18n } from "./st02-014-x-drake.i18n.ts";
export const st02XDrake014: CharacterCard = {
  id: "ST02-014",
  canonicalId: "ST02-014",
  slug: "x-drake/st02-014",
  name: "X.Drake",
  printings: [
    {
      id: "ST02-014",
      artId: "ST02-014",
      setCode: "ST02",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-014.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy", "Supernovas", "Drake Pirates"],
  attribute: "slash",
  effect:
    "[DON!! x1] [Your Turn] If this Character is rested, your {Supernovas} or {Navy} type Leaders and Characters gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "trait",
                      value: "Supernovas",
                      match: "exact",
                    },
                    {
                      filter: "trait",
                      value: "Navy",
                      match: "exact",
                    },
                  ],
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st02XDrake014I18n,
};
