import type { CharacterCard } from "@tcg/op-types";
import { st08Higuma008I18n } from "./st08-008-higuma.i18n.ts";
export const st08Higuma008: CharacterCard = {
  id: "ST08-008",
  canonicalId: "ST08-008",
  slug: "higuma/st08-008",
  name: "Higuma",
  printings: [
    {
      id: "ST08-008",
      artId: "ST08-008",
      setCode: "ST08",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-008.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["Mountain Bandits"],
  cost: 1,
  power: 2000,
  counter: 1000,
  attribute: "slash",
  effect: "[On Play] Give up to 1 of your opponent's Characters −2 cost during this turn.",
  effects: {
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
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st08Higuma008I18n,
};
