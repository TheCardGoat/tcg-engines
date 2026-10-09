import type { CharacterCard } from "@tcg/op-types";
import { pTrafalgarLaw155I18n } from "./p-155-trafalgar-law.i18n.ts";
export const pTrafalgarLaw155: CharacterCard = {
  id: "P-155",
  canonicalId: "P-155",
  slug: "trafalgar-law/p-155",
  name: "Trafalgar Law",
  printings: [
    {
      id: "P-155",
      artId: "P-155",
      setCode: "P",
      collectorNumber: "155",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-155.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Supernovas", "Heart Pirates"],
  attribute: "slash",
  effect:
    "[When Attacking] You may trash 1 card with a [Trigger] from your hand: Give up to 1 of your opponent's Characters −2000 power during this turn.",
  trigger: "If your opponent has 3 or less Life cards, play this card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: pTrafalgarLaw155I18n,
};
