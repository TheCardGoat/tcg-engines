import type { CharacterCard } from "@tcg/op-types";
import { op01Uta005I18n } from "./005-uta.i18n.ts";

export const op01Uta005: CharacterCard = {
  id: "OP01-005",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP01",
  cost: 4,
  power: 4000,
  traits: ["Film"],
  attribute: "special",
  effect:
    "[On Play] Add up to 1 red Character card other than [Uta] with a cost of 3 or less from your trash to your hand.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "red",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "excludeName",
                  value: "Uta",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01Uta005I18n,
};
