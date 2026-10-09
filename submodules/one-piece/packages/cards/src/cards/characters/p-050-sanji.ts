import type { CharacterCard } from "@tcg/op-types";
import { pSanji050I18n } from "./p-050-sanji.i18n.ts";
export const pSanji050: CharacterCard = {
  id: "P-050",
  canonicalId: "P-050",
  slug: "sanji/p-050",
  name: "Sanji",
  printings: [
    {
      id: "P-050",
      artId: "P-050",
      setCode: "P",
      collectorNumber: "050",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-050.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 3,
  traits: ["Straw Hat Crew"],
  power: 2000,
  counter: 1000,
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [DON!! x1] [Your Turn] If you have 3 or less cards in your hand, this Character gains +4000 power.",
  effects: {
    keywords: ["blocker"],
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
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 3,
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
            value: 4000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pSanji050I18n,
};
