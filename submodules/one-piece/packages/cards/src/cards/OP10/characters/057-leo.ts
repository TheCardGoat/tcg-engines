import type { CharacterCard } from "@tcg/op-types";
import { op10Leo057I18n } from "./057-leo.i18n.ts";

export const op10Leo057: CharacterCard = {
  id: "OP10-057",
  canonicalId: "OP10-057",
  slug: "leo/op10-057",
  name: "Leo",
  printings: [
    {
      id: "OP10-057",
      artId: "OP10-057",
      setCode: "OP10",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-057.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Dressrosa The Tontattas"],
  attribute: "strike",
  effect:
    '[On Play] You may rest your Leader or 1 of your Stage cards: If your Leader is [Usopp], look at 5 cards from the top of your deck; reveal up to 2 "Dressrosa" type cards other than [Leo] and add them to your hand. Then, place the rest at the bottom of your deck in any order, and trash 1 card from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Usopp",
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
                value: "Leo",
              },
              {
                filter: "trait",
                value: "Dressrosa",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Leo057I18n,
};
