import type { CharacterCard } from "@tcg/op-types";
import { st07CharlotteSnack004I18n } from "./st07-004-charlotte-snack.i18n.ts";
export const st07CharlotteSnack004: CharacterCard = {
  id: "ST07-004",
  canonicalId: "ST07-004",
  slug: "charlotte-snack/st07-004",
  name: "Charlotte Snack",
  printings: [
    {
      id: "ST07-004",
      artId: "ST07-004",
      setCode: "ST07",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-004.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 5,
  traits: ["Big Mom Pirates"],
  power: 6000,
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: This Character gains [Banish] and +1000 power during this battle.(When this card deals damage, the target card is trashed without activating its Trigger.)",
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
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "banish",
            duration: "thisBattle",
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
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st07CharlotteSnack004I18n,
};
