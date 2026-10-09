import type { CharacterCard } from "@tcg/op-types";
import { st05DouglasBullet011I18n } from "./st05-011-douglas-bullet.i18n.ts";

export const st05DouglasBullet011: CharacterCard = {
  id: "ST05-011",
  canonicalId: "ST05-011",
  slug: "douglas-bullet/st05-011",
  name: "Douglas Bullet",
  printings: [
    {
      id: "ST05-011",
      artId: "ST05-011",
      setCode: "ST05",
      collectorNumber: "011",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-011.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST05",
  cost: 8,
  power: 10000,
  traits: ["FILM", "The Pirates Fest"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! −4 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 2 of your opponent's Characters with a cost of 6 or less. Then, this Character gains [Double Attack] during this turn. (This card deals 2 damage.)",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 4,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
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
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st05DouglasBullet011I18n,
};
