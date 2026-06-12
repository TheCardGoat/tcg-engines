import type { CharacterCard } from "@tcg/op-types";
import { op04Apis041I18n } from "./041-apis.i18n.ts";

export const op04Apis041: CharacterCard = {
  id: "OP04-041",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "[On Play] You may trash 2 cards from your hand: Look at 5 cards from the top of your deck; reveal up to 1 [East Blue] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
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
                filter: "trait",
                value: "East Blue",
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
  i18n: op04Apis041I18n,
};
