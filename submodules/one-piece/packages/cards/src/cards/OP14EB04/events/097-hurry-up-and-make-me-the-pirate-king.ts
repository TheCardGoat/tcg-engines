import type { EventCard } from "@tcg/op-types";
import { op14eb04HurryUpAndMakeMeThePirateKing097I18n } from "./097-hurry-up-and-make-me-the-pirate-king.i18n.ts";

export const op14eb04HurryUpAndMakeMeThePirateKing097: EventCard = {
  id: "OP14-097",
  canonicalId: "OP14-097",
  slug: "hurry-up-and-make-me-the-pirate-king",
  name: "Hurry Up and Make Me the Pirate King!",
  printings: [
    {
      id: "OP14-097",
      artId: "OP14-097",
      setCode: "OP14EB04",
      collectorNumber: "097",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-097_V4b4ZRv.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  effect:
    "[Main] Look at 3 cards from the top of your deck; reveal up to 1 {Thriller Bark Pirates} type card other than [Hurry Up and Make Me the Pirate King!] and add it to your hand. Then, trash the rest.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                value: "Hurry Up and Make Me the Pirate King!",
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op14eb04HurryUpAndMakeMeThePirateKing097I18n,
};
