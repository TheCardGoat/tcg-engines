import type { CharacterCard } from "@tcg/op-types";
import { pRoronoaZoro114I18n } from "./p-114-roronoa-zoro.i18n.ts";
export const pRoronoaZoro114: CharacterCard = {
  id: "P-114",
  canonicalId: "P-114",
  slug: "roronoa-zoro/p-114",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "P-114",
      artId: "P-114",
      setCode: "P",
      collectorNumber: "114",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-114.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  attribute: "slash",
  traits: ["Supernovas", "Straw Hat Crew"],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [End of Your Turn] If you have any active DON!! cards, set this Character as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
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
        ],
        conditions: [
          {
            condition: "activeDonCount",
            comparison: "gte",
            value: 1,
          },
        ],
      },
    ],
  },
  i18n: pRoronoaZoro114I18n,
};
