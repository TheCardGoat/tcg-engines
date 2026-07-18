import type { CharacterCard } from "@tcg/op-types";
import { op11Gotti050I18n } from "./050-gotti.i18n.ts";

export const op11Gotti050: CharacterCard = {
  id: "OP11-050",
  canonicalId: "OP11-050",
  slug: "gotti",
  name: "Gotti",
  printings: [
    {
      id: "OP11-050",
      artId: "OP11-050",
      setCode: "OP11",
      collectorNumber: "050",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-050.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Firetank Pirates"],
  attribute: "ranged",
  effect:
    '[When Attacking] You may trash 1 "Firetank Pirates" type card from your hand: Return up to 1 Character with a cost of 1 or less to the owner\'s hand or place it at the bottom of their deck.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Firetank Pirates",
                match: "includes",
              },
            ],
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
                    player: "any",
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
                },
              ],
              [
                {
                  action: "returnToDeck",
                  target: {
                    player: "any",
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
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Gotti050I18n,
};
