import type { StageCard } from "@tcg/op-types";
import { op05UpperYard117I18n } from "./117-upper-yard.i18n.ts";

export const op05UpperYard117: StageCard = {
  id: "OP05-117",
  cardType: "stage",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  traits: ["Sky Island"],
  effect:
    "[On Play] Look at the top 5 cards of your deck; reveal up to 1 [Sky Island] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                filter: "trait",
                value: "Sky Island",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05UpperYard117I18n,
};
