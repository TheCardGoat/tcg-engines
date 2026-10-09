import type { CharacterCard } from "@tcg/op-types";
import { st02TrafalgarLaw009I18n } from "./st02-009-trafalgar-law.i18n.ts";
export const st02TrafalgarLaw009: CharacterCard = {
  id: "ST02-009",
  canonicalId: "ST02-009",
  slug: "trafalgar-law/st02-009",
  name: "Trafalgar Law",
  printings: [
    {
      id: "ST02-009",
      artId: "ST02-009",
      setCode: "ST02",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-009.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Supernovas", "Heart Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Set up to 1 of your {Supernovas} or {Heart Pirates} type rested Characters with a cost of 5 or less as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  value: 5,
                  comparison: "lte",
                },
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "trait",
                      value: "Supernovas",
                      match: "exact",
                    },
                    {
                      filter: "trait",
                      value: "Heart Pirates",
                      match: "exact",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st02TrafalgarLaw009I18n,
};
