import type { CharacterCard } from "@tcg/op-types";
import { st30MonkeyDLuffy012I18n } from "./st30-012-monkey-d-luffy.i18n.ts";
export const st30MonkeyDLuffy012: CharacterCard = {
  id: "ST30-012",
  canonicalId: "ST30-012",
  slug: "monkey-d-luffy/st30-012",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST30-012",
      artId: "ST30-012",
      setCode: "ST30",
      collectorNumber: "012",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-012.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST30",
  cost: 4,
  traits: ["Impel Down", "Straw Hat Crew"],
  power: 6000,
  attribute: "strike",
  effect:
    "[On Play] You may rest 1 of your DON!! cards: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.) [When Attacking] Rest up to 1 of your opponent's [Blocker] Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 1,
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
        optional: true,
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "hasKeyword",
                  value: "blocker",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st30MonkeyDLuffy012I18n,
};
