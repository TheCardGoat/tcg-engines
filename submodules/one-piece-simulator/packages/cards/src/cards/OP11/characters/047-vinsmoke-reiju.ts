import type { CharacterCard } from "@tcg/op-types";
import { op11VinsmokeReiju047I18n } from "./047-vinsmoke-reiju.i18n.ts";

export const op11VinsmokeReiju047: CharacterCard = {
  id: "OP11-047",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-047_p1.jpg",
      imageId: "OP11-047_p1",
    },
  ],
  effect:
    '[On Play] If your Leader has the "The Vinsmoke Family" type, look at 5 cards from the top of your deck; reveal up to 1 card with a type including "GERMA" and add it to your hand. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Vinsmoke Family",
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
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op11VinsmokeReiju047I18n,
};
