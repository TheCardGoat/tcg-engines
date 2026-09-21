import type { CharacterCard } from "@tcg/op-types";
import { op17Streusen113I18n } from "./op17-113-streusen.i18n.ts";

export const op17Streusen113: CharacterCard = {
  id: "OP17-113",
  canonicalId: "OP17-113",
  slug: "streusen/op17-113",
  name: "Streusen",
  printings: [
    {
      id: "OP17-113",
      artId: "OP17-113",
      setCode: "OP17",
      collectorNumber: "113",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-113_YNn2Qyu.jpg",
      label: "Streusen (113)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP17",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 {Big Mom Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "trait",
                value: "Big Mom Pirates",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op17Streusen113I18n,
};
