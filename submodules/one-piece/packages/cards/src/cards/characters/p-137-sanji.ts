import type { CharacterCard } from "@tcg/op-types";
import { pSanji137I18n } from "./p-137-sanji.i18n.ts";
export const pSanji137: CharacterCard = {
  id: "P-137",
  canonicalId: "P-137",
  slug: "sanji/p-137",
  name: "Sanji",
  printings: [
    {
      id: "P-137",
      artId: "P-137",
      setCode: "P",
      collectorNumber: "137",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-137.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 7000,
  counter: 1000,
  attribute: "strike",
  traits: ["Straw Hat Crew"],
  effect:
    "[Double Attack] (This card deals 2 damage.) [When Attacking] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: pSanji137I18n,
};
