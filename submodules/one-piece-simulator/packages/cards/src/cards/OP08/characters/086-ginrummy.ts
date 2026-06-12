import type { CharacterCard } from "@tcg/op-types";
import { op08Ginrummy086I18n } from "./086-ginrummy.i18n.ts";

export const op08Ginrummy086: CharacterCard = {
  id: "OP08-086",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "strike",
  effect:
    "[On Play] If your opponent has a Character with a cost of 0, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
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
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op08Ginrummy086I18n,
};
