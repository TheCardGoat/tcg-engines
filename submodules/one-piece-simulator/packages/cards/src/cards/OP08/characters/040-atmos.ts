import type { CharacterCard } from "@tcg/op-types";
import { op08Atmos040I18n } from "./040-atmos.i18n.ts";

export const op08Atmos040: CharacterCard = {
  id: "OP08-040",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    '[On Play] You may reveal 2 cards with a type including "Whitebeard Piratess" from your hand: If your Leader\'s type includes "Whitebeard Piratess", return up to 1 of your opponent\'s Characters with a cost of 4 or less to the owner\'s hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Piratess",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
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
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Atmos040I18n,
};
