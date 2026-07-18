import type { CharacterCard } from "@tcg/op-types";
import { op10MonkeyDLuffy118I18n } from "./118-monkey-d-luffy.i18n.ts";

export const op10MonkeyDLuffy118: CharacterCard = {
  id: "OP10-118",
  canonicalId: "OP10-118",
  slug: "monkey-d-luffy/op10-118",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP10-118",
      artId: "OP10-118",
      setCode: "OP10",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-118.jpg",
    },
    {
      id: "OP10-118_p1",
      artId: "OP10-118_p1",
      setCode: "OP10",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-118_p1.jpg",
    },
  ],
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
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 3,
            position: "bottom",
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 5,
            },
          },
        ],
        optional: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "sequence",
          actions: [],
        },
        oncePerTurn: true,
        mandatory: true,
      },
    ],
  },
  i18n: op10MonkeyDLuffy118I18n,
};
