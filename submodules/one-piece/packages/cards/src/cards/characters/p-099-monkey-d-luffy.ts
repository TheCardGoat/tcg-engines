import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy099I18n } from "./p-099-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy099: CharacterCard = {
  id: "P-099",
  canonicalId: "P-099",
  slug: "monkey-d-luffy/p-099",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-099",
      artId: "P-099",
      setCode: "P",
      collectorNumber: "099",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-099.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[When Attacking] DON!! −10 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 10,
          },
        ],
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
        optional: true,
      },
    ],
  },
  i18n: pMonkeyDLuffy099I18n,
};
