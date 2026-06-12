import type { CharacterCard } from "@tcg/op-types";
import { op08Wanda034I18n } from "./034-wanda.i18n.ts";

export const op08Wanda034: CharacterCard = {
  id: "OP08-034",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Minks] type card other than [Wanda] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Wanda",
              },
              {
                filter: "trait",
                value: "Minks",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op08Wanda034I18n,
};
