import type { EventCard } from "@tcg/op-types";
import { eb01OffWhite019I18n } from "./019-off-white.i18n.ts";

export const eb01OffWhite019: EventCard = {
  id: "EB01-019",
  canonicalId: "EB01-019",
  slug: "off-white",
  name: "Off-White",
  printings: [
    {
      id: "EB01-019",
      artId: "EB01-019",
      setCode: "EB01",
      collectorNumber: "019",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-019.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "EB01",
  cost: 2,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, look at 3 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
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
                value: "Donquixote Pirates",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb01OffWhite019I18n,
};
