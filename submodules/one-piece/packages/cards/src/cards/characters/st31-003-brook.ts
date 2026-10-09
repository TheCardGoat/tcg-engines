import type { CharacterCard } from "@tcg/op-types";
import { st31Brook003I18n } from "./st31-003-brook.i18n.ts";
export const st31Brook003: CharacterCard = {
  id: "ST31-003",
  canonicalId: "ST31-003",
  slug: "brook/st31-003",
  name: "Brook",
  printings: [
    {
      id: "ST31-003",
      artId: "ST31-003",
      setCode: "ST31",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST31-003.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST31",
  cost: 2,
  traits: ["Straw Hat Crew"],
  power: 3000,
  counter: 1000,
  attribute: "slash",
  effect:
    "[Opponent's Turn] If you have a total of 3 or more given DON!! cards, this Character gains [Blocker] and +3000 power. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "givenDonCount",
            player: "self",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st31Brook003I18n,
};
