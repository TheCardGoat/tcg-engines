import type { CharacterCard } from "@tcg/op-types";
import { eb02Magellan038I18n } from "./038-magellan.i18n.ts";

export const eb02Magellan038: CharacterCard = {
  id: "EB02-038",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "special",
  effect:
    '[On Play] Play up to 1 "Impel Down" type Character card with a cost of 2 or less from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Impel Down",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02Magellan038I18n,
};
