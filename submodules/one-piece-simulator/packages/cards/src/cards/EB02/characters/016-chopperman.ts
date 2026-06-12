import type { CharacterCard } from "@tcg/op-types";
import { eb02Chopperman016I18n } from "./016-chopperman.i18n.ts";

export const eb02Chopperman016: CharacterCard = {
  id: "EB02-016",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew"],
  attribute: "strike",
  effect:
    'Also treat this card\'s name as [Tony Tony.Chopper] according to the rules.\n[On Play] Play up to 1 "Animal" type Character card with a cost of 3 or less from your hand.',
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
                value: 3,
              },
              {
                filter: "trait",
                value: "Animal",
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
  i18n: eb02Chopperman016I18n,
};
