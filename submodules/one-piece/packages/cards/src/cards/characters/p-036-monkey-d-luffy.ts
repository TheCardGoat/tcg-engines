import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy036I18n } from "./p-036-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy036: CharacterCard = {
  id: "P-036",
  canonicalId: "P-036",
  slug: "monkey-d-luffy/p-036",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-036",
      artId: "P-036",
      setCode: "P",
      collectorNumber: "036",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-036.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: This Character and up to 1 of your Leader gain +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: pMonkeyDLuffy036I18n,
};
