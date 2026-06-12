import type { CharacterCard } from "@tcg/op-types";
import { op03Kokoro062I18n } from "./062-kokoro.i18n.ts";

export const op03Kokoro062: CharacterCard = {
  id: "OP03-062",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP03",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Water Seven Merfolk"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Water Seven] type card other than [Kokoro] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "excludeName",
                value: "Kokoro",
              },
              {
                filter: "trait",
                value: "Water Seven",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op03Kokoro062I18n,
};
