import type { CharacterCard } from "@tcg/op-types";
import { eb01Brook045I18n } from "./045-brook.i18n.ts";

export const eb01Brook045: CharacterCard = {
  id: "EB01-045",
  canonicalId: "EB01-045",
  slug: "brook/eb01-045",
  name: "Brook",
  printings: [
    {
      id: "EB01-045",
      artId: "EB01-045",
      setCode: "EB01",
      collectorNumber: "045",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-045.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Rumbar Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your opponent has a Character with a cost of 0, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
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
  i18n: eb01Brook045I18n,
};
