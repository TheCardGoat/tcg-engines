import type { CharacterCard } from "@tcg/op-types";
import { op13StMarcusMars091I18n } from "./091-st-marcus-mars.i18n.ts";

export const op13StMarcusMars091: CharacterCard = {
  id: "OP13-091",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP13",
  cost: 6,
  power: 5000,
  counter: 1000,
  traits: ["Celestial Dragons Five Elders"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-091_p1_lf28Mou.jpg",
      imageId: "OP13-091_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-091_p2.jpg",
      imageId: "OP13-091_p2",
    },
  ],
  effect:
    "If you have 7 or more cards in your trash, this Character cannot be removed from the field by your opponent's effects and gains [Blocker].\n[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a base cost of 5 or less.",
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
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13StMarcusMars091I18n,
};
