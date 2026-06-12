import type { CharacterCard } from "@tcg/op-types";
import { op06RoronoaZoro118I18n } from "./118-roronoa-zoro.i18n.ts";

export const op06RoronoaZoro118: CharacterCard = {
  id: "OP06-118",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP06",
  cost: 9,
  power: 9000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-118_p1.jpg",
      imageId: "OP06-118_p1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-118_p2.jpg",
      imageId: "OP06-118_p2",
    },
  ],
  effect:
    "[When Attacking][Once Per Turn](1)(You may rest the specified number of DON!! cards in your cost area.): Set this Character as active.\n[Activate:Main][Once Per Turn](2)(You may rest the specified number of DON!! cards in your cost area.): Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06RoronoaZoro118I18n,
};
