import type { CharacterCard } from "@tcg/op-types";
import { op05TrafalgarLaw069I18n } from "./069-trafalgar-law.i18n.ts";

export const op05TrafalgarLaw069: CharacterCard = {
  id: "OP05-069",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP05",
  cost: 3,
  power: 5000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-069_p1.jpg",
      imageId: "OP05-069_p1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-069_p2.jpg",
      imageId: "OP05-069_p2",
    },
  ],
  effect:
    "[When Attacking] If your opponent has more DON!! cards on their field than you, look at 5 cards from the top of your deck; reveal up to 1 [Heart Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lt",
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
                value: "Heart Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05TrafalgarLaw069I18n,
};
