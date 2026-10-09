import type { CharacterCard } from "@tcg/op-types";
import { st14MonkeyDLuffy012I18n } from "./st14-012-monkey-d-luffy.i18n.ts";
export const st14MonkeyDLuffy012: CharacterCard = {
  id: "ST14-012",
  canonicalId: "ST14-012",
  slug: "monkey-d-luffy/st14-012",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST14-012",
      artId: "ST14-012",
      setCode: "ST14",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-012.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST14",
  cost: 8,
  traits: ["Straw Hat Crew"],
  power: 10000,
  attribute: "strike",
  effect:
    "If you have a Character with a cost of 10 or more, this Character gains [Rush]. (This card can attack on the turn in which it is played.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 10,
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
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st14MonkeyDLuffy012I18n,
};
