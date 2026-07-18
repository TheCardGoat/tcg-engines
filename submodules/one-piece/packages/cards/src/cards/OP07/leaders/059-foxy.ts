import type { LeaderCard } from "@tcg/op-types";
import { op07Foxy059I18n } from "./059-foxy.i18n.ts";

export const op07Foxy059: LeaderCard = {
  id: "OP07-059",
  canonicalId: "OP07-059",
  slug: "foxy/op07-059",
  name: "Foxy",
  printings: [
    {
      id: "OP07-059",
      artId: "OP07-059",
      setCode: "OP07",
      collectorNumber: "059",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-059.jpg",
    },
    {
      id: "OP07-059_p1",
      artId: "OP07-059_p1",
      setCode: "OP07",
      collectorNumber: "059",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-059_p1.jpg",
    },
  ],
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
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "gte",
              value: 3,
              filters: [
                {
                  filter: "trait",
                  value: "Foxy Pirates",
                  match: "includes",
                },
              ],
            },
          },
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "gte",
              value: 3,
              filters: [
                {
                  filter: "trait",
                  value: "Foxy Pirates",
                  match: "includes",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07Foxy059I18n,
};
