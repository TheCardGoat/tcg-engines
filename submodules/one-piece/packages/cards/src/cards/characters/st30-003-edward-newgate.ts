import type { CharacterCard } from "@tcg/op-types";
import { st30EdwardNewgate003I18n } from "./st30-003-edward-newgate.i18n.ts";
export const st30EdwardNewgate003: CharacterCard = {
  id: "ST30-003",
  canonicalId: "ST30-003",
  slug: "edward-newgate/st30-003",
  name: "Edward.Newgate",
  printings: [
    {
      id: "ST30-003",
      artId: "ST30-003",
      setCode: "ST30",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-003.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 8,
  traits: ["The Four Emperors", "Whitebeard Pirates"],
  power: 6000,
  attribute: "special",
  counter: 1000,
  effect: "[Your Turn] All of your Characters with 6000 base power gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "eq",
                  value: 6000,
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st30EdwardNewgate003I18n,
};
