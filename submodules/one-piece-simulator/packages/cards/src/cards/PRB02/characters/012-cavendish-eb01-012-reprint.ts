import type { CharacterCard } from "@tcg/op-types";
import { prb02CavendishEb01012Reprint012I18n } from "./012-cavendish-eb01-012-reprint.i18n.ts";

export const prb02CavendishEb01012Reprint012: CharacterCard = {
  id: "EB01-012",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Beautiful Pirates Supernovas"],
  attribute: "slash",
  effect:
    '[On Play]/[When Attacking] If your Leader has the [Supernovas] type and you have no other [Cavendish] Characters, set up to 2 of your DON!! cards as active.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Supernovas",
              },
              {
                condition: "notHasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "name",
                    value: "Cavendish",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Supernovas",
              },
              {
                condition: "notHasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "name",
                    value: "Cavendish",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: prb02CavendishEb01012Reprint012I18n,
};
