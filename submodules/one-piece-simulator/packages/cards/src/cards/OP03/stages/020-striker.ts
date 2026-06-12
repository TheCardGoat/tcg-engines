import type { StageCard } from "@tcg/op-types";
import { op03Striker020I18n } from "./020-striker.i18n.ts";

export const op03Striker020: StageCard = {
  id: "OP03-020",
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Activate:Main] (2) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Stage: If your Leader is [Portgas.D.Ace], look at 5 cards from the top of your deck; reveal up to 1 Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Portgas.D.Ace",
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Striker020I18n,
};
