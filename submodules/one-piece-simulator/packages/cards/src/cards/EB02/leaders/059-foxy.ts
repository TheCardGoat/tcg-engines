import type { LeaderCard } from "@tcg/op-types";
import { eb02Foxy059I18n } from "./059-foxy.i18n.ts";

export const eb02Foxy059: LeaderCard = {
  id: "OP07-059",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["Foxy Pirates"],
  attribute: "special",
  effect:
    "[When Attacking] DON!! 3 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If you have 3 or more \"Foxy Pirates\" type Characters, select your opponent's rested Leader and up to 1 Character card. The selected cards will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 3,
            filters: [
              {
                filter: "trait",
                value: "Foxy Pirates",
              },
            ],
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb02Foxy059I18n,
};
