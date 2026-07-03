import type { CharacterCard } from "@tcg/op-types";
import { op01XDrake114I18n } from "./114-x-drake.i18n.ts";

export const op01XDrake114: CharacterCard = {
  id: "OP01-114",
  canonicalId: "OP01-114",
  slug: "x-drake/op01-114",
  name: "X.Drake",
  printings: [
    {
      id: "OP01-114",
      artId: "OP01-114",
      setCode: "OP01",
      collectorNumber: "114",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-114.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP01",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates Drake Pirates Navy"],
  attribute: "slash",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op01XDrake114I18n,
};
