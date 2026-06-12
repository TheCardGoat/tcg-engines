import type { CharacterCard } from "@tcg/op-types";
import { op12ZoroJuurouSp004I18n } from "./004-zoro-juurou-sp.i18n.ts";

export const op12ZoroJuurouSp004: CharacterCard = {
  id: "ST18-004",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP12",
  cost: 4,
  power: 6000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 purple "Straw Hat Crew" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "color",
                value: "purple",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12ZoroJuurouSp004I18n,
};
