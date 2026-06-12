import type { CharacterCard } from "@tcg/op-types";
import { op07BigBun070I18n } from "./070-big-bun.i18n.ts";

export const op07BigBun070: CharacterCard = {
  id: "OP07-070",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP07",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Fish-Man Giant Foxy Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, play up to 1 [Foxy Pirates] type card with a cost of 4 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
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
                value: 4,
              },
              {
                filter: "trait",
                value: "Foxy Pirates",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op07BigBun070I18n,
};
