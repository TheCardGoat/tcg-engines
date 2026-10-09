import type { CharacterCard } from "@tcg/op-types";
import { st21Usopp002I18n } from "./st21-002-usopp.i18n.ts";
export const st21Usopp002: CharacterCard = {
  id: "ST21-002",
  canonicalId: "ST21-002",
  slug: "usopp/st21-002",
  name: "Usopp",
  printings: [
    {
      id: "ST21-002",
      artId: "ST21-002",
      setCode: "ST21",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-002.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST21",
  cost: 2,
  traits: ["Straw Hat Crew"],
  power: 3000,
  attribute: "ranged",
  counter: 2000,
  effect: "[DON!! x2] [Opponent's Turn] This Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "turn",
            value: "opponent",
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st21Usopp002I18n,
};
