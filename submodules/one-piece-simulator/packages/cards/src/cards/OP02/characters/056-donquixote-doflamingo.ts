import type { CharacterCard } from "@tcg/op-types";
import { op02DonquixoteDoflamingo056I18n } from "./056-donquixote-doflamingo.i18n.ts";

export const op02DonquixoteDoflamingo056: CharacterCard = {
  id: "OP02-056",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  power: 2000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[On Play] Look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order. [DON!! x1] [When Attacking] You may trash 1 card from your hand: Place up to 1 of your opponent's Characters with a cost of 1 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
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
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02DonquixoteDoflamingo056I18n,
};
