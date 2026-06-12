import type { CharacterCard } from "@tcg/op-types";
import { op07GloriosaGrandmaNyon041I18n } from "./041-gloriosa-grandma-nyon.i18n.ts";

export const op07GloriosaGrandmaNyon041: CharacterCard = {
  id: "OP07-041",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Amazon Lily] or [Kuja Pirates] type card other than [Gloriosa (Grandma Nyon)] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Gloriosa (Grandma Nyon)",
              },
              {
                filter: "trait",
                value: "Amazon Lily",
              },
              {
                filter: "trait",
                value: "Kuja Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op07GloriosaGrandmaNyon041I18n,
};
