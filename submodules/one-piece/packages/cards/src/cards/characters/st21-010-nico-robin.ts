import type { CharacterCard } from "@tcg/op-types";
import { st21NicoRobin010I18n } from "./st21-010-nico-robin.i18n.ts";
export const st21NicoRobin010: CharacterCard = {
  id: "ST21-010",
  canonicalId: "ST21-010",
  slug: "nico-robin/st21-010",
  name: "Nico Robin",
  printings: [
    {
      id: "ST21-010",
      artId: "ST21-010",
      setCode: "ST21",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-010.png",
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
    "[DON!! x2] [When Attacking] K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st21NicoRobin010I18n,
};
