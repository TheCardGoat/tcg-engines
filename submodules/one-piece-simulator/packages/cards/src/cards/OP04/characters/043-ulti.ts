import type { CharacterCard } from "@tcg/op-types";
import { op04Ulti043I18n } from "./043-ulti.i18n.ts";

export const op04Ulti043: CharacterCard = {
  id: "OP04-043",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Return up to 1 Character with a cost of 2 or less to the owner's hand or the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        value: 2,
                      },
                    ],
                  },
                },
              ],
              [
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
                        value: 2,
                      },
                    ],
                  },
                  position: "bottom",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op04Ulti043I18n,
};
