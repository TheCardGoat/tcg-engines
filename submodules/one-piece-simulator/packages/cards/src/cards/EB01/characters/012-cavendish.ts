import type { CharacterCard } from "@tcg/op-types";
import { eb01Cavendish012I18n } from "./012-cavendish.i18n.ts";

export const eb01Cavendish012: CharacterCard = {
  id: "EB01-012",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "EB01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Beautiful Pirates Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-012_p1.jpg",
      imageId: "EB01-012_p1",
    },
  ],
  effect:
    "[On Play]/[When Attacking] If your Leader has the [Supernovas] type and you have no other [Cavendish] Characters, set up to 2 of your DON!! cards as active.",
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
  i18n: eb01Cavendish012I18n,
};
