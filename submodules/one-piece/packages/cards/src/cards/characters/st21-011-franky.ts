import type { CharacterCard } from "@tcg/op-types";
import { st21Franky011I18n } from "./st21-011-franky.i18n.ts";
export const st21Franky011: CharacterCard = {
  id: "ST21-011",
  canonicalId: "ST21-011",
  slug: "franky/st21-011",
  name: "Franky",
  printings: [
    {
      id: "ST21-011",
      artId: "ST21-011",
      setCode: "ST21",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-011.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST21",
  cost: 3,
  traits: ["Straw Hat Crew"],
  power: 4000,
  attribute: "strike",
  counter: 1000,
  effect:
    "[DON!! x2] [Opponent's Turn] All of your {Straw Hat Crew} type Characters with 4000 base power or less gain +1000 power.",
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
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "exact",
                },
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 4000,
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
  i18n: st21Franky011I18n,
};
