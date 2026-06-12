import type { CharacterCard } from "@tcg/op-types";
import { op08JewelryBonneySp007I18n } from "./007-jewelry-bonney-sp.i18n.ts";

export const op08JewelryBonneySp007: CharacterCard = {
  id: "ST02-007",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    "[Activate: Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Look at 5 cards from the top of your deck; reveal up to 1 {Supernovas} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                value: "Supernovas",
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
  i18n: op08JewelryBonneySp007I18n,
};
