import type { CharacterCard } from "@tcg/op-types";
import { op13SaintMjosgard092I18n } from "./092-saint-mjosgard.i18n.ts";

export const op13SaintMjosgard092: CharacterCard = {
  id: "OP13-092",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Celestial Dragons"],
  attribute: "wisdom",
  effect:
    '[On Play] If you have 3 or less Life cards, play up to 1 "Mary Geoise" type Stage card with a cost of 1 from your trash.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 3,
          },
        ],
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
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "trait",
                value: "Mary Geoise",
              },
              {
                filter: "cardCategory",
                value: "stage",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op13SaintMjosgard092I18n,
};
