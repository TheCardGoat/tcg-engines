import type { CharacterCard } from "@tcg/op-types";
import { op04Stussy084I18n } from "./084-stussy.i18n.ts";

export const op04Stussy084: CharacterCard = {
  id: "OP04-084",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 3000,
  traits: ["CP0"],
  attribute: "special",
  effect:
    '[On Play] Look at 3 cards from the top of your deck and play up to 1 Character card with a type including "CP" other than [Stussy] and a cost of 2 or less. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                filter: "excludeName",
                value: "Stussy",
              },
            ],
            revealDestination: "character",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op04Stussy084I18n,
};
