import type { CharacterCard } from "@tcg/op-types";
import { st14Franky009I18n } from "./st14-009-franky.i18n.ts";
export const st14Franky009: CharacterCard = {
  id: "ST14-009",
  canonicalId: "ST14-009",
  slug: "franky/st14-009",
  name: "Franky",
  printings: [
    {
      id: "ST14-009",
      artId: "ST14-009",
      setCode: "ST14",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-009.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 5,
  traits: ["Straw Hat Crew"],
  power: 6000,
  attribute: "special",
  counter: 1000,
  effect:
    "[DON!! x1] [Opponent's Turn] If you have a Character with a cost of 6 or more, this Character cannot be K.O.'d by your opponent's effects and gains +2000 power.",
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
            value: "opponent",
          },
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 6,
              },
            ],
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
            restriction: "byEffect",
            byPlayer: "opponent",
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
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st14Franky009I18n,
};
