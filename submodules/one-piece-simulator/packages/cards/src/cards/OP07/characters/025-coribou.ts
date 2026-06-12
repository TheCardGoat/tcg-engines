import type { CharacterCard } from "@tcg/op-types";
import { op07Coribou025I18n } from "./025-coribou.i18n.ts";

export const op07Coribou025: CharacterCard = {
  id: "OP07-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 3000,
  traits: ["Caribou Pirates Supernovas"],
  attribute: "strike",
  effect: "[On Play] Play up to 1 [Caribou] with a cost of 4 or less from your hand rested.",
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
                value: 4,
              },
              {
                filter: "name",
                value: "Caribou",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op07Coribou025I18n,
};
