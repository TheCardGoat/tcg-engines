import type { CharacterCard } from "@tcg/op-types";
import { op13SaintShalria086I18n } from "./086-saint-shalria.i18n.ts";

export const op13SaintShalria086: CharacterCard = {
  id: "OP13-086",
  canonicalId: "OP13-086",
  slug: "saint-shalria",
  name: "Saint Shalria",
  printings: [
    {
      id: "OP13-086",
      artId: "OP13-086",
      setCode: "OP13",
      collectorNumber: "086",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-086_Yli6slR.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP13",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Celestial Dragons"],
  attribute: "ranged",
  effect:
    '[On Play] Look at 3 cards from the top of your deck; reveal up to 1 "Celestial Dragons" type card other than [Saint Shalria] and add it to your hand. Then, trash the rest and trash 1 card from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: "Saint Shalria",
              },
              {
                filter: "trait",
                value: "Celestial Dragons",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op13SaintShalria086I18n,
};
