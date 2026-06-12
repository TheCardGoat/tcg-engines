import type { CharacterCard } from "@tcg/op-types";
import { op12Koala086I18n } from "./086-koala.i18n.ts";

export const op12Koala086: CharacterCard = {
  id: "OP12-086",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-086_p1_MnG1Gpi.jpg",
      imageId: "OP12-086_p1",
    },
  ],
  effect:
    '[On Play] If your Leader has the "Revolutionary Army" type, look at 3 cards from the top of your deck; reveal up to 1 "Revolutionary Army" type card other than [Koala] or up to 1 [Nico Robin] and add it to your hand. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
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
                value: "Koala",
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op12Koala086I18n,
};
