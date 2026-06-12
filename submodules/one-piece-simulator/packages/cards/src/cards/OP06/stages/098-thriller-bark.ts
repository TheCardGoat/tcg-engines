import type { StageCard } from "@tcg/op-types";
import { op06ThrillerBark098I18n } from "./098-thriller-bark.i18n.ts";

export const op06ThrillerBark098: StageCard = {
  id: "OP06-098",
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  traits: ["Thriller Bark Pirates"],
  effect:
    "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Stage: If your Leader has the [Thriller Bark Pirates] type, play up to 1 [Thriller Bark Pirates] type Character card with a cost of 2 or less from your trash rested.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Thriller Bark Pirates",
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06ThrillerBark098I18n,
};
