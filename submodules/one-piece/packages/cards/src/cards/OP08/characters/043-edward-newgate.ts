import type { CharacterCard } from "@tcg/op-types";
import { op08EdwardNewgate043I18n } from "./043-edward-newgate.i18n.ts";

export const op08EdwardNewgate043: CharacterCard = {
  id: "OP08-043",
  canonicalId: "OP08-043",
  slug: "edward-newgate/op08-043",
  name: "Edward.Newgate",
  printings: [
    {
      id: "OP08-043",
      artId: "OP08-043",
      setCode: "OP08",
      collectorNumber: "043",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-043.jpg",
    },
    {
      id: "OP08-043_p1",
      artId: "OP08-043_p1",
      setCode: "OP08",
      collectorNumber: "043",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-043_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP08",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-043_p1.jpg",
      imageId: "OP08-043_p1",
    },
  ],
  effect:
    "[On Play] If your Leader's type includes \"Whitebeard Pirates\" and you have 2 or less Life cards, select all of your opponent's Characters on their field. Until the end of your opponent's next turn, none of the selected Characters can attack unless your opponent trashes 2 cards from their hand whenever they attack.",
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
                trait: "Whitebeard Pirates",
                match: "includes",
              },
              {
                condition: "lifeCount",
                player: "self",
                comparison: "lte",
                value: 2,
              },
            ],
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            duration: "untilEndOfOpponentNextTurn",
            unlessTrashFromHand: 2,
          },
        ],
      },
    ],
  },
  i18n: op08EdwardNewgate043I18n,
};
