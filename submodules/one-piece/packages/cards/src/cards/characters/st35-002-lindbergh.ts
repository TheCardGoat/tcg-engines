import type { CharacterCard } from "@tcg/op-types";
import { st35Lindbergh002I18n } from "./st35-002-lindbergh.i18n.ts";
export const st35Lindbergh002: CharacterCard = {
  id: "ST35-002",
  canonicalId: "ST35-002",
  slug: "lindbergh/st35-002",
  name: "Lindbergh",
  printings: [
    {
      id: "ST35-002",
      artId: "ST35-002",
      setCode: "ST35",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST35-002.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST35",
  cost: 4,
  traits: ["Minks", "Revolutionary Army"],
  power: 4000,
  attribute: "special",
  counter: 2000,
  effect: "[On Play] Give up to 1 of your opponent's Characters −3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st35Lindbergh002I18n,
};
