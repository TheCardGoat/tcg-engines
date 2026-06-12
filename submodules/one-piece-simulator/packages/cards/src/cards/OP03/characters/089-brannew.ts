import type { CharacterCard } from "@tcg/op-types";
import { op03Brannew089I18n } from "./089-brannew.i18n.ts";

export const op03Brannew089: CharacterCard = {
  id: "OP03-089",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP03",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 [Navy] type card other than [Brannew] and add it to your hand. Then, trash the rest.",
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
                value: "Brannew",
              },
              {
                filter: "trait",
                value: "Navy",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op03Brannew089I18n,
};
