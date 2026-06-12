import type { CharacterCard } from "@tcg/op-types";
import { prb01ArlongJollyRogerFoil023I18n } from "./023-arlong-jolly-roger-foil.i18n.ts";

export const prb01ArlongJollyRogerFoil023: CharacterCard = {
  id: "OP06-023",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB01",
  cost: 4,
  power: 6000,
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_p3.jpg",
      imageId: "OP06-023_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_r1.png",
      imageId: "OP06-023_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023_p4.jpg",
      imageId: "OP06-023_p4",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from your hand: Up to 1 of your opponent's rested Leader cannot attack until the end of your opponent's next turn.[Trigger] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
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
            action: "cannotAttack",
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
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb01ArlongJollyRogerFoil023I18n,
};
