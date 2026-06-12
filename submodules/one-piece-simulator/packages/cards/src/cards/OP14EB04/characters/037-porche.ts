import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Porche037I18n } from "./037-porche.i18n.ts";

export const op14eb04Porche037: CharacterCard = {
  id: "EB04-037",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Foxy Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader has the {Foxy Pirates} type, look at 5 cards from the top of your deck; reveal up to 1 {Foxy Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Foxy Pirates",
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
                value: "Foxy Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Porche037I18n,
};
