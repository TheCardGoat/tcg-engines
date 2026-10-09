import type { CharacterCard } from "@tcg/op-types";
import { st10Sanji004I18n } from "./st10-004-sanji.i18n.ts";
export const st10Sanji004: CharacterCard = {
  id: "ST10-004",
  canonicalId: "ST10-004",
  slug: "sanji/st10-004",
  name: "Sanji",
  printings: [
    {
      id: "ST10-004",
      artId: "ST10-004",
      setCode: "ST10",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-004.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST10",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] If your opponent has a Character with 5000 or more power, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "existsOnField",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 5000,
              },
            ],
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
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st10Sanji004I18n,
};
