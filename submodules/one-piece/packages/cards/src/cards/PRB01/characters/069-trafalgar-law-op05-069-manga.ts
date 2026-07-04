import type { CharacterCard } from "@tcg/op-types";
import { prb01TrafalgarLawOp05069Manga069I18n } from "./069-trafalgar-law-op05-069-manga.i18n.ts";

export const prb01TrafalgarLawOp05069Manga069: CharacterCard = {
  id: "OP05-069",
  canonicalId: "OP05-069",
  slug: "trafalgar-law-op05-069-manga",
  name: "Trafalgar Law (OP05-069) (Manga)",
  printings: [
    {
      id: "OP05-069",
      artId: "OP05-069",
      setCode: "PRB01",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-069_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB01",
  cost: 3,
  power: 5000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  effect:
    "[When Attacking] If your opponent has more DON!! cards on their field than you, look at 5 cards from the top of your deck; reveal up to 1 [Heart Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.Disclaimer: This card was reprinted from the original set without the original textured foil.",
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
  i18n: prb01TrafalgarLawOp05069Manga069I18n,
};
