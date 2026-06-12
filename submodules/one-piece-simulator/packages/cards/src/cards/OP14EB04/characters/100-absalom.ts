import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Absalom100I18n } from "./100-absalom.i18n.ts";

export const op14eb04Absalom100: CharacterCard = {
  id: "OP14-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 3,
  power: 5000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "ranged",
  effect:
    "[On K.O.] Look at 3 cards from the top of your deck; reveal up to 1 {Thriller Bark Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Absalom100I18n,
};
