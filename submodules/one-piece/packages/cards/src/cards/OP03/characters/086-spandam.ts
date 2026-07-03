import type { CharacterCard } from "@tcg/op-types";
import { op03Spandam086I18n } from "./086-spandam.i18n.ts";

export const op03Spandam086: CharacterCard = {
  id: "OP03-086",
  canonicalId: "OP03-086",
  slug: "spandam/op03-086",
  name: "Spandam",
  printings: [
    {
      id: "OP03-086",
      artId: "OP03-086",
      setCode: "OP03",
      collectorNumber: "086",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-086.jpg",
    },
    {
      id: "OP03-086_p1",
      artId: "OP03-086_p1",
      setCode: "OP03",
      collectorNumber: "086",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-086_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP03",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-086_p1.jpg",
      imageId: "OP03-086_p1",
    },
  ],
  effect:
    '[On Play] If your Leader\'s type include "CP", look at 3 cards from the top of your deck; reveal up to 1 card with a type including "CP" other than [Spandam] and add it to your hand. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "CP",
          },
        ],
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
                filter: "excludeName",
                value: "Spandam",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op03Spandam086I18n,
};
