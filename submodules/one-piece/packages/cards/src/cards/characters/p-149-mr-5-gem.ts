import type { CharacterCard } from "@tcg/op-types";
import { pMr5Gem149I18n } from "./p-149-mr-5-gem.i18n.ts";
export const pMr5Gem149: CharacterCard = {
  id: "P-149",
  canonicalId: "P-149",
  slug: "mr-5-gem/p-149",
  name: "Mr.5(Gem)",
  printings: [
    {
      id: "P-149",
      artId: "P-149",
      setCode: "P",
      collectorNumber: "149",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-149.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 5,
  traits: ["Baroque Works"],
  power: 6000,
  attribute: "special",
  counter: 1000,
  effect:
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.) [On Play] If there is a Character with a cost of 0 or with a cost of 8 or more, draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["rushCharacter"],
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "cost",
                    value: 0,
                    comparison: "eq",
                  },
                  {
                    filter: "cost",
                    value: 8,
                    comparison: "gte",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: pMr5Gem149I18n,
};
