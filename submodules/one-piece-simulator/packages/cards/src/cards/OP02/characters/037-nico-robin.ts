import type { CharacterCard } from "@tcg/op-types";
import { op02NicoRobin037I18n } from "./037-nico-robin.i18n.ts";

export const op02NicoRobin037: CharacterCard = {
  id: "OP02-037",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Film Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Play up to 1 [FILM] or [Straw Hat Crew] type Character card with a cost of 2 or less from your hand.",
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
                value: "FILM",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
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
  i18n: op02NicoRobin037I18n,
};
