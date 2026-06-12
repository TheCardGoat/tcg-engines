import type { CharacterCard } from "@tcg/op-types";
import { op10EustassCaptainKid112I18n } from "./112-eustass-captain-kid.i18n.ts";

export const op10EustassCaptainKid112: CharacterCard = {
  id: "OP10-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP10",
  cost: 8,
  power: 9000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-112_p1.jpg",
      imageId: "OP10-112_p1",
    },
  ],
  effect:
    "[On Play] You may rest this Character: Trash up to 1 card from the top of your opponent's Life cards.\n[End of Your Turn] If your opponent has 2 or less Life cards, draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
        optional: true,
      },
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op10EustassCaptainKid112I18n,
};
