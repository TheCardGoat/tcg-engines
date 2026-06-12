import type { CharacterCard } from "@tcg/op-types";
import { op09Mr3Galdino056I18n } from "./056-mr-3-galdino.i18n.ts";

export const op09Mr3Galdino056: CharacterCard = {
  id: "OP09-056",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Former Baroque Works Cross Guild"],
  attribute: "special",
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Cross Guild" type card or card with a type including "Baroque Works" other than [Mr.3(Galdino)] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "Mr.3(Galdino)",
              },
              {
                filter: "trait",
                value: "Cross Guild",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op09Mr3Galdino056I18n,
};
