import type { CharacterCard } from "@tcg/op-types";
import { op08SouthBird100I18n } from "./100-south-bird.i18n.ts";

export const op08SouthBird100: CharacterCard = {
  id: "OP08-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Animal Sky Island Jaya"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 7 cards from the top of your deck and play up to 1 [Upper Yard]. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 7,
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
                filter: "name",
                value: "Upper Yard",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op08SouthBird100I18n,
};
