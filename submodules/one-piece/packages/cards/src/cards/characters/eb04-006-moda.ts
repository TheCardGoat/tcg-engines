import type { CharacterCard } from "@tcg/op-types";
import { eb04Moda006I18n } from "./eb04-006-moda.i18n.ts";

export const eb04Moda006: CharacterCard = {
  id: "EB04-006",
  canonicalId: "EB04-006",
  slug: "moda/eb04-006",
  name: "Moda",
  printings: [
    {
      id: "EB04-006",
      artId: "EB04-006",
      setCode: "EB04",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-006_qcvWGuu.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB04",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Lulucia Kingdom"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 7 cards from the top of your deck; reveal up to 1 [Lulucia Kingdom] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 7,
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
                filter: "name",
                value: "Lulucia Kingdom",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb04Moda006I18n,
};
