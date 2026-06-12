import type { CharacterCard } from "@tcg/op-types";
import { op10CeaserSoldier007I18n } from "./007-ceaser-soldier.i18n.ts";

export const op10CeaserSoldier007: CharacterCard = {
  id: "OP10-007",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Punk Hazard"],
  attribute: "wisdom",
  effect:
    '[On Play] Play up to 1 "Punk Hazard" type Character card with a cost of 2 or less from your hand.',
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
                value: "Punk Hazard",
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
  i18n: op10CeaserSoldier007I18n,
};
