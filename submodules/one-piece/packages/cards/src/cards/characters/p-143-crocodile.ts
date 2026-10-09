import type { CharacterCard } from "@tcg/op-types";
import { pCrocodile143I18n } from "./p-143-crocodile.i18n.ts";
export const pCrocodile143: CharacterCard = {
  id: "P-143",
  canonicalId: "P-143",
  slug: "crocodile/p-143",
  name: "Crocodile",
  printings: [
    {
      id: "P-143",
      artId: "P-143",
      setCode: "P",
      collectorNumber: "143",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-143.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 6,
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  power: 8000,
  attribute: "special",
  effect:
    "[On Play] If there is a Character with a cost of 0, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            comparison: "gte",
            value: 1,
            player: "any",
            zone: "character",
            filters: [
              {
                filter: "cost",
                value: 0,
                comparison: "eq",
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
  i18n: pCrocodile143I18n,
};
