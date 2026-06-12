import type { CharacterCard } from "@tcg/op-types";
import { op10MonkeyDLuffy118I18n } from "./118-monkey-d-luffy.i18n.ts";

export const op10MonkeyDLuffy118: CharacterCard = {
  id: "OP10-118",
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP10",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas Dressrosa"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-118_p1.jpg",
      imageId: "OP10-118_p1",
    },
  ],
  effect:
    "Once per turn, this Character cannot be K.O.'d by your opponent's effects.\n[When Attacking] You may place 3 cards from your trash at the bottom of your deck in any order: If your opponent has 5 or more cards in their hand, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10MonkeyDLuffy118I18n,
};
