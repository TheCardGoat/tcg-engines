import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteMontDOr072I18n } from "./072-charlotte-mont-d-or.i18n.ts";

export const op11CharlotteMontDOr072: CharacterCard = {
  id: "OP11-072",
  canonicalId: "OP11-072",
  slug: "charlotte-mont-d-or",
  name: "Charlotte Mont-d'or",
  printings: [
    {
      id: "OP11-072",
      artId: "OP11-072",
      setCode: "OP11",
      collectorNumber: "072",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-072.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! −1, You may rest this Character: Your opponent places 2 cards from their trash at the bottom of their deck in any order. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["trash"],
              count: {
                amount: 2,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
            order: "any",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11CharlotteMontDOr072I18n,
};
