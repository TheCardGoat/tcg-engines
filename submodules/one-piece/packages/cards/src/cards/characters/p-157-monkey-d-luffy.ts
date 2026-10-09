import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy157I18n } from "./p-157-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy157: CharacterCard = {
  id: "P-157",
  canonicalId: "P-157",
  slug: "monkey-d-luffy/p-157",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-157",
      artId: "P-157",
      setCode: "P",
      collectorNumber: "157",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-157.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 7,
  traits: ["Elbaph", "The Four Emperors", "Straw Hat Crew"],
  power: 6000,
  attribute: "strike",
  counter: 1000,
  effect:
    "[On Play] You may trash 1 card from your hand: Play up to 1 {Elbaph} type Character card with a cost of 4 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        optional: true,
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "trait",
                value: "Elbaph",
                match: "exact",
              },
              {
                filter: "cost",
                value: 4,
                comparison: "lte",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy157I18n,
};
