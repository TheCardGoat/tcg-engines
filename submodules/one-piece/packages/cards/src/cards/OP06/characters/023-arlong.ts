import type { CharacterCard } from "@tcg/op-types";
import { op06Arlong023I18n } from "./023-arlong.i18n.ts";

export const op06Arlong023: CharacterCard = {
  id: "OP06-023",
  canonicalId: "OP06-023",
  slug: "arlong/op06-023",
  name: "Arlong",
  printings: [
    {
      id: "OP06-023",
      artId: "OP06-023",
      setCode: "OP06",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-023.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 6000,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Fish-Man", "East Blue", "Arlong Pirates"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: Up to 1 of your opponent's rested Leader cannot attack until the end of your opponent's next turn.",
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
  i18n: op06Arlong023I18n,
};
