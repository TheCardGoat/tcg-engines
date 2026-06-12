import type { CharacterCard } from "@tcg/op-types";
import { op12Sengoku047I18n } from "./047-sengoku.i18n.ts";

export const op12Sengoku047: CharacterCard = {
  id: "OP12-047",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP12",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    '[On Play] You may trash 1 card from your hand: Look at 5 cards from the top of your deck; reveal up to 2 "Navy" type cards other than [Sengoku] and add them to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
              amount: 2,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "excludeName",
                value: "Sengoku",
              },
              {
                filter: "trait",
                value: "Navy",
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
  i18n: op12Sengoku047I18n,
};
