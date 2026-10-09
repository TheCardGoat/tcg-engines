import type { CharacterCard } from "@tcg/op-types";
import { st06Sengoku005I18n } from "./st06-005-sengoku.i18n.ts";
export const st06Sengoku005: CharacterCard = {
  id: "ST06-005",
  canonicalId: "ST06-005",
  slug: "sengoku/st06-005",
  name: "Sengoku",
  printings: [
    {
      id: "ST06-005",
      artId: "ST06-005",
      setCode: "ST06",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-005.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect: "[When Attacking] Give up to 1 of your opponent's Characters −4 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
  i18n: st06Sengoku005I18n,
};
