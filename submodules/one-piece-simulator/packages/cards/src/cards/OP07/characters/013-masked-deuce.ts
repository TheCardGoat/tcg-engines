import type { CharacterCard } from "@tcg/op-types";
import { op07MaskedDeuce013I18n } from "./013-masked-deuce.i18n.ts";

export const op07MaskedDeuce013: CharacterCard = {
  id: "OP07-013",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Spade Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader is [Portgas.D.Ace], look at 5 cards from the top of your deck; reveal up to 1 [Portgas.D.Ace] or red Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Portgas.D.Ace",
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
                filter: "name",
                value: "Portgas.D.Ace",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op07MaskedDeuce013I18n,
};
