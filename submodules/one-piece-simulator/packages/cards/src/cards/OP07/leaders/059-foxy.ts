import type { LeaderCard } from "@tcg/op-types";
import { op07Foxy059I18n } from "./059-foxy.i18n.ts";

export const op07Foxy059: LeaderCard = {
  id: "OP07-059",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP07",
  power: 5000,
  life: 5,
  traits: ["Foxy Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-059_p1.jpg",
      imageId: "OP07-059_p1",
    },
  ],
  effect:
    "[When Attacking] DON!! -3 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If you have 3 or more [Foxy Pirates] type Characters, select your opponent's rested Leader and up to 1 Character card. The selected cards will not become active in your opponent's next Refresh Phase.",
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
  i18n: op07Foxy059I18n,
};
