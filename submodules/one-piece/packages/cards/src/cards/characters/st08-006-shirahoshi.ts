import type { CharacterCard } from "@tcg/op-types";
import { st08Shirahoshi006I18n } from "./st08-006-shirahoshi.i18n.ts";
export const st08Shirahoshi006: CharacterCard = {
  id: "ST08-006",
  canonicalId: "ST08-006",
  slug: "shirahoshi/st08-006",
  name: "Shirahoshi",
  printings: [
    {
      id: "ST08-006",
      artId: "ST08-006",
      setCode: "ST08",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-006.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["Merfolk"],
  cost: 4,
  counter: 1000,
  power: 0,
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Give up to 1 of your opponent's Characters −4 cost during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st08Shirahoshi006I18n,
};
