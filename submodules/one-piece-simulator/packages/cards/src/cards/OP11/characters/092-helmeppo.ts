import type { CharacterCard } from "@tcg/op-types";
import { op11Helmeppo092I18n } from "./092-helmeppo.i18n.ts";

export const op11Helmeppo092: CharacterCard = {
  id: "OP11-092",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP11",
  cost: 6,
  power: 7000,
  traits: ["Navy SWORD"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-092_p1.jpg",
      imageId: "OP11-092_p1",
    },
  ],
  effect:
    '[On Play] You may trash 1 card from your hand: Draw 1 card and play up to 1 "SWORD" type Character card with a cost of 8 or less other than [Helmeppo] from your trash. Then, place the 1 Character played by this effect at the bottom of the owner\'s deck at the end of this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Helmeppo",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 8,
              },
              {
                filter: "trait",
                value: "SWORD",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Helmeppo092I18n,
};
